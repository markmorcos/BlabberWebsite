<template>

    <div v-if="user != null">
        <div class="columns">
            <div class="column is-two-thirds" v-infinite-scroll="loadMore" infinite-scroll-disabled="reviewsBusy"
                 infinite-scroll-distance="10">
                <article class="media" v-for="review in reviews">
                    <figure class="media-left">
                        <p class="image is-64x64">
                            <img :src="review.user.profile_photo">
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <p style="margin-bottom: 0">
                                <strong><router-link :to="{ name: 'Profile', params: { name: getSlug(review.user.name), id:review.user.id }}">{{ review.user.name }}</router-link></strong>
                                <small>{{review.user.username}}</small>
                                <small>{{getTimeFormatted(review.created)}}</small>
                                <small v-if="parseInt(review.rating) > 0">
                                    <br>
                                    <i class="fa fa-star" v-for="n in parseInt(review.rating)"></i>
                                </small>
                                <br>
                                <strong><router-link :to="{ name: 'Business', params: { name: getSlug(review.business.name), id:review.business.id }}">{{ review.business.name }}</router-link></strong>
                                <br>
                                <span v-html="parseText(review.text)">
                                </span>
                            </p>
                        </div>
                        <nav class="level is-mobile">
                            <div class="level-left">
                                <a class="level-item" v-if="review.user.id == Auth.user().id" @click="editReview(review)">
                                    <span class="icon is-small">
                                        <i class="fa fa-pencil"></i>
                                    </span>
                                </a>
                                <a class="level-item" v-if="review.user.id == Auth.user().id" @click="deleteReview(review)">
                                    <span class="icon is-small">
                                        <i class="fa fa-trash"></i>
                                    </span>
                                </a>
                                <a class="level-item" @click="displayReviewComments(review)">
                                    <span class="icon is-small"><i class="fa fa-comment"></i></span>
                                </a>
                            </div>
                        </nav>
                        <div class="modal" :class="{'is-active': editModalActive}" v-if="editModalActive && selectedReview != null && selectedReview.id === review.id">
                            <div class="modal-background"></div>
                            <div class="modal-content">
                                <form @submit.prevent="updateReview()">
                                    <div class="field">
                                        <p class="control">
                                            <textarea :class="{'textarea mentionable': true, 'is-danger': errors.has('text')}"
                                                      id="text"
                                                      name="text"
                                                      type="text"
                                                      placeholder="Add a review..."
                                                      v-validate="'required|min: 3'"
                                                      @keyup.@="searchMentions()"
                                                      v-model="selectedReview.text"></textarea>
                                        </p>
                                        <p :class="{'help': true, 'is-danger': errors.has('text')}">{{errors.first('text')}}</p>
                                    </div>

                                    <div class="field">
                                        <p class="control">
                                            <input :class="{'input': true, 'is-danger': errors.has('rating')}"
                                                           id="rating"
                                                           name="rating"
                                                           type="hidden"
                                                           placeholder="Rate the business..."
                                                           v-validate="'required|between:1,5'"
                                                           v-model="selectedReview.rating">
                                            <star-rating
                                                :rating="Number(selectedReview.rating)"
                                                :star-size="20"
                                                :show-rating="false"
                                                @rating-selected="setRating" />
                                        </p>
                                        <p :class="{'help': true, 'is-danger': errors.has('rating')}">{{errors.first('rating')}}</p>
                                    </div>

                                    <p class="control">
                                        <button class="button is-info" :class="{'is-loading': busy}" :disabled="!validated">Submit</button>
                                    </p>
                                </form>
                            </div>
                            <button class="modal-close is-large" @click="toggleEditModal()"></button>
                        </div>
                    </div>
                </article>
            </div>

        </div>
        <div class="container">
            <div class="notification is-info" v-if="reviewsBusy">
                <p>Loading Reviews <i class="pull-right fa fa-spinner fa-spin"></i></p>
            </div>

            <div style="display: none" class="notification is-warning" v-if="hasNoMoreReviews()">
                <p>No more reviews to load</p>
            </div>
        </div>

        <div class="modal" :class="{'is-active': commentsModalActive}" v-if="selectedReview != null">
            <div class="modal-background"></div>
            <div class="modal-content">
                <review-comments :review="selectedReview"></review-comments>
            </div>
            <button class="modal-close is-large" @click="toggleCommentsModal()"></button>
        </div>
    </div>

</template>

<script>

    import ReviewComments from '../reviews/reviewComments.vue';
    import Auth from '../../services/auth';
    import Helpers from '../../utilities/helpers';
    import StarRating from 'vue-star-rating';

    export default {
        name: 'userreviews',

        components: {
            reviewComments: ReviewComments,
            StarRating
        },

        props: {
            user: null,
        },

        data() {
            return {
                reviews: [],
                reviewsPage: 1,
                reviewsMaxPages: 1,
                reviewsBusy: false,
                Auth: Auth,
                commentsModalActive: false,
                editModalActive: false,
                selectedReview: null,
                validated: false,
                busy: false,
            }
        },

        watch: {
            selectedReview: {
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

        mounted() {
            this.getUserReviews();

            this.listenForReviewCreated();
        },

        methods: {
            setRating: function(rating) {
                this.selectedReview.rating = "" + rating;
            },

            updateReview() {
                this.busy = true;
                axios
                    .post('edit-review', { user_id: Auth.user().id, auth_key: Auth.getKey(), review_id: this.selectedReview.id, text: this.selectedReview.text, rating: this.selectedReview.rating })
                    .then(() => {
                        this.busy = false;
                        this.toggleEditModal();
                        this.$validator.clean();
                        Event.$emit('review-created');
                    });
            },

            /**
             * Display the review comments.
             */
            displayReviewComments(review) {
                this.selectedReview = { ...review };
                this.toggleCommentsModal();
            },

            /**
             * Toggle the comments modal.
             */
            toggleCommentsModal() {
                this.commentsModalActive = ! this.commentsModalActive;

                if(this.commentsModalActive == false) {
                    this.selectedReview = null;
                }
            },

            /**
             * Listen for when a review is created reload the reviews.
             */
            listenForReviewCreated() {
                let vm = this;
                Event.$on('review-created', () => {
                    vm.reset()
                    vm.getUserReviews();
                });
            },

            /**
             * Get the category reviews.
             */
            getUserReviews() {
                axios
                    .get('/get-reviews', {params: {user_id_to_get: this.user.id, page: this.reviewsPage}})
                    .then(response => {
                        this.reviewsMaxPages = response.data.pagination.total_pages_no;
                        this.reviews = this.reviews.concat(response.data.reviews);
                        this.reviewsBusy = false;
                    });
            },

            /**
             * Load more reviews on scroll
             */
            loadMore() {
                if (this.reviews.length > 0) {
                    this.reviewsBusy = true;

                    if (this.reviewsPage == this.reviewsMaxPages) {
                        this.reviewsBusy = false;
                        return;
                    }

                    this.reviewsPage++;
                    this.getUserReviews();
                }
            },

            /**
             * Check if there are no more reviews to load.
             */
            hasNoMoreReviews() {
                return this.reviewsPage >= this.reviewsMaxPages && !this.reviewsBusy;
            },

            /**
             * Reset reviews pagination params
             */
            reset() {
                this.reviews = [];
                this.reviewsPage = 1;
                this.reviewsMaxPages = 1;
                this.reviewsBusy = false;
            },

            editReview(review) {
                this.selectedReview = { ...review };
                this.toggleEditModal();
            },

            toggleEditModal() {
                this.editModalActive = ! this.editModalActive;

                if(this.editModalActive == false) {
                    this.selectedReview = null;
                }
            },

            /**
             * Delete a review.
             */
            deleteReview(review) {
                review.busy = true;
                axios.post('/delete-review', {review_id: review.id})
                    .then(() => {
                        review.busy = false;
                        this.reset();
                        this.getUserReviews();
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
            parseText (text) {
                let mentions = parse(text);
                if(mentions.matches.length == 0) return text;
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