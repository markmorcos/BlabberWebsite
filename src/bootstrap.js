window._ = require('lodash');
window.moment = require('moment');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');
} catch (e) {
}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

axios.defaults.baseURL = 'http://myblabber.com/be-master/api';

/**
 * Require axios interceptors.
 */
require('./utilities/interceptors');

/**
 * Require parse mentions.
 * @type {parse}
 */
window.parse = require('parse-mentions');
