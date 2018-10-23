<template>
    <div>
        <skeleton-nav></skeleton-nav>

        <div class="container profile" v-if="business != null">

            <div class="section profile-heading">
                <div class="columns" style="margin-bottom: 0">
                    <div class="column is-2">
                        <div class="image is-128x128 avatar">
                            <img style="height: 150px; border-radius: 0" :src="business.main_image">
                        </div>
                    </div>
                    <div class="column is-4 name">
                        <p>
                            <div class="title is-bold" style="font-size: 1.6rem; margin-bottom: 0.5rem">{{business.name}}</div>

                            <div v-if="parseInt(business.rating) > 0" style="margin-bottom: 0.25rem">
                                <i class="fa fa-star" v-for="n in parseInt(business.rating)"></i>
                            </div>

                            <span class="button is-primary is-outlined" :class="{'is-loading': true}"
                                  v-if="Auth.isSignedIn() && !shown">
                                Save
                            </span> 
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && !business.is_favorite && shown"
                                  @click="saveBusiness()">
                                Save
                            </span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && business.is_favorite && shown"
                                  @click="unSaveBusiness()">
                                Unsave
                            </span>
                        </p>
                    </div>
                    <div class="column is-2 followers has-text-centered">
                        <p class="stat-val">{{business.no_of_views}}</p>
                        <p class="stat-key">views</p>
                    </div>
                    <div class="column is-2 following has-text-centered">
                        <p class="stat-val">{{business.no_of_checkins}}</p>
                        <p class="stat-key">checkins</p>
                    </div>
                    <div class="column is-2 likes has-text-centered">
                        <p class="stat-val">{{business.no_of_reviews}}</p>
                        <p class="stat-key">reviews</p>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-2">
                        <div v-for="flag in business.flags"><img style="height:20px" :src="flag.icon" height="20" /> {{ flag.name }}</div><hr>
                        <p><strong>Phone:</strong> {{ business.phone }}</p>
                        <p><strong>Open:</strong> {{ business.is_open ? 'Yes' : 'No' }}</p>
                        <p><strong>Price:</strong> <small v-if="parseInt(business.price) > 0"><i class="fa fa-star" v-for="n in parseInt(business.price)"></i></small></p>
                        <div><a :href="business.website" target="_blank">Website</a></div>
                        <div><a :href="business.fb_page" target="_blank">Facebook page</a></div>
                    </div>
                    <div class="column is-10">
                        <p v-if="business.description">{{ business.description }}</p><hr>
                        <p><strong>Address:</strong> {{ business.address }}, {{ business.city }}, {{ business.country }}</p>
                        <p><strong>Working hours:</strong> {{ business.operation_hours }}</p>
                        <p><strong>interests:</strong> {{ business.interests }}</p>
                    </div>
                </div>
            </div>
            <div class="profile-options">
                <div class="tabs is-fullwidth">
                    <ul>
                        <li class="link" :class="{'is-active': tabs.reviews}" @click="toggleTabs('reviews')"><a><span class="icon"><i class="fa fa-comment"></i></span><span>Reviews</span></a></li>
                        <li class="link" :class="{'is-active': tabs.checkins}" @click="toggleTabs('checkins')"><a><span class="icon"><i class="fa fa-map-marker"></i></span> <span>Checkins</span></a></li>
                        <li class="link" :class="{'is-active': tabs.media}" @click="toggleTabs('media')"><a><span class="icon"><i class="fa fa-image"></i></span> <span>Media</span></a></li>
                        <li v-if="business.category.name == 'Koshk' " class="link" :class="{'is-active': tabs.cigarettes}"  @click="toggleTabs('cigarettes')" ><a><span class="icon"><i class="fa fa-image"></i></span> <span>Cigarettes</span></a></li>
                        
                    </ul>
                </div>
            </div>

            <div class="spacer"></div>

            <div class="section" v-if="tabs.reviews">
                <business-reviews :business="business"></business-reviews>
            </div>

            <div class="section" v-if="tabs.checkins">
                <business-checkins :business="business"></business-checkins>
            </div>

            <div class="section" v-if="tabs.media">
                <business-medias :business="business"></business-medias>
            </div>
              <div class="section" v-if="tabs.cigarettes">
                <business-cigarettes :business="business"></business-cigarettes>
            </div>

        </div>
    </div>
</template>

<script>
    import Auth from '../services/auth';
    import SkeletonNav from './partials/skeletonNav.vue';
    import BusinessReviews from './reviews/businessReviews.vue';
    import BusinessCheckins from './checkins/businessCheckins.vue';
    import BusinessMedias from './medias/businessMedias.vue';
    import BusinessCigarettes from './cigarettes/businessCigarettes.vue';

    export default {
        name: 'businessprofile',

        components: {
            skeletonNav: SkeletonNav,
            businessReviews: BusinessReviews,
            businessCheckins: BusinessCheckins,
            businessMedias: BusinessMedias,
            BusinessCigarettes: BusinessCigarettes,
        },

        data() {
            return {
                business: null,
                busy: false,
                Auth: Auth,
                saving: false,
                done: 0,
                shown: false,
                tabs: {
                    reviews: true,
                    checkins: false,
                    media: false,
                    cigarettes: false,
                }
            }
        },

        mounted() {
            this.getBusiness();
            if (Auth.isSignedIn()) axios
                .post('get-saved-businesses', { user_id: Auth.user().id, auth_key: Auth.getKey(), user_to_get: Auth.user().id, page: this.businessesPage })
                .then(response => {
                    for (var i = 0; i < response.data.businesses.length; ++i) {
                        var business = response.data.businesses[i];
                        if (business.id == this.$route.params.id) {
                            this.business.is_favorite = true;
                            this.done--;
                            this.shown = true;
                            break;
                        }
                    }
                    this.done++;
                    if (this.done == 1) {
                        this.shown = true;
                    }
                });
        },

        methods: {
            getBusiness() {
                this.busy = true;
                let id = this.$route.params.id;

                axios
                    .get('get-business-data', {params: {business_id: id}})
                    .then(response => {
                        this.business = response.data.business_data;
                        this.busy = false;
                    })
            },

            truncate(text) {
                return _.truncate(text, {
                    length: 150,
                    separator: '...',
                });
            },

            toggleTabs(tab) {
                this.tabs.reviews = false;
                this.tabs.checkins = false;
                this.tabs.media = false;
                this.tabs.cigarettes = false;

                this.tabs[tab] = true;
            },

            saveBusiness() {
                this.saving = true;
                axios
                    .post('save-business', {business_id: this.business.id})
                    .then(() => {
                        this.business.is_favorite = true;
                        this.saving = false;
                    });
            },

            unSaveBusiness() {
                this.saving = true;
                axios
                    .post('delete-saved-business', {saved_business_id: this.business.id})
                    .then(() => {
                        this.business.is_favorite = false;
                        this.saving = false;
                    });
            },
            
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/profile";
</style>