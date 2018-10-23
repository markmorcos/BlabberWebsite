class Country {
    static getCountryByIp(){
        return new Promise((resolve, reject) => {
            $.getJSON("http://freegeoip.net/json/", function (data) {
                resolve(data);
                Country.getCountries()
                    .then(countries => {
                        let currentCountry = _.filter(countries, function (country) {
                            return country.name == data.country_name;
                        })[0]
                        Country.setCountry(currentCountry);
                    });
            });
        });
    }

    static setCountry(country) {
        localStorage.setItem('country_id', country.id);
        Event.$emit('country-changed');
    }

    static getCountries() {
        return new Promise((resolve, reject) => {
            axios.get('get-countries')
                .then(response => resolve(response.data.countries))
                .catch(response => {
                    reject(response)
                    console.log(response);
                });
        });
    }

    static isSelected(country) {
        if(localStorage.getItem('country_id')){
            return country.id == localStorage.getItem('country_id');
        }

        return false;
    }
}

export {Country as default};