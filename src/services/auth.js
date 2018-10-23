import User from '../models/user';

class Auth {
    static user() {
        if (this.isSignedIn()) {
            return new User(JSON.parse(localStorage.getItem('userData')));
        }

        return false;
    }

    static signUp(credentials) {
        credentials.device_IMEI = '12345678';
        credentials.firebase_token = '12345678';
        return new Promise((resolve, reject) => {
            axios
                .get('sign-up', {params: credentials})
                .then(response => {
                    this.saveUserData(response.data.user_data);
                    this.saveAuthKey(response.data.auth_key);
                    Event.$emit('user-signed-up');
                    resolve(response);
                })
                .catch(response => {
                    reject(response);
                    console.log(response);
                })
        })
    }

    static signIn(credentials) {
        credentials.device_IMEI = '12345678';
        credentials.firebase_token = '12345678';
        return new Promise((resolve, reject) => {
            axios
                .get('sign-in', {params: credentials})
                .then(response => {
                    this.saveUserData(response.data.user_data);
                    this.saveAuthKey(response.data.auth_key);
                    Event.$emit('user-signed-in');
                    resolve(response);
                })
                .catch(response => {
                    reject(response);
                    console.log(response);
                })
        })
    }
       static signInFacebook(facebook_id,facebook_token,name) {
        return new Promise((resolve, reject) => {
            axios
                .get('sign-in-fb', { params: { facebook_id: facebook_id, facebook_token: facebook_token, name: name, device_IMEI: '12345678', firebase_token: '12345678' } })
                .then(response => {
                    this.saveUserData(response.data.user_data);
                    this.saveAuthKey(response.data.auth_key);
                    Event.$emit('user-signed-in');
                    location.reload();
                    resolve(response);
                })
                .catch(response => {
                    reject(response);
                    console.log(response);
                });
        })
    }

    static logout() {

        axios
            .post('logout', { params: { user_id: this.user().id, auth_key: this.getKey(), device_IMEI: '12345678' } })
            .then(response => {
                localStorage.removeItem('userData');
                localStorage.removeItem('authKey');
                Event.$emit('user-signed-out');
                location.reload();
            })
            .catch(() => {
                localStorage.removeItem('userData');
                localStorage.removeItem('authKey');
                Event.$emit('user-signed-out');
                location.reload();
            });
    }

    static isSignedIn() {
        return localStorage.getItem('authKey') != null;
    }

    static getKey() {
        return localStorage.getItem('authKey');
    }

    static isUser(user) {
        return this.user.id == user.id;
    }

    // private methods

    static saveUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    static saveAuthKey(authKey) {
        localStorage.setItem('authKey', authKey);
    }
}

export {Auth as default}