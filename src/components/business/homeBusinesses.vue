<template >
    <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="businessesBusy" infinite-scroll-distance="10">
        <div class="columns " v-for="chunk in businessesChunks">
            <div class="column" v-for="business in chunk">
                <business-card :business="business"></business-card>
            </div>
        </div>
    </div>
</template>

<script>
    import BusinessCard from '../partials/businessCard.vue';

    export default {
        name: 'homebusinesses',

        components: {
            businessCard: BusinessCard,
        },

        props: {
            user: null,
        },

        data() {
            return {
                businesses: [],
                businessesPage: 1,
                businessesChunks: [],
                businessesMaxPages: 1,
                businessesBusy: false,
            }
        },

        mounted() {
            this.reset();

            this.getUserSaves();

            Event.$on('country-changed', () => {
                this.reset();
                this.getUserSaves();
            })
        },

        methods: {

            /**
             * Get the category businesses.
             */
            getUserSaves() {
                axios
                    .get('/get-homescreen-businesses', {params: {page: this.businessesPage}})
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
            }
        }
    }
</script>