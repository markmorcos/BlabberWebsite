<template>
    <section class="hero is-fullheight is-dark is-bold">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-4 is-offset-4">
                        <h1 class="title">
                            Sign up for a blabber account
                        </h1>
                        <div class="box">
                            <!-- Sign up form component ./forms/signupForm.vue -->
                            <signup-form></signup-form>
                        </div>
                        <p class="has-text-centered">
                            <router-link :to="'/sign-in'">Login</router-link> |
                            <router-link :to="'/contact-us'">Need help?</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
    import SignupForm from './forms/signupForm.vue';

    export default {
        name: 'signup',

        components: {
            signupForm: SignupForm,
        },

        mounted () {
            Event.$on('user-signed-up', () => {
                this.$router.push('/');
            });
        }
    }
</script>