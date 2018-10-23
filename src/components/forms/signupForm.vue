<template>
    <form @submit.prevent="signUp()">

        <div class="field">
            <label class="label">Name </label>
            <p class="control">
                <input :class="{'input': true, 'is-danger': errors.has('name')}"
                               id="name"
                               name="name"
                               type="text"
                               placeholder="Name"
                               v-validate="'required|min: 3'"
                               v-model="form.name">
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('name')}">{{errors.first('name')}}</p>
        </div>

        <div class="field">
            <label class="label">Username </label>
            <p class="control">
                <input :class="{'input': true, 'is-danger': errors.has('username')}"
                               id="username"
                               name="username"
                               type="text"
                               placeholder="Username"
                               v-validate="'required|min: 3|uniqueUsername'"
                               v-model="form.username">
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('username')}">{{errors.first('username')}}</p>
        </div>

        <div class="field">
            <label class="label">Email </label>
            <p class="control">
                <input :class="{'input': true, 'is-danger': errors.has('email')}"
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
            <label class="label">Password </label>
            <p class="control">
                <input :class="{'input': true, 'is-danger': errors.has('password')}"
                               id="password"
                               name="password"
                               type="password"
                               placeholder="Password"
                               v-validate="'required|min: 6'"
                               v-model="form.password">
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('password')}">{{errors.first('password')}}</p>
        </div>

        <p class="control">
            <button class="button is-primary is-large is-fullwidth" :class="{'is-loading': busy}" :disabled="!validated">Sign Up</button>
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
                    name: '',
                    username: '',
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
            signUp() {
                this.busy = true;
                Auth.signUp(this.form)
                    .then(() => this.busy = false)
                    .catch(errors => {
                        this.busy = false;
                    });
            }
        }
    }
</script>