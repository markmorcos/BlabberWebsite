<template>
    <div class="card" v-if="media != null">

        <div class="card-content">

            <div class="content">

                <comment-form :object="media" :type="'media'"></comment-form>
                <article class="media" v-for="comment in comments">

                    <figure class="media-left">
                        <p class="image is-48x48">
                            <img :src="comment.user.profile_photo">
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong>{{comment.user.name}}</strong>
                                <br>
                                <span v-html="parseText(comment.text)"></span>
                                <br>
                            </p>
                        </div>
                    </div>
                    <nav class="level is-mobile" v-if="Auth.isSignedIn() && Auth.user().id == comment.user.id">
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
    import Auth from '../../services/auth';

    export default {
        name: 'mediaComments',

        components: {
            commentForm: CommentForm,
        },

        props: {
            media: null,
        },

        data() {
            return {
                comments: [],
                Auth: Auth
            }
        },


        mounted() {
            if (this.media != null) {
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
                    .get('get-comments', {params: {object_id: this.media.id, object_type: 'media'}})
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
        }
    }
</script>