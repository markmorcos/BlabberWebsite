<template>
        <div class="box">
        <div class="box-body">
            <div class="box-header" v-if="notifications.comment.length">
                <strong>Comments</strong>
            </div>
            <div v-for="notification in notifications.comment">
                <p>
                 {{ notification.body }}
                </p>
            </div>
            <hr v-if="notifications.comment.length">
            <div class="box-header" v-if="notifications.friend_request_accepted.length">
                <strong>Accepted Friend Requests</strong>
            </div>
            <div v-for="notification in notifications.friend_request_accepted">
                <p>
                    <router-link :to="{ name: 'Profile', params: { name: getSlug(notification.data.payload.user_data.name), id:notification.data.payload.user_data.id }}">{{notification.body}}</router-link>
                </p>
            </div>
            <hr v-if="notifications.friend_request_accepted.length">
            <div class="box-header" v-if="notifications.new_friend_request.length">
                <strong>Friend Requests</strong>
            </div>
            <div v-for="notification in notifications.new_friend_request">
                <p>
                    <router-link :to="{ name: 'Profile', params: { name: getSlug(notification.user_data.name), id:notification.user_data.id }}">{{notification.user_data.name}}</router-link>
                </p>
            </div>
            <hr v-if="notifications.new_friend_request.length">
            <div class="box-header" v-if="notifications.review_tag.length">
                <strong>Reviews and Mentions</strong>
            </div>
            <div v-for="notification in notifications.review_tag">
                <p>
                    <router-link :to="{ name: 'Business', params: { name: getSlug(notification.body.split('has tagged you in review for')[1]), id:notification.data.payload.business_id }}">{{notification.body}}</router-link>
                </p>
            </div>
            <hr v-if="notifications.review_tag.length">
        </div>

    </div>
</template>

<script>

    import Auth from '../../services/auth';
    import Helpers from '../../utilities/helpers';

    export default {
        name: 'usernotifications',

        data() {
            return {
                Auth: Auth,
                notifications: [],
            }
        },

        mounted() {
            this.getNotifications();
        },

        methods: {
            getNotifications() {
                axios
                    .post('get-all-notifications', { user_id: Auth.user().id, auth_key: Auth.getKey() })
                    .then(response => {
                        this.notifications = response.data.notifications;
                    })
            },

            markSeen(notification) {
                axios
                    .post('mark-notification-seen', {notification_id: notification.id})
                    .then(() => {
                        this.getNotifications();
                    })
            },

            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>