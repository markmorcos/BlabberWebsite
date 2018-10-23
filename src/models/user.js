class User {
    /**
     * User model constructor.
     * @param data
     */
    constructor(data) {
        _.forEach(data, (item, name) => {
            this[name] = item;
        });
    }

    /**
     * Initialize a collection of users.
     * @param user
     * @returns {Array}
     */
    static initializeCollection(collection) {
        let initializedUsers = [];
        _.forEach(collection, (user) => {
            let initializedUser = new User(user);
            initializedUsers.push(initializedUser);
        });

        return initializedUsers;
    }

    /**
     * Get user profile data.
     * @param id
     * @returns {Promise}
     */
    static getUserData(id) {
        return new Promise((resolve, reject) => {
            axios
                .get('get-profile', {params: {user_id_to_get: id}})
                .then(response => {
                    resolve(new User(response.data.user_data));
                })
                .catch(response => {
                    console.log(response);
                    reject(response);
                });
        });
    }
}

export {User as default};