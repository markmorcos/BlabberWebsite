<template>
    <div class="card">
        <header class="card-header">
            <router-link :to="{ name: 'Business', params: { name: getSlug(business.name), id: business.id}}">
                <p class="card-header-title" style="height: 66px">
                    <img :src="business.main_image" class="avatar">
                    {{business.name}}
                </p>
            </router-link>
        </header>
        <div class="card-image">
            <figure class="image is-4by3">
                <router-link :to="{ name: 'Business', params: { name: getSlug(business.name), id: business.id}}">
                    <img :src="business.main_image" alt="Image" style="margin: auto; height: 200px; width: auto">
                </router-link>
            </figure>
        </div>
        <div class="card-content">
            <div class="panel-block-item">
                <span class="likes">
                    <span class="icon">
                    <i class="fa fa-eye"></i>
                    </span>
                    {{business.no_of_views}}
                </span>
                <span class="comments">
                    <span class="icon">
                        <i class="fa fa-map-marker"></i>
                    </span>
                    {{business.no_of_checkins}}
                </span>
                <span class="comments">
                    <span class="icon">
                        <i class="fa fa-comment"></i>
                    </span>
                    {{business.no_of_reviews}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import Helpers from '../../utilities/helpers';

    export default {
        name: 'businesscard',

        props: {
            business: null,
        },

        methods: {
            getSlug(name) {
                return Helpers.slugify(name);
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/gallery";
</style>