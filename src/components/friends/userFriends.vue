<template>
    <div class="container">
        <div class="columns">
            <div class="column is-8">
                <div class="column is-6" v-for="friend in friends">
                    <friend-card :friend="friend"></friend-card>
                </div>
            </div>
            <div class="column is-4">
                <search-friends></search-friends>
                <requests-received :user="user"></requests-received>
                <friend-requests :user="user"></friend-requests>
            </div>
        </div>
    </div>
</template>

<script>
    import FriendCard from './friendCard.vue';
    import FriendRequests from './friendRequests.vue';
    import RequestsReceived from './requestsReceived.vue';
    import SearchFriends from './searchFriends.vue';
    import Auth from '../../services/auth';

    export default {
        name: 'userfriends',

        components: {
            friendCard: FriendCard,
            friendRequests: FriendRequests,
            requestsReceived: RequestsReceived,
            searchFriends: SearchFriends,
            Auth: Auth
        },

        props: {
            user: null,
        },

        data() {
            return {
                friends: [],
                busy: false,
            }
        },

        mounted() {
            this.getFriends();
            
            Event.$on('friend-accepted', () => {
                this.getFriends();
            });

            Event.$on('friend-removed', () => {
                this.getFriends();
            });
        },

        methods: {
            getFriends() {
                this.busy = true;
                axios
                    .post('get-friends', { user_id: Auth.user().id, auth_key: Auth.getKey() })
                    .then(response => {
                        this.friends = response.data.friends;
                        this.busy = false;
                    })
                    .catch(() => {
                        
                    });
            }
        }
    }
</script>