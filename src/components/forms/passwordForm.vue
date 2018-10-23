<template>
    <form @submit.prevent="request()">

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

        <p class="control">
            <button class="button is-primary is-large is-fullwidth" :class="{'is-loading': busy}" :disabled="!validated">Request</button>
        </p>
    </form>
</template>

<script>
    export default {
        name: 'passwordform',

        data() {
            return {
                form: {
                    email: '',
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
            request() {
                this.busy = true;
                axios
                    .get('/recover-password', {params: this.form})
                    .then(response => {
                        this.busy = false;
                        Event.$emit('success', 'A new password was sent to your email');
                    })
                    .catch(() => this.busy = false)
            }
        }
    }
</script>