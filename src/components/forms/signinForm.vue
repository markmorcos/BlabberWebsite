<template>
    <form @submit.prevent="signIn()" class="login-form">
        <div class="field">
            <p class="control">
                <input :class="{'input email-input': true, 'is-danger': errors.has('email')}"
                               id="email"
                               name="email"
                               type="email"
                               placeholder="Email"
                               v-validate="'required|email'"
                               v-model="form.email">
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('email')}">{{errors.first('email')}}</p>
        </div>

        <div class="field">
            <p class="control">
                <input :class="{'input password-input': true, 'is-danger': errors.has('password')}"
                               id="password"
                               name="password"
                               type="password"
                               placeholder="Password"
                               v-validate="'required|min: 6'"
                               v-model="form.password">
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('password')}">{{errors.first('password')}}</p>
        </div>

        <p class="control login">
            <button class="button is-success is-outlined is-large is-fullwidth" :class="{'is-loading': busy}" :disabled="!validated">Login</button>
        </p>
    </form>
</template>

<script>
    import Auth from '../../services/auth';

    export default {
        name: 'signinform',

        data() {
            return {
                form: {
                    email: '',
                    password: '',
                },
                validated: false,
                busy: false,
            }
        },

        watch: {
            form: {
                handler: function () {
                    this.$validator.validateAll()
                        .then(() => {
                            this.validated = true;
                        })
                        .catch(() => {
                            this.validated = false;
                        });
                },
                deep: true,
            }
        },

        methods: {
            signIn() {
                this.busy = true;
                Auth.signIn(this.form)
                    .then(() => this.busy = false)
                    .catch(errors => {
                        this.busy = false;
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/signin";
</style>