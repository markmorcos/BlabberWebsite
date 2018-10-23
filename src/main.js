import Vue from 'vue'
import App from './App'
import router from './router'

/**
 * Set a vue object to broadcast and listen for events.
 */
window.Event = new Vue();

/**
 * Require the bootstrap file.
 */
require('./bootstrap.js');

/**
 * Vue js dependencies.
 */
import VeeValidate from 'vee-validate';
import infiniteScroll from 'vue-infinite-scroll';
import AsyncComputed from 'vue-async-computed';

Vue.use(VeeValidate);
Vue.use(infiniteScroll);
Vue.use(AsyncComputed);

/**
 * Disable the vue config tip in production.
 * @type {boolean}
 */
Vue.config.productionTip = false

/**
 * Require utility scripts.
 */
require('./utilities/validation');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
