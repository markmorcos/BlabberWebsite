<template>
    <div class="card" style="max-width: 100%" v-if="review != null">

        <div class="card-content">

            <div class="content">

                <comment-form :object="review" :type="'review'"></comment-form>
                <article class="media" v-for="comment in comments">

                    <figure class="media-left">
                        <p class="image is-48x48">
                            <img :src="comment.user.profile_photo">
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <router-link :to="{ name: 'Profile', params: { name: getSlug(review.user.name), id:review.user.id }}">{{ review.user.name }}</router-link>
                                <br>
                                <span v-html="parseText(comment.text)"></span>
                                <br>
                            </p>
                        </div>
                    </div>
                    <nav class="level is-mobile" v-if="Auth.isSignedIn() && Auth.user().id == review.user.id">
                        <div class="level-left">
                            <a class="level-item" @click="editComment(comment)">
                                <span class="icon is-small">
                                    <i class="fa fa-pencil"></i>
                                </span>
                            </a>
                            <a class="level-item" @click="deleteComment(comment)">
                                <span class="icon is-small">
                                    <i class="fa fa-trash"></i>
                                </span>
                            </a>
                        </div>
                    </nav>
                </article>
            </div>

        </div>
    </div>
</template>

<script>
    import CommentForm from '../forms/commentForm.vue';
    import Helpers from '../../utilities/helpers';
    import Auth from '../../services/auth';

    export default {
        name: 'reviewComments',

        components: {
            commentForm: CommentForm,
        },

        props: {
            review: null,
        },

        data() {
            return {
                comments: [],
                Auth: Auth,
            }
        },


        mounted() {
            if (this.review != null) {
                this.getComments();
            }

            Event.$on('comment-created', () => {
               this.getComments();
            });
        },


        methods: {
            /**
             *  Get comments.
             */
            getComments() {
                axios
                    .get('get-comments', {params: {object_id: this.review.id, object_type: 'review'}})
                    .then(response => {
                        this.comments = response.data.comments;
                    })
            },

            editComment(comment) {
                var text = prompt(comment.user.name, comment.text);
                if (text !== null && text !== '') {
                    axios
                        .post('edit-comment', { user_id: Auth.user().id, auth_key: Auth.getKey(), comment_id: comment.id, text: text })
                        .then(() => {
                            Event.$emit('comment-created');
                        });
                }
            },

            deleteComment(comment) {
                axios
                    .post('delete-comment', { comment_id: comment.id })
                    .then(() => {
                        Event.$emit('comment-created');
                    });
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

            /**
             * Get the date time formatted for display.
             *
             * @param date
             * @returns {string}
             */
            getTimeFormatted(date) {
                return moment(date).fromNow();
            },
            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>