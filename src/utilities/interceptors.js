import Auth from '../services/auth';

/**
 * Intercept blabber api response accept
 * or reject according to data status.
 */
axios.interceptors.response.use(function (response) {

    if (response.data.status == 0) {
        return response;
    }else {
        Event.$emit('error', response.data.errors);
        return Promise.reject(response);
    }

}, function (error) {
    return Promise.reject(error);
});

/**
 * Intercept every request and add the
 * auth user key and id to data.
 */
axios.interceptors.request.use(function (config) {

    if (Auth.isSignedIn()) {

        if(config.method == 'get'){
            if (!config.params) {
                config.params = {
                    auth_key: localStorage.getItem('authKey'),
                    user_id: Auth.user().id,
                    country_id: localStorage.getItem('country_id'),
                }
            }

            if (config.params) {
                config.params['auth_key'] = localStorage.getItem('authKey');
                config.params['user_id'] = Auth.user().id;
            }
        }

        if(config.method == 'post') {
            if (!config.data) {
                auth_key: localStorage.getItem('authKey');
                user_id: Auth.user().id;
                country_id: localStorage.getItem('country_id');
            }
            if (config.data) {
                config.data['auth_key'] = localStorage.getItem('authKey');
                config.data['user_id'] = Auth.user().id;
            }
        }
    }

    if(config.method == 'get'){
        if (!config.params) {
            config.params = {
                country_id: localStorage.getItem('country_id'),
            }
        }

        if (config.params) {
            config.params['country_id'] = localStorage.getItem('country_id');
        }
    }

    if(config.method == 'post') {
        if (!config.data) {
            country_id: localStorage.getItem('country_id');
        }
        if (config.data) {
            config.data['country_id'] = localStorage.getItem('country_id');
        }
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});