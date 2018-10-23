<template>
    <div id="app">
        <messages></messages>
        <router-view></router-view>
    </div>
</template>

<script>
    import Messages from './components/partials/messages.vue';
    import Country from './services/country';
    export default {
        name: 'app',

        components: {
            messages: Messages
        },

        mounted() {
            Country.getCountryByIp();
        }
    }
</script>

<style lang="scss">
        @import "assets/scss/app";
</style>
