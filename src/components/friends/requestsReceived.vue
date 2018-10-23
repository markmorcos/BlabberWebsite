<template>
    <div class="box">

        <div class="box-header">
            Friend Requests Received
        </div>

        <div class="box-body">
            <article class="media" v-for="request in requests">
                <figure class="media-left">
                    <p class="image is-64x64">
                        <router-link :to="{ name: 'Profile', params: { name: getSlug(request.user_data.name), id:request.user_data.id }}"><img :src="request.user_data.profile_photo"></router-link>
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong><router-link :to="{ name: 'Profile', params: { name: getSlug(request.user_data.name), id:request.user_data.id }}">{{request.user_data.name}}</router-link></strong>
                            <br>
                        </p>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                            <a class="level-item" @click="approve(request)">
                                <span class="icon is-small"><i class="fa fa-check"></i></span>
                            </a>
                            <a class="level-item" @click="decline(request)">
                                <span class="icon is-small"><i class="fa fa-times"></i></span>
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
                    .post('get-friend-requests-received', { user_id: Auth.user().id, auth_key: Auth.getKey() })
                    .then(response => {
                        console.log(response);
                        this.requests = response.data.requests;
                    })
            },

            approve(request) {
                axios
                    .post('accept-friend-request', {request_id: request.id})
                    .then(() => {
                        this.getFriendRequests();
                        Event.$emit('friend-accepted');
                    })
            },

            decline(request) {
                axios
                    .post('reject-friend-request', {request_id: request.id})
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