<template>
    <div>
        <skeleton-nav style="position: fixed; width: 100%"></skeleton-nav>

        <section class="hero is-medium is-info is-bold" style="background: #505050; padding-bottom: 1rem">

            <div class="hero-body" style="padding-top: 6rem; padding-bottom: 3rem">
                <div class="container">
                    <h1 class="title">
                        Explore our businesses
                    </h1>
                    <h2 class="subtitle">
                        Find by category, all business are filtered by country
                    </h2>
                </div>
            </div>

            <div class="hero-foot">
                <nav class="tabs">
                    <div class="container">
                        <carousel :perPage="4" paginationActiveColor="#0000FF" :paginationPadding="4" :navigationEnabled="true">
                            <slide v-for="category in categories">
                                <center :style="{
                                    background: 'url(' + category.main_image + ')',
                                    width: '270px',
                                    height: '270px',
                                    backgroundSize: '100% 100%',
                                    backgroundPosition: '0px',
                                    margin: 'auto',
                                    cursor: 'pointer'
                                }" @click="selectCategory(category)"></center>
                                <a @click="selectCategory(category)">{{ category.name }}</a>
                            </slide>
                        </carousel>
                    </div>
                </nav>
            </div>

        </section>

        <section class="section" v-if="selectedCategory != null">
            <div class="container">
                <h1 class="title">{{selectedCategory.name}}</h1>
                <h2 class="subtitle">
                    These are the businesses available in {{ selectedCategory.name }}
                </h2>
            </div>
        </section>

        <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="businessesBusy" infinite-scroll-distance="20">
            <div class="columns" v-for="chunk in businessesChunks">
                <div class="column" v-for="business in chunk">
                    <business-card :business="business"></business-card>
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


</template>

<script>
    import SkeletonNav from './partials/skeletonNav.vue';
    import BusinessCard from './partials/businessCard.vue';
    import { Carousel, Slide } from 'vue-carousel';

    export default {
        name: 'explore',

        components: {
            skeletonNav: SkeletonNav,
            businessCard: BusinessCard,
            Carousel,
            Slide
        },

        data() {
            return {
                selectedCategory: null,
                categories: [],
                businesses: [],
                businessesPage: 1,
                businessesChunks: [],
                businessesMaxPages: 1,
                businessesBusy: false,
            }
        },

        mounted() {
            this.reset();
            this.getCategories();
            if(this.$route.params.id)
                this.getCategoryBusinesses(this.$route.params.id);


            Event.$on('country-changed', () => {
                this.reset();
                this.getCategories();
            })
        },

        methods: {
            /**
             * Get a list of all categories.
             */
            getCategories() {
                axios
                    .get('/get-categories')
                    .then(response => {
                        this.categories = response.data.categories;
                        var found = 0;
                        for (var i = 0; i < this.categories.length; ++i) {
                            if (this.$route.params.id == this.categories[i].id) {
                                this.selectCategory(this.categories[i]);
                                found = 1;
                                break;
                            }
                        }
                        if (found == 0 && !this.$route.params.id) {
                            this.selectCategory(this.categories[0]);
                        }
                    });
            },

            /**
             * Select a category.
             */
            selectCategory(category) {
                if (this.$route.params.id != category.id) this.$router.push('/explore/' + category.id);
                this.selectedCategory = category;
                this.reset();
                this.getCategoryBusinesses(category.id);
            },

            /**
             * Get the category businesses.
             */
            getCategoryBusinesses(id) {
                axios
                    .get('/get-businesses', {params: {category_id: id, page: this.businessesPage}})
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
                    this.getCategoryBusinesses();
                }
            },

            /**
             * Check if there are no more businesses to load.
             */
            hasNoMoreBusinesses () {
                return this.businessesPage >= this.businessesMaxPages && ! this.businessesBusy;
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
            }
        }
    }
</script>

<style>
.VueCarousel-navigation-button {
    background: none;
    border: none !important;
}
</style>