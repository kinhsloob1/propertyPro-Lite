class Utils {
    static convertToBoolean(value) {
        let newValue = String(value).toLowerCase().trim();
        switch (true) {
            case (['no', '0', 'false', '', 'null'].indexOf(newValue) !== -1):
                return false
                break;

            default:
                return Boolean(value);
        }
    }
}

class User {
    constructor({ id, first_name, last_name, email, phoneNumber, address, is_admin, is_verified }) {
        this._id = parseInt(id);
        this._first_name = String(first_name);
        this._last_name = String(last_name);
        this._email = String(email);
        this._phoneNumber = String(phoneNumber);
        this._address = String(address);
        this._is_admin = Utils.convertToBoolean(is_admin);
        this._is_verified = Utils.convertToBoolean(is_verified);
    }

    isUser({ id }) {
        return id === this.id;
    }

    get id() {
        return this._id;
    }

    get first_name() {
        return this._first_name;
    }

    get last_name() {
        return this._last_name;
    }

    get email() {
        return this._email;
    }

    get phoneNumber() {
        return this._phoneNumber;
    }

    get address() {
        return this._address;
    }

    get is_admin() {
        return this._is_admin;
    }

    get is_verified() {
        return this._is_verified;
    }
}

class Property {
    constructor({ id, owner, status, price, state, city, address, type, created_on, image_url, other_images = [], reports = [] }) {
        this._id = parseInt(id);
        this._status = String(status);
        this._price = parseFloat(price);
        this._state = String(state);
        this._city = String(city);
        this._address = String(address);
        this._type = String(type);
        this._created_on = new Date(created_on);
        this._image_url = String(image_url);

        this._owner = new User(owner);

        if (!Array.isArray(other_images)) {
            other_images = [];
        }

        let valid_images = [],
            current,
            length = other_images.length,
            image;

        for (current = 0; current < length; current++) {
            image = other_images[current];
            if (typeof image === 'string') {
                valid_images[valid_images.length] = image;
            }
        }

        this._other_images = valid_images;

        if (!Array.isArray(reports)) {
            reports = [];
        }

        this._reports = reports;
    }

    get id() {
        return this._id;
    }

    get owner() {
        return this._owner;
    }

    get status() {
        return this._status;
    }

    get price() {
        return this._price
    }

    get state() {
        return this._state;
    }

    get city() {
        return this._city
    }

    get address() {
        return this._address;
    }

    get type() {
        return this._type;
    }

    get created_on() {
        return this._created_on;
    }

    get images() {
        let out = [];
        out[out.length] = this._image_url;
        return out.concat(this._other_images);
    }

    get reports() {
        return this._reports;
    }

    canBeDeletedByUser(user) {
        if (typeof user === 'object') {
            return (user.is_admin || this.owner.isUser(user));
        }
        return false;
    }

    canBeEditedByUser(user) {
        if (typeof user === 'object') {
            return (user.is_admin || this.owner.isUser(user));
        }
        return false;
    }

    canBeReportedByUser(user) {
        if (typeof user === 'object') {
            return !this.reports.find(({ user: by }, index) => {
                this.owner.isUser(user);
            });
        }
        return false;
    }
}

class RegistrationPage {
    constructor() {
        this._hasBindedEvents = 0;
    }

    get hasBindedEvents() {
        return this._hasBindedEvents;
    }

    bindEvents() {
        if (!this.hasBindedEvents) {
            let events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'],
                setError = (input, error) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (!errorNode) {
                        errorNode = document.createElement('div');
                        errorNode.classList.add('error');
                        input.parentNode.insertBefore(errorNode, input);
                    }

                    input.parentNode.dataset.isValid = 'false';
                    input.style.border = '0.2px solid rgb(255,0,0)';
                    errorNode.textContent = error;
                },
                removeError = (input) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (errorNode) {
                        input.parentNode.removeChild(errorNode);
                    }
                },
                makeValid = (input) => {
                    input.parentNode.dataset.isValid = true;
                    input.style.border = '0.2px solid rgb(90,90,90)';
                },
                isFormValid = () => {
                    let inputs = form.querySelectorAll('.input:not([data-is-valid]), .input[data-is-valid="false"]');
                    return !inputs.length;
                },
                form = document.querySelector('#register > .container'),
                submitButton = form.querySelector('.submit > button'),
                handleSubmitButton = () => {
                    if (isFormValid()) {
                        submitButton.removeAttribute('disabled');
                    } else {
                        if (!submitButton.hasAttribute('disabled')) {
                            submitButton.setAttribute('disabled', 'disabled');
                        }
                    }
                },
                first_name = form.querySelector('.input > input[name="first_name"]'),
                first_name_timer,
                first_name_change_handler = function (e) {
                    if (first_name_timer) {
                        clearTimeout(first_name_timer);
                    }

                    first_name_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length >= 3) {
                            if (value.length > 255) {
                                setError(this, 'First name should be below 255 characters');
                                return;
                            }

                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'First name should be above 3 characters');
                        return;
                    }, 300);
                },
                last_name = form.querySelector('.input > input[name="last_name"]'),
                last_name_timer,
                last_name_change_handler = function (e) {
                    if (last_name_timer) {
                        clearTimeout(last_name_timer);
                    }

                    last_name_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length >= 3) {
                            if (value.length > 255) {
                                setError(this, 'Last name should be below 255 characters');
                                return;
                            }

                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Last name should be above 3 characters');
                        return;
                    }, 300);
                },
                email = form.querySelector('.input > input[name="email"]'),
                email_timer,
                email_change_handler = function (e) {
                    if (email_timer) {
                        clearTimeout(email_timer);
                    }

                    email_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Invalid email address');
                        return;
                    }, 300);
                },
                phoneNumber = form.querySelector('.input > input[name="phoneNumber"]'),
                phoneNumber_timer,
                phoneNumber_change_handler = function (e) {
                    if (phoneNumber_timer) {
                        clearTimeout(phoneNumber_timer);
                    }

                    phoneNumber_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.match(/^\d{11}$/)) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Invalid phone number');
                        return;
                    }, 300);
                },
                password = form.querySelector('.input > input[name="password"]'),
                password_timer,
                password_change_handler = function (e) {
                    if (password_timer) {
                        clearTimeout(password_timer);
                    }

                    password_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length >= 3) {
                            if (value.length > 255) {
                                setError(this, 'Password should be below 255 characters');
                                return;
                            }

                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Password should be above 3 characters');
                        return;
                    }, 300);
                },
                confirmPassword = form.querySelector('.input > input[name="confirmPassword"]'),
                confirmPassword_timer,
                confirmPassword_change_handler = function (e) {
                    if (confirmPassword_timer) {
                        clearTimeout(confirmPassword_timer);
                    }

                    confirmPassword_timer = setTimeout(() => {
                        let value = String(this.value),
                            passwordElement = form.querySelector('input[name="password"]');

                        if (!(passwordElement && (passwordElement.parentNode.dataset.isValid == 'true'))) {
                            setError(this, 'Please insert your password in the passowrd field first');
                            return;
                        }

                        if (passwordElement.value !== value) {
                            setError(this, 'Passwords do not match... please try again');
                            return;
                        }

                        removeError(this);
                        makeValid(this);
                        return;
                    }, 300);
                },
                address = form.querySelector('.input > textarea[name="address"]'),
                address_timer,
                address_change_handler = function (e) {
                    if (address_timer) {
                        clearTimeout(address_timer);
                    }

                    address_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.match(/^[a-zA-Z,0-9]{1,}\s[\S\s]{2,}$/)) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Invalid home address');
                        return;
                    }, 300);
                },
                form_timer,
                form_change_handler = function (e) {
                    if (form_timer) {
                        clearTimeout(form_timer);
                    }

                    form_timer = setTimeout(() => {
                        handleSubmitButton();
                    }, 500);
                };

            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });

            events.forEach((event) => {
                first_name.addEventListener(event, first_name_change_handler);
                last_name.addEventListener(event, last_name_change_handler);
                email.addEventListener(event, email_change_handler);
                phoneNumber.addEventListener(event, phoneNumber_change_handler);
                password.addEventListener(event, password_change_handler);
                confirmPassword.addEventListener(event, confirmPassword_change_handler);
                address.addEventListener(event, address_change_handler);
                form.addEventListener(event, form_change_handler);
            });

            this._hasBindedEvents = true;
        }
    }

    init() {
        this.bindEvents();
    }
}


class LoginPage {
    constructor() {
        this._hasBindedEvents = 0;
    }

    get hasBindedEvents() {
        return this._hasBindedEvents;
    }

    bindEvents() {
        if (!this.hasBindedEvents) {
            let events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'],
                form = document.querySelector('#login > .container'),
                submitButton = form.querySelector('.submit > button'),
                setError = (input, error) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (!errorNode) {
                        errorNode = document.createElement('div');
                        errorNode.classList.add('error');
                        input.parentNode.insertBefore(errorNode, input);
                    }

                    input.parentNode.dataset.isValid = 'false';
                    input.style.border = '0.2px solid rgb(255,0,0)';
                    errorNode.textContent = error;
                },
                removeError = (input) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (errorNode) {
                        input.parentNode.removeChild(errorNode);
                    }
                },
                makeValid = (input) => {
                    input.parentNode.dataset.isValid = true;
                    input.style.border = '0.2px solid rgb(90,90,90)';
                },
                isFormValid = () => {
                    let inputs = form.querySelectorAll('.input:not([data-is-valid]), .input[data-is-valid="false"]');
                    return !inputs.length;
                },
                handleSubmitButton = () => {
                    if (isFormValid()) {
                        submitButton.removeAttribute('disabled');
                    } else {
                        if (!submitButton.hasAttribute('disabled')) {
                            submitButton.setAttribute('disabled', 'disabled');
                        }
                    }
                },
                login = form.querySelector('.input > input[name="login"]'),
                login_timer,
                login_change_handler = function (e) {
                    if (login_timer) {
                        clearTimeout(login_timer);
                    }

                    login_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Invalid login. please insert registered email address');
                        return;
                    }, 300);
                },
                password = form.querySelector('.input > input[name="password"]'),
                password_timer,
                password_change_handler = function (e) {
                    if (password_timer) {
                        clearTimeout(password_timer);
                    }

                    password_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length >= 3) {
                            if (value.length > 255) {
                                setError(this, 'Password should be below 255 characters');
                                return;
                            }

                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Password should be above 3 characters');
                        return;
                    }, 300);
                },
                form_timer,
                form_change_handler = function (e) {
                    if (form_timer) {
                        clearTimeout(form_timer);
                    }

                    form_timer = setTimeout(() => {
                        handleSubmitButton();
                    }, 500);
                };

            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });

            events.forEach((event) => {
                login.addEventListener(event, login_change_handler);
                password.addEventListener(event, password_change_handler);
                form.addEventListener(event, form_change_handler);
            });

            this._hasBindedEvents = true;
        }
    }

    init() {
        this.bindEvents();
    }
}

class ForgotPasswordPage {
    constructor() {
        this._hasBindedEvents = 0;
    }

    get hasBindedEvents() {
        return this._hasBindedEvents;
    }

    bindEvents() {
        if (!this.hasBindedEvents) {
            let events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'],
                form = document.querySelector('#forgot-password > .container'),
                submitButton = form.querySelector('.submit > button'),
                setError = (input, error) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (!errorNode) {
                        errorNode = document.createElement('div');
                        errorNode.classList.add('error');
                        input.parentNode.insertBefore(errorNode, input);
                    }

                    input.parentNode.dataset.isValid = 'false';
                    input.style.border = '0.2px solid rgb(255,0,0)';
                    errorNode.textContent = error;
                },
                removeError = (input) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (errorNode) {
                        input.parentNode.removeChild(errorNode);
                    }
                },
                makeValid = (input) => {
                    input.parentNode.dataset.isValid = true;
                    input.style.border = '0.2px solid rgb(90,90,90)';
                },
                isFormValid = () => {
                    let inputs = form.querySelectorAll('.input:not([data-is-valid]), .input[data-is-valid="false"]');
                    return !inputs.length;
                },
                handleSubmitButton = () => {
                    if (isFormValid()) {
                        submitButton.removeAttribute('disabled');
                    } else {
                        if (!submitButton.hasAttribute('disabled')) {
                            submitButton.setAttribute('disabled', 'disabled');
                        }
                    }
                },
                email = form.querySelector('.input > input[name="email"]'),
                email_timer,
                email_change_handler = function (e) {
                    if (email_timer) {
                        clearTimeout(email_timer);
                    }

                    email_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Invalid email. please insert registered email address');
                        return;
                    }, 300);
                },
                form_timer,
                form_change_handler = function (e) {
                    if (form_timer) {
                        clearTimeout(form_timer);
                    }

                    form_timer = setTimeout(() => {
                        handleSubmitButton();
                    }, 500);
                };

            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });

            events.forEach((event) => {
                email.addEventListener(event, email_change_handler);
                form.addEventListener(event, form_change_handler);
            });

            this._hasBindedEvents = true;
        }
    }

    init() {
        this.bindEvents();
    }
}

class VerifyTokenPage {
    constructor() {
        this._hasBindedEvents = 0;
    }

    get hasBindedEvents() {
        return this._hasBindedEvents;
    }

    bindEvents() {
        if (!this.hasBindedEvents) {
            let events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'],
                form = document.querySelector('#verify-token > .container'),
                submitButton = form.querySelector('.submit > button'),
                setError = (input, error) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (!errorNode) {
                        errorNode = document.createElement('div');
                        errorNode.classList.add('error');
                        input.parentNode.insertBefore(errorNode, input);
                    }

                    input.parentNode.dataset.isValid = 'false';
                    input.style.border = '0.2px solid rgb(255,0,0)';
                    errorNode.textContent = error;
                },
                removeError = (input) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (errorNode) {
                        input.parentNode.removeChild(errorNode);
                    }
                },
                makeValid = (input) => {
                    input.parentNode.dataset.isValid = true;
                    input.style.border = '0.2px solid rgb(90,90,90)';
                },
                isFormValid = () => {
                    let inputs = form.querySelectorAll('.input:not([data-is-valid]), .input[data-is-valid="false"]');
                    return !inputs.length;
                },
                handleSubmitButton = () => {
                    if (isFormValid()) {
                        submitButton.removeAttribute('disabled');
                    } else {
                        if (!submitButton.hasAttribute('disabled')) {
                            submitButton.setAttribute('disabled', 'disabled');
                        }
                    }
                },
                token = form.querySelector('.input > input[name="token"]'),
                token_timer,
                token_change_handler = function (e) {
                    if (token_timer) {
                        clearTimeout(token_timer);
                    }

                    token_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'PLease insert the token that was sent to your email');
                        return;
                    }, 300);
                },
                form_timer,
                form_change_handler = function (e) {
                    if (form_timer) {
                        clearTimeout(form_timer);
                    }

                    form_timer = setTimeout(() => {
                        handleSubmitButton();
                    }, 500);
                };

            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });

            events.forEach((event) => {
                token.addEventListener(event, token_change_handler);
                form.addEventListener(event, form_change_handler);
            });

            this._hasBindedEvents = true;
        }
    }

    init() {
        this.bindEvents();
    }
}

class UpdatePasswordPage {
    constructor() {
        this._hasBindedEvents = 0;
    }

    get hasBindedEvents() {
        return this._hasBindedEvents;
    }

    bindEvents() {
        if (!this.hasBindedEvents) {
            let events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'],
                form = document.querySelector('#update-password > .container'),
                submitButton = form.querySelector('.submit > button'),
                setError = (input, error) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (!errorNode) {
                        errorNode = document.createElement('div');
                        errorNode.classList.add('error');
                        input.parentNode.insertBefore(errorNode, input);
                    }

                    input.parentNode.dataset.isValid = 'false';
                    input.style.border = '0.2px solid rgb(255,0,0)';
                    errorNode.textContent = error;
                },
                removeError = (input) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (errorNode) {
                        input.parentNode.removeChild(errorNode);
                    }
                },
                makeValid = (input) => {
                    input.parentNode.dataset.isValid = true;
                    input.style.border = '0.2px solid rgb(90,90,90)';
                },
                isFormValid = () => {
                    let inputs = form.querySelectorAll('.input:not([data-is-valid]), .input[data-is-valid="false"]');
                    return !inputs.length;
                },
                handleSubmitButton = () => {
                    if (isFormValid()) {
                        submitButton.removeAttribute('disabled');
                    } else {
                        if (!submitButton.hasAttribute('disabled')) {
                            submitButton.setAttribute('disabled', 'disabled');
                        }
                    }
                },
                password = form.querySelector('.input > input[name="password"]'),
                password_timer,
                password_change_handler = function (e) {
                    if (password_timer) {
                        clearTimeout(password_timer);
                    }

                    password_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length >= 3) {
                            if (value.length > 255) {
                                setError(this, 'Password should be below 255 characters');
                                return;
                            }

                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Password should be above 3 characters');
                        return;
                    }, 300);
                },
                confirmPassword = form.querySelector('.input > input[name="confirmPassword"]'),
                confirmPassword_timer,
                confirmPassword_change_handler = function (e) {
                    if (confirmPassword_timer) {
                        clearTimeout(confirmPassword_timer);
                    }

                    confirmPassword_timer = setTimeout(() => {
                        let value = String(this.value),
                            passwordElement = form.querySelector('input[name="password"]');

                        if (!(passwordElement && (passwordElement.parentNode.dataset.isValid == 'true'))) {
                            setError(this, 'Please insert your password in the passowrd field first');
                            return;
                        }

                        if (passwordElement.value !== value) {
                            setError(this, 'Passwords do not match... please try again');
                            return;
                        }

                        removeError(this);
                        makeValid(this);
                        return;
                    }, 300);
                },
                form_timer,
                form_change_handler = function (e) {
                    if (form_timer) {
                        clearTimeout(form_timer);
                    }

                    form_timer = setTimeout(() => {
                        handleSubmitButton();
                    }, 500);
                };

            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });

            events.forEach((event) => {
                password.addEventListener(event, password_change_handler);
                confirmPassword.addEventListener(event, confirmPassword_change_handler);
                form.addEventListener(event, form_change_handler);
            });

            this._hasBindedEvents = true;
        }
    }

    init() {
        this.bindEvents();
    }
}

class PropertiesPage {
    constructor() {

    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = new User(user);
    }

    loadProperties() {

    }

    loadMap(markers) {
        let map = new google.maps.Map(document.getElementById('mapContainer'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 10
        }),
            input = document.getElementById('pac-input'),
            searchBox = new google.maps.places.SearchBox(input);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            let places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });


        google.maps.event.addListener(map, 'click', function (e) {
            console.log(e.latLng.lat());
            console.log(e.latLng.lng());
        });
    }

    init() {
        this.loadProperties();
    }
}

class PropertyPage {
    constructor() {

    }

    get propertiesPage() {
        if (typeof this._propertiesPage !== 'object') {
            this._propertiesPage = new PropertiesPage();
        }
        return this._propertiesPage;
    }

    init() {
        this.propertiesPage.loadProperties();
    }
}

class PostPropertyPage {
    constructor() {
        this._hasBindedEvents = 0;
    }

    get hasBindedEvents() {
        return this._hasBindedEvents;
    }

    bindEvents() {
        if (!this.hasBindedEvents) {
            let events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'],
                setError = (input, error) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (!errorNode) {
                        errorNode = document.createElement('div');
                        errorNode.classList.add('error');
                        input.parentNode.insertBefore(errorNode, input);
                    }

                    input.parentNode.dataset.isValid = 'false';
                    input.style.border = '0.2px solid rgb(255,0,0)';
                    errorNode.textContent = error;
                },
                removeError = (input) => {
                    let errorNode = input.parentNode.querySelector('.error');
                    if (errorNode) {
                        input.parentNode.removeChild(errorNode);
                    }
                },
                makeValid = (input) => {
                    input.parentNode.dataset.isValid = true;
                    input.style.border = '0.2px solid rgb(90,90,90)';
                },
                form = document.querySelector('main > .parent.form > form.container'),
                submitButton = form.querySelector('.submit > button'),
                imageInputContainer = form.querySelector('.input.image'),
                imagesHolder = imageInputContainer.querySelector('.holder'),
                imageInputs = imageInputContainer.querySelector('input[type="file"]'),
                files = [],
                handleFiles = () => {
                    for (let current = 0, filesLength = files.length; current < filesLength; current++) {
                        if (!(files[current].type.match(/^image\/\S{2,}$/) && (files[current].size < Math.pow(1024, 2)))) {
                            files[current] = null;
                        }
                    }

                    let totalAdded = imageInputContainer.querySelectorAll('.holder > .image').length;
                    files.forEach(function (file, index) {
                        if (file && (totalAdded < 10)) {
                            let imageContainer = document.createElement('div'),
                                image = document.createElement('img'),
                                removeButton = document.createElement('button'),
                                imageUrl = URL.createObjectURL(file);

                            removeButton.classList.add('remove'); imageContainer.classList.add('image');
                            removeButton.innerHTML = '&times;'

                            removeButton.addEventListener('click', function (e) {
                                e.preventDefault();
                                removeButton.parentNode.parentNode.removeChild(removeButton.parentNode);
                                files[index] = null;
                            });

                            imageContainer.appendChild(removeButton);
                            imageContainer.appendChild(image);

                            image.addEventListener('load', function () {
                                URL.revokeObjectURL(imageUrl);
                                imageContainer.____arrayBuffer = new Blob([file], { "type": file.type });
                            });

                            image.addEventListener('error', function () {
                                URL.revokeObjectURL(imageUrl);
                                files[index] = null;
                                totalAdded--;
                            });

                            imagesHolder.appendChild(imageContainer);
                            image.setAttribute('src', imageUrl);
                            totalAdded++;
                        }
                    })
                },
                isFormValid = () => {
                    let imagesLength = form.querySelectorAll('.input.image > .holder > .image').length,
                        errorCon = form.querySelector('.input.image > .error'),
                        itemCon = form.querySelector('.input.image > .item');

                    if (!imagesLength) {
                        if (!errorCon) {
                            errorCon = document.createElement('div');
                            errorCon.classList.add('error');
                            itemCon.parentNode.insertBefore(errorCon, itemCon);
                        }

                        errorCon.textContent = 'At least, an image is required';
                        return false;
                    } else {
                        if (errorCon) {
                            errorCon.parentNode.removeChild(errorCon);
                        }
                    }

                    let inputs = form.querySelectorAll('.input:not([data-is-valid]), .input[data-is-valid="false"]');
                    return !inputs.length;
                },
                handleSubmitButton = () => {
                    if (isFormValid()) {
                        submitButton.removeAttribute('disabled');
                    } else {
                        if (!submitButton.hasAttribute('disabled')) {
                            submitButton.setAttribute('disabled', 'disabled');
                        }
                    }
                },
                title = form.querySelector('.input > input[name="title"]'),
                title_timer,
                title_change_handler = function (e) {
                    if (title_timer) {
                        clearTimeout(title_timer);
                    }

                    title_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.length >= 10) {
                            if (value.length > 255) {
                                setError(this, 'Title should be below 255 characters');
                                return;
                            }

                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Title should be above 10 characters');
                        return;
                    }, 300);
                },
                description = form.querySelector('.input > textarea[name="description"]'),
                description_timer,
                description_change_handler = function (e) {
                    if (description_timer) {
                        clearTimeout(description_timer);
                    }

                    description_timer = setTimeout(() => {
                        let value = String(this.value);
                        if (value.match(/^[a-zA-Z,0-9]{1,}\s[\S\s]{2,}$/)) {
                            removeError(this);
                            makeValid(this);
                            return;
                        }

                        setError(this, 'Invalid property description');
                        return;
                    }, 300);
                },
                form_timer,
                form_change_handler = function (e) {
                    if (form_timer) {
                        clearTimeout(form_timer);
                    }

                    form_timer = setTimeout(() => {
                        handleSubmitButton();
                    }, 500);
                },
                type = form.querySelector('.input > select[name="type"]'),
                transfer_type = form.querySelector('.input > select[name="transfer_type"]'),
                rest_room = form.querySelector('.input > select[name="rest_room"]'),
                state = form.querySelector('.input > select[name="state"]'),
                city = form.querySelector('.input > select[name="city"]');

            let selects = [
                type,
                transfer_type,
                rest_room,
                state,
                city
            ];

            form.addEventListener('submit', function (e) {
                e.preventDefault();
            });

            selects.forEach(function (select) {
                let select_timer,
                    select_change_handler = function (e) {
                        if (select_timer) {
                            clearTimeout(select_timer);
                        }

                        select_timer = setTimeout(() => {
                            let value = String(this.value);
                            if (value.length) {
                                removeError(this);
                                makeValid(this);
                                return;
                            }

                            setError(this, 'Please select a value');
                            return;
                        }, 300);
                    };

                events.forEach((event) => {
                    select.addEventListener(event, select_change_handler);
                });
            });

            events.forEach((event) => {
                title.addEventListener(event, title_change_handler);
                form.addEventListener(event, form_change_handler);
            });

            imageInputs.addEventListener('change', function (e) {
                files = Array.from(this.files);
                handleFiles();
            });

            this._hasBindedEvents = true;
        }
    }

    init() {
        this.bindEvents();
    }
}

class EditPropertyPage extends PostPropertyPage {
    constructor() {
        super()
    }

    bindEvents() {
        let removeButtons = document.querySelectorAll('main > .parent.form > form.container > .input.image > .holder > .image > button.remove');

        if (removeButtons.length) {
            removeButtons.forEach((removeButton,index) => {
                let parent = removeButton.parentNode,
                    image = parent.querySelector('img'),
                    src = image.dataset.src;

                image.onload = function () {
                    let data = {'src': src};
                    parent.____arrayBuffer = data;
                };

                image.onerror = function () {
                    parent.parentNode.removeChild(parent);
                };

                image.src = src;
                removeButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    removeButton.parentNode.parentNode.removeChild(removeButton.parentNode);
                });
            });
        }

        super.bindEvents();
    }

    init() {
        super.init();
    }
}

class LandingPage extends PropertiesPage{
    constructor() {
        super();
    }

    init() {
        super.init();
    }
}

class Pages {
    constructor() {

    }

    get registrationPage() {
        if (typeof this._registrationPage !== 'object') {
            this._registrationPage = new RegistrationPage();
        }
        return this._registrationPage;
    }

    get loginPage() {
        if (typeof this._loginPage !== 'object') {
            this._loginPage = new LoginPage();
        }
        return this._loginPage;
    }

    get forgotPasswordPage() {
        if (typeof this._forgotPasswordPage !== 'object') {
            this._forgotPasswordPage = new ForgotPasswordPage();
        }
        return this._forgotPasswordPage;
    }

    get verifyTokenPage() {
        if (typeof this._verifyTokenPage !== 'object') {
            this._verifyTokenPage = new VerifyTokenPage();
        }
        return this._verifyTokenPage;
    }

    get updatePasswordPage() {
        if (typeof this._updatePasswordPage !== 'object') {
            this._updatePasswordPage = new UpdatePasswordPage();
        }
        return this._updatePasswordPage;
    }

    get propertiesPage() {
        if (typeof this._propertiesPage !== 'object') {
            this._propertiesPage = new PropertiesPage();
        }
        return this._propertiesPage;
    }

    get propertyPage() {
        if (typeof this._propertyPage !== 'object') {
            this._propertyPage = new PropertyPage();
        }
        return this._propertyPage;
    }

    get postPropertyPage() {
        if (typeof this._postPropertyPage !== 'object') {
            this._postPropertyPage = new PostPropertyPage();
        }
        return this._postPropertyPage;
    }

    get editPropertyPage() {
        if (typeof this._editPropertyPage !== 'object') {
            this._editPropertyPage = new EditPropertyPage();
        }
        return this._editPropertyPage;
    }

    get landingPage() {
        if (typeof this._landingPage !== 'object') {
            this._landingPage = new LandingPage();
        }
        return this._landingPage;
    }
}