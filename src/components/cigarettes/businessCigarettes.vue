<template>


    <div>
      

        <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="mediasBusy"
             infinite-scroll-distance="10">
            <div class="columns" v-for="chunk in mediaChunks">
                <div class="column" v-for="media in chunk">
                    <div class="card">
                       
                        
                        <div class="card-content" style="padding: 1rem">
                             

                            <div class="content">
                                <p style="text-align:center; font-weight: bold;">{{media.caption}}</p>
                            </div>
                             <div class="content">
                                <p >{{media.price}} L.E.</p>
                            </div>
                            <div class="content">
                                <p>Did you buy it for this price ?</p>
                            </div>
                            <div v-if="media.added_reaction == null"class="content">
                           <button  @click="addReaction(media, 'like')">Yes</button>
                           <button  style="color:red;" @click="addReaction(media, 'dislike')">No</button>
                            </div>
                             <div v-if="media.added_reaction != null" class="content">
                                <p class="success">Thanks For Your Feedback</p>
                            </div>
                            <div class="">
                                <p class="yes" :style="{ width: media.yes + '%', textAlign:'center', color:media.yes > 0 ? 'white' : 'black' }" >{{ media.yes }}%</p>
                            </div>  
                            <div class="" >
                                <p class="no" :style="{ width: media.no + '%', textAlign:'center', color:media.no > 0 ? 'white' : 'black' }" >{{ media.no }}%</p>
                                </div>  
                             <div class="content">
                                <p style="text-align:right;">Votes: {{media.likes + media.dislikes}}</p>
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
<style>
.yes{
    height: 20px;
    background-color:rgb(24, 9, 238);
    -moz-border-radius: 40px / 25px;
    -webkit-border-radius: 40px / 25px;
    border-radius: 40px / 25px;
    margin-bottom: 10px;
    line-height: 20px;
}
.no{
    height: 20px;
    background-color:#666;
    -moz-border-radius: 40px / 25px;
    -webkit-border-radius: 40px / 25px;
    border-radius: 40px / 25px;
    line-height: 20px;    
}

</style>
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
                        this.medias = _.forEach(this.medias, (media) => {
                            media.modal = false;
                            media.votes = media.likes + media.dislikes;
                            media.yes = Math.round(Number(100 * media.likes / media.votes));
                            media.no = Math.round(Number(100 * media.dislikes / media.votes));
                        });
                        this.mediaChunks = _.chunk(this.medias, 4);
                        this.mediasBusy = false;
                    });
            },
            addReaction(media, type){
                media.isvoted = 1;
                console.log({user_id: Auth.user().id, auth_key: Auth.getKey(), type: type ,object_id:media.id ,object_type:'media'});
                axios
                    .post('/add-reaction', { user_id: Auth.user().id, auth_key: Auth.getKey(), type: type ,object_id:media.id ,object_type:'media' })
                    .then(response => {
                        if (!response.data.status) {
                            media.added_reaction = { id: response.data.reaction_id, type: type };
                        }
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