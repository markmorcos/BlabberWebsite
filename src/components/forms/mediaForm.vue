<template>
    <form @submit.prevent="saveMedia()" id="data" method="post" enctype="multipart/form-data" v-if="Auth.isSignedIn()">
        <input type="hidden" name="type" value="image">
        <input type="hidden" name="user_id" :value="Auth.user().id">
        <input type="hidden" name="auth_key" :value="Auth.getKey()">
        <input type="hidden" name="business_id" :value="business.id">

        <div class="field">
            <label class="label">Image </label>
            <p class="control">
                <input name="Media[file]" type="file" />
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('file')}">{{errors.first('file')}}</p>
        </div>

        <div class="field">
            <label class="label">Caption </label>
            <p class="control">
                <input :class="{'input': true, 'is-danger': errors.has('caption')}"
                               id="caption"
                               name="caption"
                               type="text"
                               placeholder="Caption "
                               v-model="form.caption">
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('caption')}">{{errors.first('caption')}}</p>
        </div>

        <div class="field">
            <p class="control">
                <input :class="{'input': true, 'is-danger': errors.has('rating')}"
                               id="rating"
                               name="rating"
                               type="hidden"
                               placeholder="Rate the business..."
                               v-validate="'required|between:1,5'"
                               v-model="form.rating">
                <star-rating
                    :rating="Number(form.rating)"
                    :star-size="20"
                    :show-rating="false"
                    @rating-selected="setRating" />
            </p>
            <p :class="{'help': true, 'is-danger': errors.has('rating')}">{{errors.first('rating')}}</p>
        </div>

        <p class="control ">
            <button class="button is-info" :class="{'is-loading': busy}">Save</button>
        </p>
    </form>
</template>

<script>
    import Auth from '../../services/auth';
    import StarRating from 'vue-star-rating';

    export default {
        name: 'mediaform',
        components: {
            StarRating
        },
        props: {
            business: null,
        },

        data() {
            return {
                Auth: Auth,
                form: {
                    caption: '',
                    rating: ''
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
            setRating: function(rating) {
                this.form.rating = "" + rating;
            },
            saveMedia() {
                let vm = this;
                this.busy = true;
                $("form#data").submit(function() {

                    var formData = new FormData(this);
                    // formData.append('image', $('form#data input[type=file]')[0].files[0]); 

                    $.ajax({
                        url: 'http://myblabber.com/be-master/api/add-media',
                        type: 'POST',
                        data: formData,
                        async: true,
                        success: function (data) {
                            vm.busy = false;
                            Event.$emit('media-created');
                        },
                        cache: false,
                        contentType: false,
                        processData: false
                    });

                    return false;
                });
            },

        }
    }
</script>