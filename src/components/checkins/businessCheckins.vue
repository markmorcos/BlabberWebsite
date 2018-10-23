<template>

    <div v-if="business != null">
        <checkin-form :business="business"></checkin-form>
        <div class="columns">
            <div class="column is-two-thirds" v-infinite-scroll="loadMore" infinite-scroll-disabled="checkinsBusy"
                 infinite-scroll-distance="10">
                <article class="media" v-for="checkin in checkins">
                    <figure class="media-left">
                        <p class="image is-64x64">
                            <img :src="checkin.user.profile_photo">
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <p style="margin-bottom: 0">
                                <router-link :to="{ name: 'Profile', params: { name: getSlug(checkin.user.name), id:checkin.user.id }}">{{ checkin.user.name }}</router-link>
                                <small>{{checkin.user.username}}</small>
                                <small>{{getTimeFormatted(checkin.created)}}</small>
                                <small v-if="parseInt(checkin.rating) > 0">
                                    <br>
                                    <i class="fa fa-star" v-for="n in parseInt(checkin.rating)"></i>
                                </small>
                            </p>
                        </div>
                        <nav class="level is-mobile">
                            <div class="level-left">
                                <a class="level-item" v-if="checkin.user.id == Auth.user().id"
                                   @click="deleteCheckin(checkin)">
                                    <span class="icon is-small">
                                        <i class="fa fa-trash"></i>
                                    </span>
                                </a>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>

        </div>
        <div class="container">
            <div class="notification is-info" v-if="checkinsBusy">
                <p>Loading Checkins <i class="pull-right fa fa-spinner fa-spin"></i></p>
            </div>

            <div style="display: none" class="notification is-warning" v-if="hasNoMoreCheckins()">
                <p>No more checkins to load</p>
            </div>
        </div>
    </div>

</template>

<script>
    import Auth from '../../services/auth';
    import CheckinForm from '../forms/checkinForm.vue';
    import Helpers from '../../utilities/helpers';

    export default {
        name: 'businesscheckins',

        props: {
            business: null,
        },

        data() {
            return {
                checkins: [],
                checkinsPage: 1,
                checkinsMaxPages: 1,
                checkinsBusy: false,
                Auth: Auth,
            }
        },

        components: {
            checkinForm: CheckinForm,
        },

        mounted() {
            this.getBusinessCheckins();

            this.listenForCheckinCreated();
        },

        methods: {

            /**
             * Listen for when a checkin is created reload the checkins.
             */
            listenForCheckinCreated() {
                let vm = this;
                Event.$on('checkin-created', () => {
                    vm.reset()
                    vm.getBusinessCheckins();
                });
            },

            /**
             * Get the category checkins.
             */
            getBusinessCheckins() {
                axios
                    .get('/get-checkins', {params: {business_id_to_get: this.business.id, page: this.checkinsPage}})
                    .then(response => {
                        this.checkinsMaxPages = response.data.pagination.total_pages_no;
                        this.checkins = this.checkins.concat(response.data.checkins);
                        this.checkinsBusy = false;
                    });
            },

            /**
             * Load more checkins on scroll
             */
            loadMore() {
                if (this.checkins.length > 0) {
                    this.checkinsBusy = true;

                    if (this.checkinsPage == this.checkinsMaxPages) {
                        this.checkinsBusy = false;
                        return;
                    }

                    this.checkinsPage++;
                    this.getBusinessCheckins();
                }
            },

            /**
             * Check if there are no more checkins to load.
             */
            hasNoMoreCheckins() {
                return this.checkinsPage >= this.checkinsMaxPages && !this.checkinsBusy;
            },

            /**
             * Reset checkins pagination params
             */
            reset() {
                this.checkins = [];
                this.checkinsPage = 1;
                this.checkinsMaxPages = 1;
                this.checkinsBusy = false;
            },

            /**
             * Delete a checkin.
             */
            deleteCheckin(checkin) {
                checkin.busy = true;
                axios.post('/delete-checkin', {checkin_id: checkin.id})
                    .then(() => {
                        checkin.busy = false;
                        this.reset();
                        this.getBusinessCheckins();
                    });
            },

            /**
             * Get the date time formatted for display.
             *
             * @param date
             * @returns {string}
             */
            getTimeFormatted(date) {
                return moment(date).fromNow();
            },

            /**
             * Parse mentions from text and link.
             *
             * @param text
             * @returns {*}
             */
            parseText(text) {

                let mentions = parse(text);

                if (mentions.matches.length == 0) return text;

                let parsedText = text;

                mentions.matches.forEach(function (mention) {
                    parsedText = _.replace(parsedText, mention.match[0], "<a htef='#'>" + mention.match[0] + "</a>")
                });

                return parsedText;
            },
            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>