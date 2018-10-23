<template>
    <div class="login-wrapper columns">

        <div class="column is-8 is-hidden-mobile hero-banner">
            <section class="hero is-fullheight is-dark"></section>
        </div>

        <div class="column is-4">

            <section class="hero is-fullheight">

                <div class="hero-heading">
                    <div class="section has-text-centered">
                        <router-link :to="'/'">
                            <img src="../assets/logo.png" alt="Blabber logo" width="50px">
                        </router-link>
                    </div>
                </div>

                <div class="hero-body">
                    <div class="container">
                        <div class="columns">
                            <div class="column is-8 is-offset-2">

                                <!--h1 class="avatar has-text-centered section">
                                    <img src="https://placehold.it/128x128">
                                </h1-->

                                <!-- Sign in form component ./forms/signinForm.vue -->
                                <signin-form></signin-form>

                                <div class="section forgot-password">
                                    <p class="has-text-centered">

                                        <router-link :to="'/recover-password'">
                                            Forgot password?
                                        </router-link>
                                        <br>
                                        <router-link :to="'/contact-us'">
                                            Need help?
                                        </router-link>

                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import SigninForm from './forms/signinForm.vue';

    export default {
        name: 'signin',

        components: {
            signinForm: SigninForm,
        },

        mounted () {
            Event.$on('user-signed-in', () => {
                this.$router.push('/');
            });
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/signin";
</style>