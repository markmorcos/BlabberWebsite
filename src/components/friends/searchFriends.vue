<template>
    <nav class="panel">
        <p class="panel-heading">
            Search users
        </p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input class="input is-small" type="text" placeholder="Search" v-model="query" @keyup="search()">
                <span class="icon is-small is-left">
                    <i class="fa fa-search"></i>
                </span>
            </p>
        </div>
        <a class="panel-block" v-for="user in users">
            <span class="panel-icon">
                    <img :src="user.profile_photo" alt="">
                </span>
            <router-link :to="{ name: 'Profile', params: { name: getSlug(user.name), id: user.id}}">
                {{user.name}}
            </router-link>
        </a>
    </nav>

</template>

<script>
    import Helpers from '../../utilities/helpers';

    export default {
        name: 'searchfriends',

        data() {
            return {
                query: '',
                users: [],
            }
        },

        methods: {
            search() {
                if (this.query.length > 3) {
                    axios
                        .post('search-for-user', {name: this.query})
                        .then(response => this.users = response.data.users);
                }
            },

            getSlug(name) {
                return Helpers.slugify(name);
            }
        }
    }
</script>