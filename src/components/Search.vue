<template>
    <div>
        <skeleton-nav></skeleton-nav>

        <section class="hero is-info">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Find a business
                    </h1>
                    <h2 class="subtitle">
                        <form @submit.prevent="newSearch()">
                            <div class="field has-addons">
                                <p class="control is-expanded">
                                    <input class="input is-large" type="text" placeholder="Find a business" v-model="query">
                                </p>
                                <p class="control">
                                    <button class="button is-default is-outlined is-large">
                                        Search
                                    </button>
                                </p>
                            </div>
                        </form>
                    </h2>
                </div>
            </div>
        </section>

        <div class="container">
            <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="businessesBusy" infinite-scroll-distance="20">
                <div class="columns" v-for="chunk in businessesChunks">
                    <div class="column" v-for="business in chunk">
                        <business-card :business="business"></business-card>
                    </div>
                </div>
            </div>
        </div>

            <div class="notification is-info" v-if="businessesBusy">
                <p>Loading Business <i class="pull-right fa fa-spinner fa-spin"></i></p>
            </div>

            <div style="display: none" class="notification is-warning" v-if="hasNoMoreBusinesses()">
                <p>No more business to load</p>
            </div>
        </div>
    </div>
</template>

<script>
    import SkeletonNav from './partials/skeletonNav.vue';
    import BusinessCard from './partials/businessCard.vue';
    export default {
        name: 'search',

        components: {
            skeletonNav: SkeletonNav,
            businessCard: BusinessCard,
        },

        data() {
            return {
                query: '',
                businesses: [],
                businessesPage: 1,
                businessesChunks: [],
                businessesMaxPages: 1,
                businessesBusy: false,
            }
        },

        mounted() {
            this.query = this.$route.params.query;
            this.search(this.query);

            Event.$on('country-changed', () => {
                this.$forceUpdate();
                this.reset();
                this.search();
            })
        },

        watch: {
            $route() {
                this.$forceUpdate();
                this.reset();
                this.search();
            }
        },

        methods: {

            /**
             * Get the category businesses.
             */
            search() {
                
                axios
                    .get('/search-businesses', {params: {name: this.query, page: this.businessesPage}})
                    .then(response => {
                        this.businessesMaxPages = response.data.pagination.total_pages_no;
                        this.businesses = this.businesses.concat(response.data.businesses);
                        this.businessesChunks = _.chunk(this.businesses, 4);
                        this.businessesBusy = false;
                    });
            },

            /**
             * Load more businesses on scroll
             */
            loadMore() {
                if (this.businesses.length > 0) {
                    this.businessesBusy = true;

                    if (this.businessesPage == this.businessesMaxPages) {
                        this.businessesBusy = false;
                        return;
                    }

                    this.businessesPage++;
                    this.search();
                }
            },

            /**
             * Check if there are no more businesses to load.
             */
            hasNoMoreBusinesses() {
                return this.businessesPage >= this.businessesMaxPages && !this.businessesBusy;
            },

            /**
             * Reset businesses pagination params
             */
            reset() {
                this.businesses = [];
                this.businessesPage = 1;
                this.businessesChunks = [];
                this.businessesMaxPages = 1;
                this.businessesBusy = false;
            },

            newSearch() {
                this.$router.push('/search/' + this.query);
            },
        }
    }
</script>