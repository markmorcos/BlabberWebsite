<template>
    <div class="nav-right nav-menu" float= right>
        <a @click="login()" class="nav-item" v-if="!Auth.isSignedIn()">
            <i class="fa fa-facebook"></i>&nbsp;Login with Facebook
        </a>
        <router-link :to="'/sign-in'" class="nav-item" v-if="!Auth.isSignedIn()">
            Sign In
        </router-link>
        <span class="nav-item" v-if="Auth.isSignedIn()">
            <a class="nav-item" @click="logout()">Logout</a>
        </span>

        <span class="nav-item" v-if="!Auth.isSignedIn()">
            <router-link :to="'/sign-up'" class="nav-item button is-primary">
                Sign Up
            </router-link>
        </span>
        <router-link :to="{ name: 'Profile', params: { name: getSlug(Auth.user().name), id: Auth.user().id}}"
                     class="nav-item"
                     v-if="Auth.isSignedIn()">

            {{ Auth.user().name }} &nbsp;
            <img :src="Auth.user().profile_photo" alt="">
        </router-link>
        <div id="status"></div>
    </div>
</template>

<script>
    import Auth from '../../services/auth';
    import Helpers from '../../utilities/helpers';

    export default {
        data() {
            return {
                Auth: Auth,
            }
        },

        mounted() {
            const vm = this;
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : '1773696669565480',
                    cookie     : true,  // enable cookies to allow the server to access 
                                        // the session
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.8' // use graph api version 2.8
                });

                // Now that we've initialized the JavaScript SDK, we call 
                // FB.getLoginStatus().  This function gets the state of the
                // person visiting this page and can return one of three states to
                // the callback you provide.  They can be:
                //
                // 1. Logged into your app ('connected')
                // 2. Logged into Facebook, but not your app ('not_authorized')
                // 3. Not logged into Facebook and can't tell if they are logged into
                //    your app or not.
                //
                // These three cases are handled in the callback function.

                FB.getLoginStatus(function(response) {
                    vm.statusChangeCallback(response);
                });
            };

            // Load the SDK asynchronously
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '338951596524024'); // Insert your pixel ID here.
            fbq('track', 'PageView');
        },

        methods: {
            getSlug(name) {
                return Helpers.slugify(name);
            },
            checkLoginState() {
            },
            statusChangeCallback(response) {
                console.log('statusChangeCallback');
                console.log(response);
                // The response object is returned with a status field that lets the
                // app know the current login status of the person.
                // Full docs on the response object can be found in the documentation
                // for FB.getLoginStatus().
                if (response.status === 'connected' && !Auth.isSignedIn()) {
                    // Logged into your app and Facebook.
                    this.testAPI(response);
                } else {
                    // The person is not logged into your app or we are unable to tell.
                    // document.getElementById('status').innerHTML = 'Please log into this app.';
                }
            },
            testAPI(response) {
                console.log('Welcome!  Fetching your information.... ');
                console.log(response);
                FB.api('/me', function(res) {
                    console.log('Successful login for: ' + res.name);
                    Auth.signInFacebook(response.authResponse.userID, response.authResponse.accessToken, res.name, '12345678', '12345678');
                });
            },
            login() {
                const vm = this;
                FB.login(function(response) {
                    FB.getLoginStatus(function(response) {
                        vm.statusChangeCallback(response);
                    });
                });
            },
            logout() {
                try {
                    FB.logout(function(response) {
                        // Person is now logged out
                        Auth.logout();
                    })
                    .catch(() => {
                        Auth.logout();
                    });
                } catch (error) {
                    Auth.logout();
                }
            }
        }
    }
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=338951596524024&ev=PageView&noscript=1"
/></noscript>