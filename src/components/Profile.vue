<template>
    <div>
        <skeleton-nav></skeleton-nav>

        <div class="container profile" v-if="user != null">

            <div class="section profile-heading">
                <div class="columns">
                    <div class="column is-2">
                        <div class="image is-128x128 avatar">
                            <img :src="user.profile_photo">
                        </div>
                    </div>
                    <div class="column is-8 name">
                        <p>
                            <span class="title is-bold">{{user.name}}</span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': true}"
                                  v-if="Auth.isSignedIn() && Auth.user().id !== user.id && friendState == -1">
                                Add Friend
                            </span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && Auth.user().id !== user.id && friendState == 0"
                                  @click="addFriend()">
                                Add Friend
                            </span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && Auth.user().id !== user.id && friendState == 1"
                                  @click="removeFriend()">
                                Remove Friend
                            </span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && Auth.user().id !== user.id && friendState == 2"
                                  @click="cancelRequest()">
                                Cancel Request
                            </span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && Auth.user().id !== user.id && friendState == 3"
                                  @click="acceptFriend()">
                                Accept
                            </span>
                            <span class="button is-primary is-outlined" :class="{'is-loading': saving}"
                                  v-if="Auth.isSignedIn() && Auth.user().id !== user.id && friendState == 3"
                                  @click="rejectFriend()">
                                Reject
                            </span>
                        </p>
                        <p class="tagline">{{truncate(user.description)}}</p>
                    </div>
                </div>
            </div>
            <div class="profile-options">
                <div class="tabs is-fullwidth">
                    <ul>
                        <li class="link" :class="{'is-active': tabs.reviews}" @click="toggleTabs('reviews')"><a><span
                                class="icon"><i class="fa fa-comment"></i></span><span>Reviews</span></a></li>
                        <li class="link" :class="{'is-active': tabs.checkins}" @click="toggleTabs('checkins')"><a><span
                                class="icon"><i class="fa fa-map-marker"></i></span> <span>Checkins</span></a></li>
                        <li class="link" :class="{'is-active': tabs.media}" @click="toggleTabs('media')"><a><span
                                class="icon"><i class="fa fa-image"></i></span> <span>Media</span></a></li>
                        <li v-if="Auth.user().id == user.id" class="link" :class="{'is-active': tabs.favorites}" @click="toggleTabs('favorites')">
                            <a><span class="icon"><i class="fa fa-heart-o"></i></span> <span>Favorites</span></a></li>
                        <li v-if="Auth.user().id == user.id" class="link" :class="{'is-active': tabs.friends}" @click="toggleTabs('friends')"><a><span
                                class="icon"><i class="fa fa-users"></i></span> <span>Friends</span></a></li>
                        <li v-if="Auth.user().id == user.id" class="link" :class="{'is-active': tabs.notifications}"
                            @click="toggleTabs('notifications')"><a><span class="icon"><i class="fa fa-bell"></i></span>
                            <span>Notifications</span></a></li>
                        <li v-if="Auth.user().id == user.id" class="link" :class="{'is-active': tabs.settings}" @click="toggleTabs('settings')"><a><span
                                class="icon"><i class="fa fa-cog"></i></span> <span>Settings</span></a></li>
                    </ul>
                </div>
            </div>

            <div class="spacer"></div>

            <div class="section" v-if="tabs.reviews">
                <user-reviews :user="user"></user-reviews>
            </div>

            <div class="section" v-if="tabs.checkins">
                <user-checkins :user="user"></user-checkins>
            </div>

            <div class="section" v-if="tabs.media">
                <user-medias :user="user"></user-medias>
            </div>

            <div class="section" v-if="tabs.favorites">
                <user-saves :user="user"></user-saves>
            </div>

            <div class="section" v-if="tabs.friends">
                <user-friends :user="user"></user-friends>
            </div>

            <div class="section" v-if="tabs.notifications">
                <user-notifications :user="user"></user-notifications>
            </div>

            <div class="section" v-if="tabs.settings">
                <user-settings :user="user"></user-settings>
            </div>

        </div>
    </div>
</template>

<script>
    import Auth from '../services/auth';
    import SkeletonNav from './partials/skeletonNav.vue';
    import UserReviews from './reviews/userReviews.vue';
    import UserCheckins from './checkins/userCheckins.vue';
    import UserMedias from './medias/userMedias.vue';
    import UserSaves from './saves/userSaves.vue';
    import UserFriends from './friends/userFriends.vue';
    import UserNotifications from './notifications/userNotifications.vue';
    import UserSettings from './settings/userSettings.vue';

    export default {
        name: 'userprofile',

        components: {
            skeletonNav: SkeletonNav,
            userReviews: UserReviews,
            userCheckins: UserCheckins,
            userMedias: UserMedias,
            userSaves: UserSaves,
            userFriends: UserFriends,
            userNotifications: UserNotifications,
            userSettings: UserSettings,
        },

        data() {
            return {
                user: null,
                busy: false,
                Auth: Auth,
                friendState: -1,
                done: 0,
                request_id: 0,
                saving: false,
                tabs: {
                    reviews: true,
                    checkins: false,
                    media: false,
                    favorites: false,
                    friends: false,
                    notifications: false,
                    settings: false,
                }
            }
        },

        watch: {
            $route() {
                this.user = null;
                this.toggleTabs('reviews');
                this.getUser();
                this.$forceUpdate();
            }
        },

        mounted() {
            this.getUser();

            let vm = this;
            Event.$on('user-updated', () => {
                vm.getUser();
            });
        },

        methods: {
            getUser() {
                this.busy = true;
                let id = this.$route.params.id;

                axios
                    .get('get-profile', {params: {user_id_to_get: id}})
                    .then(response => {
                        if (Auth.isSignedIn()) this.getFriendStates();
                        this.user = response.data.user_data;
                        this.busy = false;
                    })
            },

            getFriendStates() {
                axios
                    .post('get-friends', { params: { user_id: Auth.user().id, auth_key: Auth.getKey() } })
                    .then(response => {
                        for (var i = 0; i < response.data.friends.length; ++i) {
                            var friend = response.data.friends[i];
                            if (this.user.id === friend.id) {
                                this.friendState = 1;
                                this.done--;
                                break;
                            }
                        }
                        this.done++;
                        if (this.done == 3) {
                            this.friendState = 0;
                        }
                    });
                axios
                    .post('get-friend-requests-sent', { params: { user_id: Auth.user().id, auth_key: Auth.getKey() } })
                    .then(response => {
                        for (var i = 0; i < response.data.requests.length; ++i) {
                            var request = response.data.requests[i];
                            if (this.user.id === request.friend_data.id) {
                                this.friendState = 2;
                                this.request_id = request.id;
                                this.done--;
                                break;
                            }
                        }
                        this.done++;
                        if (this.done == 3) {
                            this.friendState = 0;
                        }
                    });
                axios
                    .post('get-friend-requests-received', { params: { user_id: Auth.user().id, auth_key: Auth.getKey() } })
                    .then(response => {
                        for (var i = 0; i < response.data.requests.length; ++i) {
                            var request = response.data.requests[i];
                            if (this.user.id === request.user_data.id) {
                                this.friendState = 3;
                                this.request_id = request.id;
                                this.done--;
                                break;
                            }
                        }
                        this.done++;
                        if (this.done == 3) {
                            this.friendState = 0;
                        }
                    });
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
                this.tabs.favorites = false;
                this.tabs.friends = false;
                this.tabs.notifications = false;
                this.tabs.settings = false;

                this.tabs[tab] = true;
            },

            addFriend() {
                this.saving = true;
                axios
                    .post('add-friend', {friend_id: this.user.id})
                    .then(response => {
                        this.saving = false;
                        this.friendState = 2;
                        this.request_id = response.data.request.id;
                    });
            },
            cancelRequest() {
                this.saving = true;
                axios
                    .post('cancel-friend-request', {request_id: this.request_id})
                    .then(() => {
                        this.saving = false;
                        this.friendState = 0;
                    });
            },
            acceptFriend() {
                this.saving = true;
                axios
                    .post('accept-friend-request', {request_id: this.request_id})
                    .then(() => {
                        this.saving = false;
                        this.friendState = 1;
                    });
            },
            rejectFriend() {
                this.saving = true;
                axios
                    .post('reject-friend-request', {request_id: this.request_id})
                    .then(() => {
                        this.saving = false;
                        this.friendState = 1;
                    });
            },
            removeFriend() {
                this.saving = true;
                axios
                    .post('remove-friend', {friend_id: this.user.id})
                    .then(() => {
                        this.saving = false;
                        this.friendState = 0;
                    });
            },
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/profile";
</style>