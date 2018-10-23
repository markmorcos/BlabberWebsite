<template>
    <div>
    
        <section class="hero is-fullheight is-dark">
    
            <div class="hero-head">
    
                <div class="container">
    
                    <nav class="nav height-100">
    
                        <div class="container">
    
                            <div class="nav-left">
    
                                <router-link :to="'/'">
    
                                    <img src="../assets/img/logo-white-top.png" alt="Blabber Logo" class="navbar-logo" style="margin-left: 10px">
    
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
    
                </div>
    
            </div>
    

 
            <div class="hero-body">
    
                <div class="container has-text-centered">
    
                    <div class="columns is-vcentered">
    
                        <div class="column is-6 is-offset-3">
    
                            <h1 class="title is-2">
    
                                <img src="../assets/img/logo-white.png" alt="">
    
                            </h1>
    
                            <h2 class="subtitle is-4">
    
                                A business directory with a social twist
    
                            </h2>
    
                            <br>
    
                            <form @submit.prevent="goToSearch()">
    
                                <div class="field has-addons">
    
                                    <p class="control is-expanded">
    
                                        <input class="input is-large" type="text" placeholder="Find a business" v-model="query">
    
                                    </p>
    
                                    <p class="control">
    
                                        <button class="button is-info is-outlined is-large">
    
                                                Search
    
                                            </button>
    
                                    </p>
    
                                </div>
    
                            </form>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </section>
    
    
    
        <section class="section">
    
            <div class="container">
    
                <h1 class="title">Business</h1>
    
                <h2 class="subtitle">
    
                    Best of blabber
    
                </h2>
    
                <home-businesses></home-businesses>
    
            </div>
    
        </section>
    
    
    
        <section class="hero apps height-300">
    
            <div class="hero-body">
    
                <div class="container">
    
                    <div class="columns">
    
                        <div class="column is-three-quarters">
    
                            <h1 class="title text-white">Get the app</h1>
    
                            <h2 class="subtitle text-white">
    
                                Download our mobile app
    
                            </h2>
    
                        </div>
    
                        <div class="column is-2">
    
                            <center>
    
                                <a href="https://itunes.apple.com/eg/app/blabber-the-best-guide-to-explore-all-businesses/id1194725392?mt=8">
    
                                    <img src="../assets/img/app-st.png" alt="" height="50">
    
                                </a>
    
    
    
                                <a href="https://play.google.com/store/apps/details?id=com.blabber.app">
    
                                    <img src="../assets/img/g-play.png" alt="" height="50">
    
                                </a>
    
                            </center>
    
    
    
                            <div id="status">
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </section>
    
    
    
        <!--<section class="section">-->
    
        <!--<div class="container">-->
    
        <!--<h1 class="title">Latest reviews</h1>-->
    
        <!--<h2 class="subtitle">-->
    
        <!--Latest from out members-->
    
        <!--</h2>-->
    
        <!--<home-reviews></home-reviews>-->
    
        <!--</div>-->
    
        <!--</section>-->
    
    
    
        <!--<section class="section">-->
    
        <!--<div class="container">-->
    
        <!--<h1 class="title">Media</h1>-->
    
        <!--<h2 class="subtitle">-->
    
        <!--The community shared-->
    
        <!--</h2>-->
    
        <!--&lt;!&ndash; todo: Home page media &ndash;&gt;-->
    
        <!--</div>-->
    
        <!--</section>-->
    
    
    
        <footer class="footer">
    
            <div class="container">
    
                <div class="content has-text-centered">
    
                    <div class="hero-foot" style="float: left">
    
                        <div class="container">
    
                            <div class="tabs columns">
    
                                <div class="column is-8">
    
                                    <ul style="margin-left: 0; width: auto">
    
                                        <li>
    
                                            <router-link :to="'/privacy-policy'">Privacy Policy</router-link>
    
                                        </li>
    
                                        <li><a href="https://www.facebook.com/myblabberapp/" target="_blank"><i class="fa fa-facebook"></i></a></li>
    
                                        <li><a href="https://www.instagram.com/myblabber/" target="_blank"><i class="fa fa-instagram"></i></a></li>
    
                                    </ul>
    
                                </div>
    
                                <div class="column is-4" style="margin-top: 25px;"><small style="float: right">Copyright {{ year }} Blabber</small></div>
    
                            </div>
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
    
        </footer>
    
    </div>
</template>

<script>
    import Country from '../services/country';
    
    import Navbar from './partials/navbar.vue';
    
    import HomeReviews from './reviews/homeReviews.vue';
    
    import HomeBusinesses from './business/homeBusinesses.vue';
    
    import Auth from '../services/auth';
    
    
    
    export default {
    
        name: 'hello',
    
    
    
        data() {
    
            return {
    
                year: '',
    
                countries: [],
    
                query: '',
    
                busy: false,
    
            }
    
        },
    
    
    
        mounted() {
    
            this.year = moment().year();
    
            this.getCountries();
    
        },
    
    
    
        components: {
    
            navbar: Navbar,
    
            homeReviews: HomeReviews,
    
            homeBusinesses: HomeBusinesses,
    
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
    
    
    
            goToSearch() {
    
                this.$router.push('/search/' + this.query);
    
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
    @import "../assets/scss/landing";
    
    .navbar-logo {
    
        height: 50px;
    
        width: auto;
    
        margin-top: 10px;
    
        margin-bottom: 10px;
    
    }


</style>
