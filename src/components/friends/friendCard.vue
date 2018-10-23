<template>
    <div class="card">
        <div class="card-image">
            <figure class="image is-4by4">
                <img :src="friend.profile_photo" alt="Image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4"><router-link :to="{ name: 'Profile', params: { name: getSlug(friend.name), id:friend.id }}">{{ friend.name }}</router-link></p>
                </div>
            </div>

            <div class="content">
                <a @click="deleteFriend()">
                    <small>Unfriend <i class="fa fa-trash"></i></small>
                </a>
            </div>
        </div>
    </div>
</template>

<script>

    import Helpers from '../../utilities/helpers';

    export default {
        name: 'friendcard',

        props: {
            friend: null,
        },

        methods: {
            deleteFriend() {
                axios
                    .post('remove-friend', {friend_id: this.friend.id})
                    .then(() => {Event.$emit('friend-removed')});
            },
            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>