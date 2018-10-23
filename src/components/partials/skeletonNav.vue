<template>
    <nav class="nav has-shadow" id="top">
        <div class="container">
            <div class="nav-left nav-menu">
                <router-link :to="'/'">
                    <img src="../../assets/logo.png" alt="Blabber Logo" class="navbar-logo" style="margin-left: 10px">
                </router-link>

                <router-link :to="'/'" class="nav-item">Home</router-link>
                <router-link :to="'/explore'" class="nav-item">Explore</router-link>
                <router-link :to="'/about-us'" class="nav-item">About</router-link>
                <!--a class="navbar-item "
                   v-for="country in countries"
                   @click="setCountry(country)">
                    {{ country.name }}
                </a-->
            </div>
            <span class="nav-toggle" onclick="$('#toggle').toggle()">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
            <!-- Navbar component ./partials/navbar.vue -->
            <navbar id="toggle"></navbar>
        </div>
    </nav>
</template>

<script>
    import Country from '../../services/country';
    import Navbar from '../partials/navbar.vue';
    import Auth from '../../services/auth';

    export default {
        name: 'skeletonnav',

        data() {
            return {
                countries: [],
            }
        },

        mounted() {
            this.getCountries();
        },

        components: {
            navbar: Navbar,
        },

        methods: {
            getCountries() {
                Country
                    .getCountries()
                    .then(countries => this.countries = countries);
            },

            setCountry(country) {
                Country
                    .setCountry(country);
            },

            logout() {
                Auth.logout();
            },

            isSignedIn() {
                return Auth.isSignedIn();
            }
        }
    }
</script>

<style lang="scss" scoped="">

    .navbar-logo {
        height: 30px;
        width: auto;
        margin-top: 10px;
        margin-bottom: 10px;
    }

</style>