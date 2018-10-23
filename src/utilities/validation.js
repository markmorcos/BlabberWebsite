import {Validator} from 'vee-validate';

Validator.extend('uniqueUsername', {
    getMessage(field, args) {
        return 'The username is already taken';
    },

    validate(value, args) {
        if (value.length > 2) {
            return new Promise(resolve => {
                axios
                    .get('is-unique-username', {params: {username: value}})
                    .then(() => {
                        resolve({
                            valid: true
                        });
                    })
                    .catch(() => {
                        resolve({
                            valid: false
                        });
                    });
            });
        }

        return true;
    }
});