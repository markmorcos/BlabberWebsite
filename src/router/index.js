import Vue from 'vue'
import Router from 'vue-router'
import Auth from '../services/auth';

/** Components */
import Home from '../components/Home.vue'
import SignIn from '../components/SignIn.vue';
import SignUp from '../components/SignUp.vue';
import Password from '../components/Password.vue';
import Explore from '../components/Explore.vue';
import InnerExplore from '../components/InnerExplore.vue';
import Business from '../components/Business.vue';
import Profile from '../components/Profile.vue';
import AboutUs from '../components/AboutUs.vue';
import Privacy from '../components/Privacy.vue';
import Search from '../components/Search.vue';

Vue.use(Router)

const router  = new Router({
    mode: 'history',
   linkActiveClass: 'active',
 
   routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/sign-in',
            name: 'signIn',
            component: SignIn,
            meta: {requiresGuest: true}
        },
        {
            path: '/sign-up',
            name: 'signUp',
            component: SignUp,
            meta: {requiresGuest: true}
        },
        {
            path: '/recover-password',
            name: 'password',
            component: Password,
            meta: {requiresGuest: true}
        },
        {
            path: '/explore/:id',
            name: 'Explore',
            component: InnerExplore,
        },
        {
            path: '/explore',
            name: 'Explore',
            component: Explore,
        },
        {
            path: '/about-us',
            name: 'AboutUs',
            component: AboutUs,
        },
        {
            path: '/privacy-policy',
            name: 'Privacy',
            component: Privacy,
        },
        {
            path: '/business/:name/:id',
            name: 'Business',
            component: Business,
            props: true
        },
        {
            path: '/profile/:name/:id',
            name: 'Profile',
            component: Profile,
            props: true
        },
        {
            path: '/search/:query',
            name: 'Search',
            component: Search,
            props: true,
        },
        {
            path: '/search',
            name: 'Search',
            component: Search,
            props: true,
        },
        
    ]
})


router.beforeEach((to, from, next) => {

    if (to.meta.requiresGuest) {
        if (Auth.isSignedIn()) {
            return next('/');
        } else {
            return next();
        }
    }

    if (to.meta.requiresAuth) {
        if (Auth.isSignedIn()) {
            return next();
        } else {
            return next('/sign-in');
        }
    }

    return next();
})

export {router as default}
