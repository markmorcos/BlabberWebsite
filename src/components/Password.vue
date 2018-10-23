<template>
    <section class="hero is-fullheight is-dark is-bold">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column is-4 is-offset-4">
                        <h1 class="title">
                            Request a password reset
                        </h1>
                        <div class="box">
                            <!-- Password form component ./forms/passwordForm.vue -->
                            <password-form></password-form>
                        </div>
                        <p class="has-text-centered">
                            <router-link :to="'/login'">Login</router-link> |
                            <router-link :to="'/contact-us'">Need Help?</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
    import PasswordForm from './forms/passwordForm.vue';

    export default {
        name: 'password',

        components: {
            passwordForm: PasswordForm,
        }
    }
</script>