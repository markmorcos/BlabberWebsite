<template>
    <div :class="{
            'notification': true,
            'is-danger': method == 'is-danger',
            'is-info': method == 'is-info',
            'is-success': method == 'is-success',
        }"
         v-if="showMessage">
        <button class="delete" @click="showMessage = false"></button>
        {{ message }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                message: '',
                method: '',
                showMessage: false,
            }
        },

        mounted() {
            this.listenForErrors();
            this.listenForInformation();
            this.listenForSuccess();
        },

        methods: {
            listenForErrors() {
                let vm = this;
                Event.$on('error', function (error) {
                    if (error === 'login problem') {
                        error = error + ' Credentials do not match our records';
                    }
                    vm.message = error;
                    vm.method = 'is-danger';
                    vm.showMessage = true;
                    vm.$forceUpdate();
                })
            },

            listenForSuccess() {
                let vm = this;
                Event.$on('success', function (message) {
                    vm.message = message;
                    vm.method = 'is-success';
                    vm.showMessage = true;
                    vm.$forceUpdate();
                })
            },

            listenForInformation() {
                let vm = this;
                Event.$on('info', function (message) {
                    vm.message = message;
                    vm.method = 'is-info';
                    vm.showMessage = true;
                    vm.$forceUpdate();
                })
            }
        }
    }
</script>

<style scoped="">
    .notification {
        margin-bottom: 0px;
    }
</style>