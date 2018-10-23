<template>

    <div>
        <div class="box" v-if="Auth.isSignedIn()">

            <div class="box-header">
                Add media
            </div>

            <div class="box-body">
                <media-form :business="business"></media-form>
            </div>

        </div>

        <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="mediasBusy"
             infinite-scroll-distance="10">
            <div class="columns" v-for="chunk in mediaChunks">
                <div class="column" v-for="media in chunk">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3" v-if="business.category.name != 'Koshk'">
                                <img :src="media.url" alt="Image" @click="toggleMediaModal(media)">
                            </figure>
                        </div>
                        <div>
                            <small v-if="parseInt(media.rating) > 0" style="display: block; padding: 10px">
                                <i class="fa fa-star" v-for="n in parseInt(media.rating)"></i>
                            </small>
                        </div>
                        <div class="card-content" style="padding: 1rem">
                            <div class="media">
                                <div class="media-left">
                                    <figure class="image is-48x48">
                                        <img :src="media.user.profile_photo" alt="Image">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <router-link :to="{ name: 'Profile', params: { name: getSlug(media.user.name), id:media.user.id }}" class="title is-4">{{ media.user.name }}</router-link>
                                </div>
                            </div>

                            <div class="content">
                                <p>{{media.caption}}</p>
                            </div>
                        </div>

                        <nav class="level is-mobile" style="padding: 10px">
                            <div class="level-left">
                                <!--a class="level-item" v-if="media.user.id == Auth.user().id" @click="toggleMediaModal(media)">
                                    <span class="icon is-small">
                                        <i class="fa fa-pencil"></i>
                                    </span>
                                </a-->
                                <a class="level-item" v-if="media.user.id == Auth.user().id" @click="deleteMedia(media)">
                                    <span class="icon is-small">
                                        <i class="fa fa-trash"></i>
                                    </span>
                                </a>
                                <a class="level-item" @click="toggleMediaModal(media)">
                                    <span class="icon is-small"><i class="fa fa-comment"></i></span>
                                </a>
                            </div>
                        </nav>

                        <div class="modal" :class="{'is-active': media.modal}">
                            <div class="modal-background"></div>
                            <div class="modal-content">
                                <div class="box">

                                    <div class="columns">
                                        <div class="column is-half">
                                            <p class="image is-4by3">
                                                <img :src="media.url">
                                            </p>
                                        </div>
                                        <div class="column is-half">
                                            <media-comments :media="media"></media-comments>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <button class="modal-close is-large" @click="toggleMediaModal(media)"></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="notification is-info" v-if="mediasBusy">
                <p>Loading Media<i class="pull-right fa fa-spinner fa-spin"></i></p>
            </div>

            <div style="display: none" class="notification is-warning" v-if="hasNoMoreMedias()">
                <p>No more media to load</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Auth from '../../services/auth';
    import MediaForm from '../forms/mediaForm.vue';
    import MediaComments from '../medias/mediaComments.vue';
    import Helpers from '../../utilities/helpers';

    export default {
        name: 'businessmedias',

        props: {
            business: null,
        },

        data() {
            return {
                medias: [],
                mediaChunks: [],
                mediasPage: 1,
                mediasMaxPages: 1,
                mediasBusy: false,
                Auth: Auth,
            }
        },

        components: {
            mediaForm: MediaForm,
            mediaComments: MediaComments,
        },

        mounted() {
            this.getBusinessMedias();

            this.listenForMediaCreated();
        },

        methods: {

            /**
             * Listen for when a media is created reload the medias.
             */
            listenForMediaCreated() {
                let vm = this;
                Event.$on('media-created', () => {
                    vm.reset()
                    vm.getBusinessMedias();
                });
            },

            /**
             * Get the category medias.
             */
            getBusinessMedias() {
                axios
                    .get('/get-media', {params: {business_id_to_get: this.business.id, page: this.mediasPage}})
                    .then(response => {
                        this.mediasMaxPages = response.data.pagination.total_pages_no;
                        this.medias = this.medias.concat(response.data.media);
                        this.medias = _.forEach(this.medias, (media) => media.modal = false);
                        this.mediaChunks = _.chunk(this.medias, 4);
                        this.mediasBusy = false;
                    });
            },

            /**
             * Load more medias on scroll
             */
            loadMore() {
                if (this.medias.length > 0) {
                    this.mediasBusy = true;

                    if (this.mediasPage == this.mediasMaxPages) {
                        this.mediasBusy = false;
                        return;
                    }

                    this.mediasPage++;
                    this.getBusinessMedias();
                }
            },

            /**
             * Check if there are no more medias to load.
             */
            hasNoMoreMedias() {
                return this.mediasPage >= this.mediasMaxPages && !this.mediasBusy;
            },

            /**
             * Reset medias pagination params
             */
            reset() {
                this.medias = [];
                this.mediasPage = 1;
                this.mediasMaxPages = 1;
                this.mediasBusy = false;
            },

            /**
             * Delete a media.
             */
            deleteMedia(media) {
                media.busy = true;
                axios.post('/delete-media', {media_id: media.id})
                    .then(() => {
                        media.busy = false;
                        this.reset();
                        this.getBusinessMedias();
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

            toggleMediaModal(media) {
                media.modal = !media.modal;
                this.$forceUpdate();
            },
            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>