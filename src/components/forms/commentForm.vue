<template>
    <div class="columns" v-if="Auth.isSignedIn()">
        <div class="column is-12">
            <article class="media">
                <figure class="media-left">
                    <p class="image is-64x64">
                        <img :src="Auth.user().profile_photo">
                    </p>
                </figure>
                <div class="media-content">
                    <form @submit.prevent="comment()">

                        <div class="field">
                            <p class="control">
                                <textarea :class="{'textarea mentionable': true, 'is-danger': errors.has('text')}"
                                          id="text"
                                          name="text"
                                          type="text"
                                          placeholder="Leave a comment..."
                                          v-validate="'required|min: 3'"
                                          @keyup.@="searchMentions()"
                                          v-model="form.text"></textarea>
                            </p>
                            <p :class="{'help': true, 'is-danger': errors.has('text')}">{{errors.first('text')}}</p>
                        </div>

                        <p class="control">
                            <button class="button is-info" :class="{'is-loading': busy}" :disabled="!validated">Comment</button>
                        </p>
                    </form>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
    import Auth from '../../services/auth';

    export default {
        name: 'commentform',

        props: {
            object: null,
            type: null,
        },

        data() {
            return {
                Auth: Auth,
                form: {
                    text: '',
                },
                validated: false,
                busy: false,
            }
        },

        watch: {
            form: {
                handler: function () {
                    this.$validator.validateAll()
                        .then(() => {
                            this.validated = true;
                        })
                        .catch(() => {
                            this.validated = false;
                        });
                },
                deep: true,
            }
        },

        methods: {
            comment() {
                this.busy = true;
                this.form.object_id = this.object.id;
                this.form.object_type = this.type;
                axios
                    .post('/comment', this.form)
                    .then(() => {
                        this.busy = false;
                        this.form = {
                            text: '',
                        }
                        this.$validator.clean();
                        Event.$emit('comment-created');
                    });
            },

        }

    }
</script>