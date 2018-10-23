<template>
    <div class="box">

        <div class="box-header">
            Friend Requests Sent
        </div>

        <div class="box-body">
            <article class="media" v-for="request in requests">
                <figure class="media-left">
                    <p class="image is-64x64">
                        <router-link :to="{ name: 'Profile', params: { name: getSlug(request.friend_data.name), id:request.friend_data.id }}"><img :src="request.friend_data.profile_photo"></router-link>
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong><router-link :to="{ name: 'Profile', params: { name: getSlug(request.friend_data.name), id:request.friend_data.id }}">{{request.friend_data.name}}</router-link></strong>
                            <br>
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                            <a class="level-item" @click="cancelFriendRequest(request)">
                                <span class="icon is-small"><i class="fa fa-trash"></i></span>
                            </a>
                        </div>
                    </nav>
                </div>
                <div class="media-right">
                    <button class="delete"></button>
                </div>
            </article>
        </div>

    </div>
</template>

<script>

    import Auth from '../../services/auth';
    import Helpers from '../../utilities/helpers';

    export default {
        name: 'friendrequests',

        props: {
            user: null,
        },

        data() {
            return {
                Auth: Auth,
                requests: [],
            }
        },

        mounted() {
            this.getFriendRequests();
        },

        methods: {
            getFriendRequests() {
                axios
                    .post('get-friend-requests-sent', { user_id: Auth.user().id, auth_key: Auth.getKey() })
                    .then(response => {
                        this.requests = response.data.requests;
                    })
            },

            cancelFriendRequest(request) {
                axios
                    .post('cancel-friend-request', {request_id: request.id})
                    .then(() => {
                        this.getFriendRequests();
                    })
            },
            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>