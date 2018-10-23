<template>
    <div class="box">

        <div class="box-header">
            Settings
        </div>

        <div class="box-body">
            <form @submit.prevent="save()">

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
                               v-validate="'required|min: 3'"
                               v-model="form.username">
                    </p>
                    <p :class="{'help': true, 'is-danger': errors.has('username')}">{{errors.first('username')}}</p>
                </div>

                <div class="field">
                    <label class="label">Mobile </label>
                    <p class="control">
                        <input :class="{'input': true, 'is-danger': errors.has('mobile')}"
                               id="mobile"
                               name="mobile"
                               type="text"
                               placeholder="Mobile number "
                               v-validate="'min: 8'"
                               v-model="form.mobile">
                    </p>
                    <p :class="{'help': true, 'is-danger': errors.has('mobile')}">{{errors.first('mobile')}}</p>
                </div>

                <div class="field">
                    <label class="label">Gender</label>
                    <p class="control">
                        <select name="gender" id="gender" v-model="form.gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </p>
                    <p :class="{'help': true, 'is-danger': errors.has('gender')}">{{errors.first('gender')}}</p>
                </div>

                <div class="field">
                    <label class="label">Birthdate </label>
                    <p class="control">
                        <input :class="{'input': true, 'is-danger': errors.has('birthdate')}"
                               id="birthdate"
                               name="birthdate"
                               type="date"
                               placeholder="Birthdate"
                               v-validate="''"
                               v-model="form.birthdate">
                    </p>
                    <p :class="{'help': true, 'is-danger': errors.has('birthdate')}">{{errors.first('birthdate')}}</p>
                </div>

                <p class="control ">
                    <button class="button is-info" :class="{'is-loading': busy}">Save</button>
                </p>

            </form>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'usersettings',

        props: {
            user: null,
        },

        data() {
            return {
                form: {
                    name: '',
                    username: '',
                    mobile: '',
                    gender: '',
                    birthdate: '',
                },
                validated: false,
                busy: false,
            }
        },

        mounted() {
            this.form = this.user;
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
            },

            user() {
                if(this.user != null) {
                    this.form = this.user;
                }
            }
        },

        methods: {
            save() {
                this.busy = true;

                axios
                    .post('edit-profile', this.form)
                    .then(response => {
                        this.busy = false;
                        Event.$emit('user-updated');
                    });
            }
        }
    }
</script>