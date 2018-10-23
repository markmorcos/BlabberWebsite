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
                    <form @submit.prevent="checkin()">

                        <div class="field">
                            <p class="control">
                                <input :class="{'input': true, 'is-danger': errors.has('rating')}"
                                               id="rating"
                                               name="rating"
                                               type="hidden"
                                               placeholder="Rate the business..."
                                               v-validate="'required|between:1,5'"
                                               v-model="form.rating">
                                <star-rating
                                    :rating="Number(form.rating)"
                                    :star-size="20"
                                    :show-rating="false"
                                    @rating-selected="setRating" />
                            </p>
                            <p :class="{'help': true, 'is-danger': errors.has('rating')}">{{errors.first('rating')}}</p>
                        </div>

                        <p class="control">
                            <button class="button is-info" :class="{'is-loading': busy}" >Checkin</button>
                        </p>
                    </form>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
    import Auth from '../../services/auth';
    import StarRating from 'vue-star-rating';

    export default {
        name: 'checkinform',
        components: {
            StarRating
        },
        props: {
            business: null,
        },

        data() {
            return {
                Auth: Auth,
                form: {
                    rating: '',
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
            setRating: function(rating) {
                this.form.rating = "" + rating;
            },
            checkin() {
                this.busy = true;
                this.form.business_id = this.business.id;
                axios
                    .post('/checkin', this.form)
                    .then(() => {
                        this.busy = false;
                        this.form = {
                            rating: '',
                        }
                        this.$validator.clean();
                        Event.$emit('checkin-created');
                    });
            },

            searchMentions() {
                console.log(this.form.text);
            }
        }

    }
</script>