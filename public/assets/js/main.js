/* eslint-disable no-undef */
/* eslint-disable */

class Utils {
    static convertToBoolean(value) {
        const newValue = String(value).toLowerCase().trim();
        switch (true) {
        case (['no', '0', 'false', '', 'null'].indexOf(newValue) !== -1):
            return false;

        default:
            return Boolean(value);
        }
    }

    static getJwt() {
      return localStorage.getItem('token');
    }

    static saveJwt(jwt) {
      return localStorage.setItem('token',jwt);
    }

    static setStorageItem(key,value) {
      return localStorage.setItem(key, value);
    }

    static getStorageItem(key) {
      return localStorage.getItem(key);
  }

  static processRequestError({
    loader,
    error
  }) {
    loader.hideImage();
    loader.showText();
    loader.setMode('error');
    loader.setTitle('Server Response');
    loader.setText((error.code === 'ECONNABORTED') ? 'Ooops request time out' : 'An unknown server error occured');
  }
}

window.requestHandler = window.axios.create({
  baseURL: '/api/v2',
  timeout: 1000,
  validateStatus() {
    return true;
  },
  timeout: 10000,
  headers: {
    Bearer: Utils.getJwt() || ''
  }
});

class Loader {
    constructor(title, imageSrc = '/api/v1/assets/images/loading.gif') {
      const previousLoader = document.querySelector('#loader');
      if (previousLoader) {
        this.loader = previousLoader;
        this.reset(title, imageSrc);
      } else {
        const htmlScript = `
          <div class = "container">
            <div class = "header">
              <div class = "title">
                ${title}
              </div>
              <button class = "close">
                &times;
              </button>
            </div>
            <div class = "image">
              <img src = "${imageSrc}">
            </div>
            <div class = "text">

            </div>
          </div>`;

        const parentHtml = document.createElement('div');
        parentHtml.setAttribute('id', 'loader');
        parentHtml.innerHTML = htmlScript;
        document.body.appendChild(parentHtml);
        this.loader = parentHtml;

        const closeButton = parentHtml.querySelector('.header > button.close');
        if (closeButton) {
          closeButton.addEventListener('click', () => this.remove());
        }
      }
    }

    reset(title, imageSrc = '/api/v1/assets/images/loading.gif') {
      this.setMode('request');
      this.setTitle(title);
      this.setText('');
      this.hideText();
      this.showImage();
      this.setImage(imageSrc);
      this.add();
    }

    setImage(url) {
      const image = this.loader.querySelector('.image > img');
      if (image) {
        image.setAttribute('src', url);
        return image;
      }
      return null;
    }

    hideImage() {
        const image = this.loader.querySelector('.image');
        if (image) {
            image.style.display = 'none';
            return true;
        }
        return false;
    }

    showImage() {
        const image = this.loader.querySelector('.image');
        if (image) {
            image.style.display = 'flex';
            return true;
        }
        return false;
    }

    setTitle(text) {
      const titleCon = this.loader.querySelector('.header > .title');
      if (titleCon) {
        titleCon.textContent = text;
        return titleCon;
      }
      return null;
    }

    setText(text) {
      const textCon = this.loader.querySelector('.text');
      if (textCon) {
        textCon.textContent = text;
        return textCon;
      }
      return null;
    }

    hideText() {
      const textCon = this.loader.querySelector('.text');
      if (textCon) {
        textCon.style.display = 'none';
        return true;
      }
      return false;
    }

    showText() {
      const textCon = this.loader.querySelector('.text');
      if (textCon) {
        textCon.style.display = 'flex';
        return true;
      }
      return false;
    }

    setMode(mode = 'info') {
      const container = this.loader.querySelector('.container');
      if (container) {
        let color;
        switch(mode){
          case 'error':
            color = 'rgb(252, 29, 29)';
            break;

          case 'success':
            color = 'rgb(29, 252, 66)';
            break;

          default:
            color = 'rgb(0, 81, 187)';
        }

        container.style.borderTopColor = color;
        return container;
      }
      return null;
    }

    remove() {
        this.loader.style.display = 'none';
        return true;
    }

    add() {
        this.loader.style.display = 'flex';
        return true;
    }
}

class User extends Map {
  constructor({
    id,
    first_name: firstName,
    last_name: lastName,
    email,
    phoneNumber,
    address,
    is_admin: isAdmin,
    is_verified: isVerified,
  }) {
    super();
    this.set('id', parseInt(id, 10));
    this.set('first_name', String(firstName));
    this.set('last_name', String(lastName));
    this.set('email', String(email));
    this.set('phoneNumber', String(phoneNumber));
    this.set('address', String(address));
    this.set('is_admin', Utils.convertToBoolean(isAdmin));
    this.set('is_verified', Utils.convertToBoolean(isVerified));
  }

  isUser({ id }) {
    return id === this.id;
  }
}

class Property extends Map {
  constructor({
    id,
    ownerIsAdmin,
    ownerEmail,
    ownerId,
    ownerAddress,
    ownerPhoneNumber,
    status,
    price,
    state,
    city,
    address,
    type,
    option,
    description,
    title,
    created_on: createdOn,
    location,
    images,
  }) {
    super();
    this.set('id', parseInt(id, 10));
    this.set('status', String(status));
    this.set('price', parseFloat(price));
    this.set('state', String(state));
    this.set('city', String(city));
    this.set('address', String(address));
    this.set('type', String(type));
    this.set('option', String(option));
    this.set('description', String(description));
    this.set('title', String(title));
    this.set('created_on', new Date(createdOn));
    this.set('ownerEmail', String(ownerEmail));
    this.set('ownerId', String(ownerId));
    this.set('ownerAddress', String(ownerAddress));
    this.set('ownerPhoneNumber', String(ownerPhoneNumber));
    this.set('ownerIsAdmin', parseInt((ownerIsAdmin || 0),10));
    this.set('location', location);
    this.set('images', images);
  }

  canBeDeletedByUser() {
    return this.get('ownerIsAdmin') || (this.get('id') === parseInt(Utils.getStorageItem('id'), 10));
  }

  canBeEditedByUser(user) {
    return this.canBeDeletedByUser(user);
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
      const events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'];
      const setError = (input, error) => {
        let errorNode = input.parentNode.querySelector('.error');
        if (!errorNode) {
          errorNode = document.createElement('div');
          errorNode.classList.add('error');
          input.parentNode.insertBefore(errorNode, input);
        }

        input.parentNode.dataset.isValid = 'false';
        input.style.border = '0.2px solid rgb(255,0,0)';
        errorNode.textContent = error;
      };
      const removeError = (input) => {
        const errorNode = input.parentNode.querySelector('.error');
        if (errorNode) {
          input.parentNode.removeChild(errorNode);
        }
      };
      const makeValid = (input) => {
        input.parentNode.dataset.isValid = true;
        input.style.border = '0.2px solid rgb(90,90,90)';
      };
      const isFormValid = () => {
        const inputs = form.querySelectorAll('.input[data-is-valid="false"]');
        if (inputs.length === 0) {
          const noValidity = form.querySelectorAll('.input:not([data-is-valid]) > input,.input:not([data-is-valid]) > select, .input:not([data-is-valid]) > textarea');
          let isValid = true;
          if (noValidity.length > 0) {
            isValid = !Array.from(noValidity).find((noValid) => {
              return (noValid.value.length === 0);
            });
          }

          return isValid;
        }

        return false;
      };
      let form = document.querySelector('#register > .container');
      const submitButton = form.querySelector('.submit > button');
      const handleSubmitButton = () => {
        if (isFormValid()) {
          if (submitButton.hasAttribute('disabled')) {
            submitButton.removeAttribute('disabled');
          }
        } else if (!submitButton.hasAttribute('disabled')) {
          submitButton.setAttribute('disabled', 'disabled');
        }
      };
      const first_name = form.querySelector('.input > input[name="first_name"]');
      let first_name_timer;
      const first_name_change_handler = function (e) {
        if (first_name_timer) {
          clearTimeout(first_name_timer);
        }

        first_name_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      const last_name = form.querySelector('.input > input[name="last_name"]');
      let last_name_timer;
      const last_name_change_handler = function (e) {
        if (last_name_timer) {
          clearTimeout(last_name_timer);
        }

        last_name_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      const email = form.querySelector('.input > input[name="email"]');
      let email_timer;
      const email_change_handler = function (e) {
        if (email_timer) {
          clearTimeout(email_timer);
        }

        email_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid email address');
        }, 300);
      };
      const phoneNumber = form.querySelector('.input > input[name="phoneNumber"]');
      let phoneNumber_timer;
      const phoneNumber_change_handler = function (e) {
        if (phoneNumber_timer) {
          clearTimeout(phoneNumber_timer);
        }

        phoneNumber_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^\d{11}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid phone number');
        }, 300);
      };
      const password = form.querySelector('.input > input[name="password"]');
      let password_timer;
      const password_change_handler = function (e) {
        if (password_timer) {
          clearTimeout(password_timer);
        }

        password_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      const confirmPassword = form.querySelector('.input > input[name="confirmPassword"]');
      let confirmPassword_timer;
      const confirmPassword_change_handler = function (e) {
        if (confirmPassword_timer) {
          clearTimeout(confirmPassword_timer);
        }

        confirmPassword_timer = setTimeout(() => {
          const value = String(this.value);
          const passwordElement = form.querySelector('input[name="password"]');

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
        }, 300);
      };
      const address = form.querySelector('.input > textarea[name="address"]');
      let address_timer;
      const address_change_handler = function (e) {
        if (address_timer) {
          clearTimeout(address_timer);
        }

        address_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^[a-zA-Z,0-9]{1,}\s[\S\s]{2,}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid home address');
        }, 300);
      };
      let form_timer;
      const form_change_handler = function (e) {
        if (form_timer) {
          clearTimeout(form_timer);
        }

        form_timer = setTimeout(() => {
          handleSubmitButton();
        }, 500);
      };

      form.addEventListener('submit', (e) => {
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

      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.submit({
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          phoneNumber: phoneNumber.value,
          password: password.value,
          password_confirmation: confirmPassword.value,
          address: address.value
        });
      });

      this._hasBindedEvents = true;
    }
  }

  async submit(params) {
    const loader = new Loader('registering user');

    try{
      const { data, status } = await window.requestHandler.post('/auth/signup', params);

      loader.hideImage();
      loader.showText();
      loader.setMode(data.status);
      loader.setText(data.message || data.error);
      loader.setTitle('Server Response');

      if (status === 200) {
        const { data: responseData } = data;
        Object.keys(responseData).forEach((key) => {
          Utils.setStorageItem(key, responseData[key]);
        });

        loader.setText('user registered succesfully... redirecting....');
        setTimeout(() => {
          window.location.href = '/api/v1';
        }, 5000);
      }
    } catch (error) {
      Utils.processRequestError({
        loader,
        error
      });
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
      const events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'];
      const form = document.querySelector('#login > .container');
      const submitButton = form.querySelector('.submit > button');
      const setError = (input, error) => {
        let errorNode = input.parentNode.querySelector('.error');
        if (!errorNode) {
          errorNode = document.createElement('div');
          errorNode.classList.add('error');
          input.parentNode.insertBefore(errorNode, input);
        }

        input.parentNode.dataset.isValid = 'false';
        input.style.border = '0.2px solid rgb(255,0,0)';
        errorNode.textContent = error;
      };
      const removeError = (input) => {
        const errorNode = input.parentNode.querySelector('.error');
        if (errorNode) {
          input.parentNode.removeChild(errorNode);
        }
      };
      const makeValid = (input) => {
        input.parentNode.dataset.isValid = true;
        input.style.border = '0.2px solid rgb(90,90,90)';
      };
      const isFormValid = () => {
        const inputs = form.querySelectorAll('.input[data-is-valid="false"]');
        if (inputs.length === 0) {
          const noValidity = form.querySelectorAll('.input:not([data-is-valid]) > input,.input:not([data-is-valid]) > select, .input:not([data-is-valid]) > textarea');
          let isValid = true;
          if (noValidity.length > 0) {
            isValid = !Array.from(noValidity).find((noValid) => {
              return (noValid.value.length === 0);
            });
          }

          return isValid;
        }

        return false;
      };
      const handleSubmitButton = () => {
        if (isFormValid()) {
          if (submitButton.hasAttribute('disabled')) {
            submitButton.removeAttribute('disabled');
          }
        } else if (!submitButton.hasAttribute('disabled')) {
          submitButton.setAttribute('disabled', 'disabled');
        }
      };
      const login = form.querySelector('.input > input[name="login"]');
      let login_timer;
      const login_change_handler = function (e) {
        if (login_timer) {
          clearTimeout(login_timer);
        }

        login_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid login. please insert registered email address');
        }, 300);
      };

      const password = form.querySelector('.input > input[name="password"]');
      let password_timer;
      const password_change_handler = function (e) {
        if (password_timer) {
          clearTimeout(password_timer);
        }

        password_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      let form_timer;
      const form_change_handler = function (e) {
        if (form_timer) {
          clearTimeout(form_timer);
        }

        form_timer = setTimeout(() => {
          handleSubmitButton();
        }, 500);
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });

      events.forEach((event) => {
        login.addEventListener(event, login_change_handler);
        password.addEventListener(event, password_change_handler);
        form.addEventListener(event, form_change_handler);
      });

      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.submit({
          login: login.value,
          password: password.value
        });
      });

      this._hasBindedEvents = true;
    }
  }

  async submit({
    login,
    password
  }) {
    const loader = new Loader('logging user');

    try {
      const { data, status } = await window.requestHandler.post('/auth/signin', {
        login,
        password
      });

      loader.hideImage();
      loader.showText();
      loader.setMode(data.status);
      loader.setText(data.message || data.error);
      loader.setTitle('Server Response');

      if (status === 200) {
        const { data: responseData } = data;
        Object.keys(responseData).forEach((key) => {
          Utils.setStorageItem(key, responseData[key]);
        });

        loader.setText('user logged succesfully... redirecting....');
        setTimeout(() => {
          window.location.href = '/api/v1';
        }, 5000);
      }
    } catch (error) {
      Utils.processRequestError({
        loader,
        error
      });
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
      const events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'];
      const form = document.querySelector('#forgot-password > .container');
      const submitButton = form.querySelector('.submit > button');
      const setError = (input, error) => {
        let errorNode = input.parentNode.querySelector('.error');
        if (!errorNode) {
          errorNode = document.createElement('div');
          errorNode.classList.add('error');
          input.parentNode.insertBefore(errorNode, input);
        }

        input.parentNode.dataset.isValid = 'false';
        input.style.border = '0.2px solid rgb(255,0,0)';
        errorNode.textContent = error;
      };
      const removeError = (input) => {
        const errorNode = input.parentNode.querySelector('.error');
        if (errorNode) {
          input.parentNode.removeChild(errorNode);
        }
      };
      const makeValid = (input) => {
        input.parentNode.dataset.isValid = true;
        input.style.border = '0.2px solid rgb(90,90,90)';
      };
      const isFormValid = () => {
        const inputs = form.querySelectorAll('.input[data-is-valid="false"]');
        if (inputs.length === 0) {
          const noValidity = form.querySelectorAll('.input:not([data-is-valid]) > input,.input:not([data-is-valid]) > select, .input:not([data-is-valid]) > textarea');
          let isValid = true;
          if (noValidity.length > 0) {
            isValid = !Array.from(noValidity).find((noValid) => {
              return (noValid.value.length === 0);
            });
          }

          return isValid;
        }

        return false;
      };
      const handleSubmitButton = () => {
        if (isFormValid()) {
          if (submitButton.hasAttribute('disabled')) {
            submitButton.removeAttribute('disabled');
          }
        } else if (!submitButton.hasAttribute('disabled')) {
          submitButton.setAttribute('disabled', 'disabled');
        }
      };
      const email = form.querySelector('.input > input[name="email"]');
      let email_timer;
      const email_change_handler = function (e) {
        if (email_timer) {
          clearTimeout(email_timer);
        }

        email_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid email. please insert your registered email address');
        }, 300);
      };
      const hiddenInputs = form.querySelectorAll('.hidden-input');
      const canRememberPasswordInputs = form.querySelectorAll('.input > input[name="canRememberPassword"]');
      let canRememberPassword_timer;
      const canRememberPassword_change_handler = function (e) {
        if (canRememberPassword_timer) {
          clearTimeout(canRememberPassword_timer);
        }

        canRememberPassword_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.length > 0) {
            const remembers = (parseInt(value, 10) === 1);
            hiddenInputs.forEach((hiddenInput) => {
              if (remembers) {
                if (hiddenInput.classList.contains('hidden-input')) {
                  hiddenInput.classList.replace('hidden-input', 'input');
                }
              } else {
                if (hiddenInput.classList.contains('input')) {
                  hiddenInput.classList.replace('input', 'hidden-input');
                }
              }
            });

            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Plase check if you can remember your old password');
        }, 300);
      };
      let password_timer;
      const password_change_handler = function (e) {
        if (password_timer) {
          clearTimeout(password_timer);
        }

        password_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      let confirmPassword_timer;
      const confirmPassword_change_handler = function (e) {
        if (confirmPassword_timer) {
          clearTimeout(confirmPassword_timer);
        }

        confirmPassword_timer = setTimeout(() => {
          const value = String(this.value);
          const passwordElement = form.querySelector('input[name="newPassword"]');

          if (!(passwordElement && (passwordElement.parentNode.dataset.isValid == 'true'))) {
            setError(this, 'Please insert your new password first');
            return;
          }

          if (passwordElement.value !== value) {
            setError(this, 'Passwords do not match... please try again');
            return;
          }

          removeError(this);
          makeValid(this);
        }, 300);
      };
      let form_timer;
      const form_change_handler = function (e) {
        if (form_timer) {
          clearTimeout(form_timer);
        }

        form_timer = setTimeout(() => {
          handleSubmitButton();
        }, 500);
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
      canRememberPasswordInputs.forEach((canRememberPasswordInput) => {
        canRememberPasswordInput.addEventListener('change', canRememberPassword_change_handler);
      });
      events.forEach((event) => {
        email.addEventListener(event, email_change_handler);
        hiddenInputs.forEach((hiddenInput) => {
          const input = hiddenInput.querySelector('input');
          if (!!hiddenInput.querySelector('input[name="newPasswordConfirmation"]')) {
            input.addEventListener(event, confirmPassword_change_handler);
          } else {
            input.addEventListener(event, password_change_handler);
          }
        });
        form.addEventListener(event, form_change_handler);
      });

      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const canRemember = form.querySelector('.input > input[name="canRememberPassword"]:checked');
        const canRememberValue = parseInt(canRemember.value, 10);
        const data = {
          email: email.value,
          canRemember: canRememberValue
        };

        if (canRememberValue) {
          hiddenInputs.forEach((hiddenInput) => {
            let input
            if (hiddenInput.classList.contains('inline')) {
              input = hiddenInput.querySelector('input:checked');
            }

            input = hiddenInput.querySelector('input');
            data[input.getAttribute('name')] = input.value;
          });
        }

        this.submit(data);
      });
      this._hasBindedEvents = true;
    }
  }

  async submit({ email, canRemember, password = null, newPassword = null, newPasswordConfirmation = null }) {
    const loader = new Loader('resseting user password');

    try {
      const { data, status } = await window.requestHandler.post(`/auth/${email}/reset_password`, {
        can_remember: !!canRemember,
        password,
        new_password: newPassword,
        password_confirmation: newPasswordConfirmation
      });

      loader.hideImage();
      loader.showText();
      loader.setMode(data.status);
      loader.setText(data.message || data.error);
      loader.setTitle('Server Response');

      if (status === 200) {
        loader.setText(`password reset was succesful... redirecting....`);
        setTimeout(() => {
          window.location.href = '/api/v1';
        }, 10000);
      }
    } catch (error) {
      Utils.processRequestError({
        loader,
        error
      });
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
      const events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'];
      const form = document.querySelector('#verify-token > .container');
      const submitButton = form.querySelector('.submit > button');
      const setError = (input, error) => {
        let errorNode = input.parentNode.querySelector('.error');
        if (!errorNode) {
          errorNode = document.createElement('div');
          errorNode.classList.add('error');
          input.parentNode.insertBefore(errorNode, input);
        }

        input.parentNode.dataset.isValid = 'false';
        input.style.border = '0.2px solid rgb(255,0,0)';
        errorNode.textContent = error;
      };
      const removeError = (input) => {
        const errorNode = input.parentNode.querySelector('.error');
        if (errorNode) {
          input.parentNode.removeChild(errorNode);
        }
      };
      const makeValid = (input) => {
        input.parentNode.dataset.isValid = true;
        input.style.border = '0.2px solid rgb(90,90,90)';
      };
      const isFormValid = () => {
        const inputs = form.querySelectorAll('.input[data-is-valid="false"]');
        if (inputs.length === 0) {
          const noValidity = form.querySelectorAll('.input:not([data-is-valid]) > input,.input:not([data-is-valid]) > select, .input:not([data-is-valid]) > textarea');
          let isValid = true;
          if (noValidity.length > 0) {
            isValid = !Array.from(noValidity).find((noValid) => {
              return (noValid.value.length === 0);
            });
          }

          return isValid;
        }

        return false;
      };
      const handleSubmitButton = () => {
        if (isFormValid()) {
          if (submitButton.hasAttribute('disabled')) {
            submitButton.removeAttribute('disabled');
          }
        } else if (!submitButton.hasAttribute('disabled')) {
          submitButton.setAttribute('disabled', 'disabled');
        }
      };
      const token = form.querySelector('.input > input[name="token"]');
      let token_timer;
      const token_change_handler = function (e) {
        if (token_timer) {
          clearTimeout(token_timer);
        }

        token_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.length) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'PLease insert the token that was sent to your email');
        }, 300);
      };
      let form_timer;
      const form_change_handler = function (e) {
        if (form_timer) {
          clearTimeout(form_timer);
        }

        form_timer = setTimeout(() => {
          handleSubmitButton();
        }, 500);
      };

      form.addEventListener('submit', (e) => {
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
      const events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'];
      const form = document.querySelector('#update-password > .container');
      const submitButton = form.querySelector('.submit > button');
      const setError = (input, error) => {
        let errorNode = input.parentNode.querySelector('.error');
        if (!errorNode) {
          errorNode = document.createElement('div');
          errorNode.classList.add('error');
          input.parentNode.insertBefore(errorNode, input);
        }

        input.parentNode.dataset.isValid = 'false';
        input.style.border = '0.2px solid rgb(255,0,0)';
        errorNode.textContent = error;
      };
      const removeError = (input) => {
        const errorNode = input.parentNode.querySelector('.error');
        if (errorNode) {
          input.parentNode.removeChild(errorNode);
        }
      };
      const makeValid = (input) => {
        input.parentNode.dataset.isValid = true;
        input.style.border = '0.2px solid rgb(90,90,90)';
      };
      const isFormValid = () => {
        const inputs = form.querySelectorAll('.input[data-is-valid="false"]');
        if (inputs.length === 0) {
          const noValidity = form.querySelectorAll('.input:not([data-is-valid]) > input,.input:not([data-is-valid]) > select, .input:not([data-is-valid]) > textarea');
          let isValid = true;
          if (noValidity.length > 0) {
            isValid = !Array.from(noValidity).find((noValid) => {
              return (noValid.value.length === 0);
            });
          }

          return isValid;
        }

        return false;
      };
      const handleSubmitButton = () => {
        if (isFormValid()) {
          if (submitButton.hasAttribute('disabled')) {
            submitButton.removeAttribute('disabled');
          }
        } else if (!submitButton.hasAttribute('disabled')) {
          submitButton.setAttribute('disabled', 'disabled');
        }
      };
      const password = form.querySelector('.input > input[name="password"]');
      let password_timer;
      const password_change_handler = function (e) {
        if (password_timer) {
          clearTimeout(password_timer);
        }

        password_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      const confirmPassword = form.querySelector('.input > input[name="confirmPassword"]');
      let confirmPassword_timer;
      const confirmPassword_change_handler = function (e) {
        if (confirmPassword_timer) {
          clearTimeout(confirmPassword_timer);
        }

        confirmPassword_timer = setTimeout(() => {
          const value = String(this.value);
          const passwordElement = form.querySelector('input[name="password"]');

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
        }, 300);
      };
      let form_timer;
      const form_change_handler = function (e) {
        if (form_timer) {
          clearTimeout(form_timer);
        }

        form_timer = setTimeout(() => {
          handleSubmitButton();
        }, 500);
      };

      form.addEventListener('submit', (e) => {
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

  bindEvents(container) {
    const filter = document.querySelector('#filter');
    const searchButton = filter.querySelector('.container > .search > .submit > button');

    searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      const activeTypeCon = filter.querySelector('.container > .sections > .types > button.active');
      const activeType = activeTypeCon.dataset.name;

      new Loader('Searching properties');
      window.location.href = `/api/v1/properties?type=${activeType}`
    });

    const searchTypes = filter.querySelectorAll('.container > .sections > .types > button');
    searchTypes.forEach((searchType) => {
      searchType.addEventListener('click', function (e) {
        e.preventDefault();
        const active = filter.querySelector('.container > .sections > .types > button.active');
        active.classList.remove('active');

        this.classList.add('active');
      });
    });

    const properties = container.querySelectorAll('.property:not(data-has-binded-events)');
    properties.forEach((property) => {
      const id = property.dataset.id;
      const details = property.querySelector('.details');
      const actionCon = details.querySelector('.others > .options > .container');
      const report = actionCon.querySelector('.report');
      const reportReasonInput = report.querySelector('.container > select[name="reason"]');
      const reportDescriptionInput = report.querySelector('.container > textarea[name="description"]');
      const reportSubmitButton = report.querySelector('.container > button.submit');
      const editButton = actionCon.querySelector('button.edit');
      const deleteButton = actionCon.querySelector('button.delete');
      const viewButton = actionCon.querySelector('button.view');
      const screenImage = property.querySelector('.display > .screen > img');
      const folder = property.querySelector('.preview');

      folder.addEventListener('click', (e) => {
        if (e.target.nodeName.toLowerCase() === 'img') {
          screenImage.setAttribute('src', e.target.getAttribute('src'));
        }
      });

      const validArray = [0, 0];
      const checkValidity = () => {
        if (!validArray.includes(0)) {
          reportSubmitButton.removeAttribute('disabled');
        } else {
          reportSubmitButton.setAttribute('disabled', 'disabled');
        }
      };

      let reportReasonInputTimer;
      const reportReasonInputChangeHandler = (e) => {
        e.preventDefault();

        if (reportReasonInputTimer) {
          clearTimeout(reportReasonInputTimer);
        }

        reportReasonInputTimer = setTimeout(() => {
          validArray[0] = (reportReasonInput.value ? 1 : 0);
          checkValidity();
        }, 300);
      };

      let reportDescriptionInputTimer;
      const reportDescriptionInputChangeHandler = (e) => {

        if (reportDescriptionInputTimer) {
          clearTimeout(reportDescriptionInputTimer);
        }

        reportDescriptionInputTimer = setTimeout(() => {
          validArray[1] = (reportDescriptionInput.value ? 1 : 0);
          checkValidity();
        }, 300);
      };

      const events = ['change', 'keyup', 'keydown', 'keypress', 'hover', 'blur'];
      reportReasonInput.addEventListener('change', reportReasonInputChangeHandler);
      events.forEach((event) => {
        reportDescriptionInput.addEventListener(event, reportDescriptionInputChangeHandler);
      });

      reportSubmitButton.addEventListener('click', async (e) => {
        const loader = new Loader('Saving report data');

        try {
          const { status, data: responseData } = await window.requestHandler.post(`/property/${id}/flag`, {
            reason: reportReasonInput.value,
            description: reportDescriptionInput.value,
          });

          loader.setMode(responseData.status);
          loader.hideImage();
          loader.showText();
          loader.setText(responseData.message || responseData.error);
          loader.setTitle('server response');
          loader.add();

          if (status === 200) {
            loader.setMode('success');
            loader.setText('Report / flag submitted succesfully');
          }
        } catch (error) {
          console.log(error);
          Utils.processRequestError({
            loader,
            error
          });
        }
      });

      editButton.addEventListener('click', (e) => {
        e.preventDefault();
        new Loader('Opening property edit page');
        window.location.href = `/api/v1/property/${id}/edit`;
      });

      viewButton.addEventListener('click', (e) => {
        e.preventDefault();
        new Loader('Opening property page');
        window.location.href = `/api/v1/property/${id}`;
      });

      deleteButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const loader = new Loader('Deleting property advert');

        try {
          const { status, data: responseData } = await window.requestHandler.delete(`/property/${id}`);

          loader.setMode(responseData.status);
          loader.hideImage();
          loader.showText();
          loader.setText(responseData.message || responseData.error);
          loader.setTitle('server response');
          loader.add();

          if (status === 204) {
            loader.setMode('success');
            loader.setText('Property advert removed succesfully. Redirecting to properties page');

            setTimeout(() => {
              window.location.href = '/api/v1/properties';
            }, 5000);
          }
        } catch (error) {
          console.log(error);
          Utils.processRequestError({
            loader,
            error
          });
        }
      });
    });
  }

  loadProperties(properties, exempt = [], container = document.querySelector('#properties > .container')) {
    if (!Array.isArray(properties)) {
      return;
    }

    container.innerHTML = '';
    properties.forEach((property) => {
      const propertyCon = document.createElement('div');
      propertyCon.classList.add('property');

      const propertyData = new Property(property);
      if (exempt.includes(propertyData.get('id'))) {
        return;
      }

      if (this.map) {
        const { latitude: lat = null, longitude: lng = null } = propertyData.get('location')
        new google.maps.Marker({
          map: this.map,
          title: propertyData.get('title'),
          position: {
            lat,
            lng
          },
        });
      }

      let previewContent = '';
      propertyData.get('images').forEach(({ secure_url }) => {
        previewContent = `${previewContent}<img src="${secure_url}" alt="">`
      });

      let soldString = ((propertyData.get('status') === 'available') ? '' : '<div class="sold">Sold</div>');

      propertyCon.dataset.id = propertyData.get('id');

      propertyCon.innerHTML = `
      <div class="display">
        <div class="screen">
          <img src="${propertyData.get('images')[0].secure_url}" alt="">
        </div>
        <div class="tags">
          ${soldString}
          <div class="${propertyData.get('option') === 'sale' ? 'sale' : 'rent'}">For ${propertyData.get('option'), propertyData.get('option').replace('-', ' ')}</div>
        </div>
        <div class="amount">
          ${propertyData.get('price')}
        </div>
      </div>
      <div class="preview">
        ${previewContent}
      </div>
      <div class="details">
        <div class="description">
          ${propertyData.get('description')}
        </div>
        <div class="others">
          <div class="facilities">
            <div class="bed">${propertyData.get('type')}</div>
          </div>
          <div class="options">
            more
            <div class="container">
              <div class="title">
                close
                <btton class="close">&times</button>
              </div>
              <div class="report">
                Report
                <div class="container">
                  <div class="title">
                    close
                    <button class="close">&times;</button>
                  </div>
                    <div class="brief">
                        As an end user, you have the ability to report a property advert or flag it as the need may arise.
                    </div>
                    <select name="reason">
                      <option value="" disabled selected>Select a reason</option>
                      <option value="weird demands">Weird demands</option>
                      <option value="spam">Spammers</option>
                      <option value="duplicate property">duplicate property</option>
                      <option value="illegal property">illegal property</option>
                    </select>
                    <textarea name="description" rows="5" placeholder="Insert a brief description"></textarea>
                    <button class="submit">Submit</button>
                  </div>
                </div>
              <button class="view">View</button>
              ${
                (propertyData.canBeEditedByUser() ? '<button class="edit">Edit</button>' : '')
              }
              ${
                (propertyData.canBeEditedByUser() ? '<button class="delete">Delete</button>' : '')
              }
            </div>
          </div>
        </div>
      </div>
    `;

      container.appendChild(propertyCon);
    });

    if (container.innerHTML === '') {
      container.innerHTML = 'Oooops there is no property to display';
    }

    this.bindEvents(container);
  }

  loadMap() {
    const map = new google.maps.Map(document.getElementById('mapContainer'), {
      center: { lat: 8.8556838, lng: 7.179025999999999 },
      zoom: 6,
    });

    this.map = map;

    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
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
  }

  async init() {
    this.loadMap();
    const loader = new Loader('Getting properties');

    try {
      const { status, data: responseData } = await window.requestHandler.get(`/properties`,);
      loader.setMode(responseData.status);
      loader.hideImage();
      loader.showText();
      loader.setText(responseData.message || responseData.error);
      loader.setTitle('server response');
      loader.add();

      if (status === 200) {
        const { data: propertiesData } = responseData;
        this.loadProperties(propertiesData);
        loader.remove();
      }
    } catch (error) {
      console.log(error);
      Utils.processRequestError({
        loader,
        error
      });
    }
  }
}

class PropertyPage {
  constructor() {

  }

  bindEvents(id = 0) {

    if (!this.hasBindedEvents) {
      const main = document.querySelector('#viewProperty');
      const actions = main.querySelector('div.actions');
      const report = actions.querySelector('.report');
      const closeReportButton = report.querySelector('.container > .title > button.close');
      const reportReasonInput = report.querySelector('.container > select[name="reason"]');
      const reportDescriptionInput = report.querySelector('.container > textarea[name="description"]');
      const reportSubmitButton = report.querySelector('.container > button.submit');
      const editButton = actions.querySelector('button.edit');
      const deleteButton = actions.querySelector('button.delete');
      const screenImage = main.querySelector('.images > .screen > img');
      const folder = main.querySelector('.images > .folder');

      folder.addEventListener('click', (e) => {
        if (e.target.nodeName.toLowerCase() === 'img') {
          screenImage.setAttribute('src', e.target.getAttribute('src'));
        }
      });

      closeReportButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.dispatchEvent(new Event('hover'));
      });

      const validArray = [0,0];
      const checkValidity = () => {
        if (!validArray.includes(0)) {
          reportSubmitButton.removeAttribute('disabled');
        } else {
          reportSubmitButton.setAttribute('disabled', 'disabled');
        }
      };

      let reportReasonInputTimer;
      const reportReasonInputChangeHandler = (e) => {
        e.preventDefault();

        if (reportReasonInputTimer) {
          clearTimeout(reportReasonInputTimer);
        }

        reportReasonInputTimer = setTimeout(() => {
          validArray[0] = (reportReasonInput.value ? 1 : 0);
          checkValidity();
        }, 300);
      };

      let reportDescriptionInputTimer;
      const reportDescriptionInputChangeHandler = (e) => {

        if (reportDescriptionInputTimer) {
          clearTimeout(reportDescriptionInputTimer);
        }

        reportDescriptionInputTimer = setTimeout(() => {
          validArray[1] = (reportDescriptionInput.value ? 1 : 0);
          checkValidity();
        }, 300);
      };

      const events = ['change', 'keyup', 'keydown', 'keypress', 'hover', 'blur'];
      reportReasonInput.addEventListener('change', reportReasonInputChangeHandler);
      events.forEach((event) => {
        reportDescriptionInput.addEventListener(event, reportDescriptionInputChangeHandler);
      });

      reportSubmitButton.addEventListener('click', async (e) => {
        const loader = new Loader('Saving report data');

        try {
          const { status, data: responseData } = await window.requestHandler.post(`/property/${id}/flag`, {
            reason: reportReasonInput.value,
            description: reportDescriptionInput.value,
          });

          loader.setMode(responseData.status);
          loader.hideImage();
          loader.showText();
          loader.setText(responseData.message || responseData.error);
          loader.setTitle('server response');
          loader.add();

          if (status === 200) {
            loader.setMode('success');
            loader.setText('Report / flag submitted succesfully');
          }
        } catch (error) {
          console.log(error);
          Utils.processRequestError({
            loader,
            error
          });
        }
      });

      editButton.addEventListener('click', (e) => {
        e.preventDefault();
        new Loader('Opening property edit page');
        window.location.href = `/property/edit/${id}`;
      });

      deleteButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const loader = new Loader('Deleting property advert');

        try {
          const { status, data: responseData } = await window.requestHandler.delete(`/property/${id}`);

          loader.setMode(responseData.status);
          loader.hideImage();
          loader.showText();
          loader.setText(responseData.message || responseData.error);
          loader.setTitle('server response');
          loader.add();

          if (status === 204) {
            loader.setMode('success');
            loader.setText('Property advert removed succesfully. Redirecting to properties page');

            setTimeout(() => {
              window.location.href = '/api/v1/properties';
            },5000);
          }
        } catch (error) {
          console.log(error);
          Utils.processRequestError({
            loader,
            error
          });
        }
      });

      this.hasBindedEvents = true;
    }
  }

  loadMap(propertyData) {
    const location = propertyData.get('location');
    const { latitude = null, longitude = null } = location || {};
    if (!(latitude && longitude)) {
      return;
    }

    const map = new google.maps.Map(document.getElementById('mapContainer'), {
      center: { lat: latitude, lng: longitude },
      zoom: 10,
    });

    new google.maps.Marker({
      map,
      title: propertyData.get('title'),
      position: {
        lat: latitude,
        lng: longitude
      },
    });
  }

  async loadProperty(id) {
    const propertyContainer = document.querySelector('#viewProperty');
    const similarPropsContainer = document.querySelector('#properties > .container');
    const loader = new Loader('Generating property data');

    try {

      const { status, data: responseData } = await window.requestHandler.get(`/property/${id}`);
      loader.setMode(responseData.status);
      loader.hideImage();
      loader.showText();
      loader.setText(responseData.error);
      loader.setTitle('server response');
      loader.add();

      if (status === 200) {
        if (!propertyContainer) {
          loader.setMode('error');
          loader.setText('Ooops property container not available');
          loader.setTitle('Client response');
        }

        let { data: propertyData } = responseData;
        propertyData = new Property(propertyData);

        let folderConent = '';
        propertyData.get('images').forEach(({ secure_url }) => {
          folderConent = `${folderConent}<img src="${secure_url}">`;
        });

        propertyContainer.innerHTML = `
          <div class="title">
            ${propertyData.get('title')}
          </div>
          <div class="images">
            <div class="screen">
              <img src="${propertyData.get('images')[0].secure_url}" />
              <div class="properties">
                <span class="price">
                  ${propertyData.get('price')}
                  <span class="type">
                    ( ${propertyData.get('type')} )
                  </span>
                </span>
                <span class="address">
                  ${propertyData.get('address')}
                </span>
                <div class="actions">
                  <div class="report">
                    Report
                    <div class="container">
                      <div class="title">
                        close
                        <button class="close">&times;</button>
                      </div>
                      <div class="brief">
                        As an end user, you have the ability to report a property advert or flag it as the need may arise.
                      </div>
                      <select name="reason">
                        <option value="" disabled selected>Select a reason</option>
                        <option value="weird demands">Weird demands</option>
                        <option value="spam">Spammers</option>
                        <option value="duplicate property">duplicate property</option>
                        <option value="illegal property">illegal property</option>
                      </select>
                      <textarea name="description" rows="5" placeholder="Insert a brief description"></textarea>
                      <button class="submit" disabled>Submit</button>
                    </div>
                  </div>
                  <button class="edit">Edit</button>
                  <button class="delete">Delete</button>
                </div>
              </div>
            </div>
            <div class="folder">
              ${folderConent}
            </div>
          </div>
          <div class="decsription">
            ${propertyData.get('description')}
          </div>
          <article class="agent-contact">
            <address>${propertyData.get('ownerAddress')}</address>
            <div class="phone">${propertyData.get('ownerPhoneNumber')}</div>
            <div class="email">${propertyData.get('ownerEmail')}</div>
          </article>
        `;
        this.bindEvents(this.propertyId);
        this.loadMap(propertyData);

        loader.reset('Getting similar properties');
        const { status, data: respData } = await window.requestHandler.get(`/properties`);
        loader.setMode(respData.status);
        loader.hideImage();
        loader.showText();
        loader.setText(respData.error);
        loader.setTitle('server response');
        loader.add();

        if (status === 200) {
          const { data: similarProperties } = respData;

          if (!similarPropsContainer) {
            loader.setMode('error');
            loader.setText('Ooops similar properties container not available');
            loader.setTitle('Client response');
          }

          this.propertiesPage.loadProperties(similarProperties, [propertyData.get('id')], similarPropsContainer);
          loader.remove();
        }
      }
    } catch (error) {
      console.log(error);
      Utils.processRequestError({
        loader,
        error
      });
    }
  }

  get propertiesPage() {
    if (typeof this._propertiesPage !== 'object') {
      this._propertiesPage = new PropertiesPage();
    }
    return this._propertiesPage;
  }

  init() {
    const id = document.location.pathname.replace(/^[\S\s]{1,}\/property\/(\d{1,})\/{0,1}$/, '$1');
    this.propertyId = id;
    this.loadProperty(parseInt(id, 10));
  }
}

class PostPropertyPage {
  constructor() {
    this._hasBindedEvents = 0;
  }

  get hasBindedEvents() {
    return this._hasBindedEvents;
  }

  loadMap({ latitude, longitude, latitudeContainer, longitudeContainer }) {
    const loader = new Loader('loading map data');
    const map = new google.maps.Map(document.getElementById('mapContainer'), {
      center: { lat: latitude, lng: longitude },
      zoom: 6,
    });
    const markers = [];

    google.maps.event.addListener(map, 'click', (e) => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      markers.push(new google.maps.Marker({
        map,
        title: 'Property Location',
        position: e.latLng
      }));

      latitudeContainer.value = e.latLng.lat();
      longitudeContainer.value = e.latLng.lng();
    });

    const formInputChangeHandler = (e) => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      const locData = {
        lat: parseFloat(latitudeContainer.value),
        lng: parseFloat(longitudeContainer.value)
      };

      map.setCenter(locData);
      markers.push(new google.maps.Marker({
        map,
        title: 'Property Location',
        position:locData
      }));
    };

    latitudeContainer.addEventListener('change', formInputChangeHandler);
    longitudeContainer.addEventListener('change', formInputChangeHandler);
    loader.remove();
  }


  bindEvents() {
    if (!this.hasBindedEvents) {
      const events = ['change', 'blur', 'keypress', 'keydown', 'keyup', 'focus'];
      const setError = (input, error) => {
        let errorNode = input.parentNode.querySelector('.error');
        if (!errorNode) {
          errorNode = document.createElement('div');
          errorNode.classList.add('error');
          input.parentNode.insertBefore(errorNode, input);
        }

        input.parentNode.dataset.isValid = 'false';
        input.style.border = '0.2px solid rgb(255,0,0)';
        errorNode.textContent = error;
      };
      const removeError = (input) => {
        const errorNode = input.parentNode.querySelector('.error');
        if (errorNode) {
          input.parentNode.removeChild(errorNode);
        }
      };
      const makeValid = (input) => {
        input.parentNode.dataset.isValid = true;
        input.style.border = '0.2px solid rgb(90,90,90)';
      };
      const form = document.querySelector('main > .parent.form > form.container');
      const submitButton = form.querySelector('.submit > button');
      const imageInputContainer = form.querySelector('.input.image');
      const imagesHolder = imageInputContainer.querySelector('.holder');
      const imageSelectButton = imageInputContainer.querySelector('.item > button');
      let totalAdded = 0;
      imageSelectButton.addEventListener('click', function (e) {
        if (totalAdded < 10) {
          const loader = new Loader('Loading cloudinary widget');

          e.preventDefault();
          let widget = cloudinary.createUploadWidget({
            cloudName: 'kingsloob1',
            uploadPreset: 'ml_default',
            multiple: false,
            maxFiles: 10,
            cropping: false,
            folder: 'properties',
            resourceType: 'image',
            apiKey: '566393211893115',
            maxFileSize: 5000000,
            maxChunk: 5000000,
            uploadSignature: async (callback, data) => {
              loader.reset('Generating secured upload signature');

              try {
                const { status, data: responseData } = await window.requestHandler.post('/property/generate_cloudinary_hash', data);
                loader.setMode(responseData.status);
                loader.hideImage();
                loader.showText();
                loader.setText(responseData.error);
                loader.setTitle('server response');
                loader.add();

                if (status === 200) {
                  loader.remove();
                  callback(responseData.signature);
                } else {
                  widget.close({
                    quiet: true,
                  });
                }
              } catch (error) {
                Utils.processRequestError({
                  loader,
                  error
                });
                widget.close({
                  quiet: true,
                });
              }
            }
          }, (error, result) => {
            const { event, info } = result;
            if (event === 'display-changed' && info === 'shown') {
              loader.remove();
            }

            if (event === 'success') {
              totalAdded += 1;
              form.dispatchEvent(new Event('change'));
              if (totalAdded >= 10) {
                imageSelectButton.setAttribute('disabled', 'disabled');
              }

              widget.close({
                quiet: true,
              });
              const { secure_url, public_id } = info;
              const imageContainer = document.createElement('div');
              const image = document.createElement('img');
              const removeButton = document.createElement('button');
              imageContainer.dataset.publicId = public_id;
              imageContainer.dataset.secureUrl = secure_url;

              removeButton.classList.add('remove');
              imageContainer.classList.add('image');
              removeButton.innerHTML = '&times;';

              removeButton.addEventListener('click', async (e) => {
                e.preventDefault();
                loader.reset('Deleting image');

                try {
                  const { status, data } = await window.requestHandler.delete('/property/file', {
                    params: {
                      public_id: imageContainer.dataset.publicId,
                    },
                    timeout: 10000
                  });

                  loader.hideImage();
                  loader.showText();
                  loader.setMode(data.status);
                  loader.setText(data.message || data.error);
                  loader.setTitle('Server Response');
                  if (status === 200) {
                    loader.remove();
                    totalAdded -= 1;
                    removeButton.parentNode.parentNode.removeChild(removeButton.parentNode);

                    if (totalAdded < 10) {
                      if (imageSelectButton.hasAttribute('disabled')) {
                        imageSelectButton.removeAttribute('disabled');
                      }
                    }

                    form.dispatchEvent(new Event('change'));
                  }
                } catch (error) {
                  Utils.processRequestError({
                    loader,
                    error,
                  });
                }
              });

              imageContainer.appendChild(removeButton);
              imageContainer.appendChild(image);

              imagesHolder.appendChild(imageContainer);
              image.setAttribute('src', imageContainer.dataset.secureUrl);
            }
          });

          widget.open();
        } else {
          imageSelectButton.setAttribute('disabled', 'disabled');
        }
      });
      const isFormValid = () => {
        const imagesLength = totalAdded;
        let errorCon = form.querySelector('.input.image > .error');
        const itemCon = form.querySelector('.input.image > .item');

        if (!imagesLength) {
          if (!errorCon) {
            errorCon = document.createElement('div');
            errorCon.classList.add('error');
            itemCon.parentNode.insertBefore(errorCon, itemCon);
          }

          errorCon.textContent = 'At least, an image is required';
          return false;
        }

        if (errorCon) {
          errorCon.parentNode.removeChild(errorCon);
        }

        const inputs = form.querySelectorAll('.input[data-is-valid="false"]');
        if (inputs.length === 0) {
          const noValidity = form.querySelectorAll('.input:not([data-is-valid]):not(.optional) > input,.input:not([data-is-valid]) > select, .input:not([data-is-valid]) > textarea');
          let isValid = true;
          if (noValidity.length > 0) {
            isValid = !Array.from(noValidity).find((noValid) => {
              return (noValid.value.length === 0);
            });
          }

          return isValid;
        }

        return false;
      };
      const handleSubmitButton = () => {
        if (isFormValid()) {
          if (submitButton.hasAttribute('disabled')) {
            submitButton.removeAttribute('disabled');
          }
        } else if (!submitButton.hasAttribute('disabled')) {
          submitButton.setAttribute('disabled', 'disabled');
        }
      };
      const title = form.querySelector('.input > input[name="title"]');
      let title_timer;
      const title_change_handler = function (e) {
        if (title_timer) {
          clearTimeout(title_timer);
        }

        title_timer = setTimeout(() => {
          const value = String(this.value);
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
        }, 300);
      };
      const price = form.querySelector('.input > input[name="price"]');
      let price_timer;
      const price_change_handler = function (e) {
        if (price_timer) {
          clearTimeout(price_timer);
        }

        price_timer = setTimeout(() => {
          const hasLength = (String(this.value).length > 0);
          const value = parseFloat(this.value);
          if (!hasLength) {
            setError(this, 'Price of property is required');
            return;
          }

          if (!(value >= 0)) {
            setError(this, 'Price should either be equal to zero (0) or above zero (0)');
            return;
          }

          removeError(this);
          makeValid(this);
          return;
        }, 300);
      };
      const address = form.querySelector('.input > textarea[name="address"]');
      let address_timer;
      const address_change_handler = function (e) {
        if (address_timer) {
          clearTimeout(address_timer);
        }

        address_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^[a-zA-Z,0-9]{1,}\s[\S\s]{2,}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid property address');
        }, 300);
      };
      const description = form.querySelector('.input > textarea[name="description"]');
      let description_timer;
      const description_change_handler = function (e) {
        if (description_timer) {
          clearTimeout(description_timer);
        }

        description_timer = setTimeout(() => {
          const value = String(this.value);
          if (value.match(/^[a-zA-Z,0-9]{1,}\s[\S\s]{2,}$/)) {
            removeError(this);
            makeValid(this);
            return;
          }

          setError(this, 'Invalid property description');
        }, 300);
      };
      let form_timer;
      const form_change_handler = function (e) {
        if (form_timer) {
          clearTimeout(form_timer);
        }

        form_timer = setTimeout(() => {
          handleSubmitButton();
        }, 500);
      };

      const latitude = form.querySelector('.input > input[name="latitude"]');
      let latitude_timer;
      const latitude_change_handler = function (e) {
        if (latitude_timer) {
          clearTimeout(latitude_timer);
        }

        latitude_timer = setTimeout(() => {
          const hasLength = (String(this.value).length > 0);
          if (hasLength) {
            const value = parseFloat(this.value);
            if (!((value >= -90) && (value <= 90))) {
              setError(this, 'Ooops property latitude should be a number between -90 and 90');
              return;
            }
          }

          removeError(this);
          makeValid(this);
          return;
        }, 300);
      };
      const longitude = form.querySelector('.input > input[name="longitude"]');
      let longitude_timer;
      const longitude_change_handler = function (e) {
        if (longitude_timer) {
          clearTimeout(longitude_timer);
        }

        longitude_timer = setTimeout(() => {
          const hasLength = (String(this.value).length > 0);

          if (hasLength) {
            const value = parseFloat(this.value);
            if (!((value >= -180) && (value <= 180))) {
              setError(this, 'Ooops property longitude should be a number between -180 and 180');
              return;
            }
          }

          removeError(this);
          makeValid(this);
          return;
        }, 300);
      };
      const type = form.querySelector('.input > select[name="type"]');
      const transfer_type = form.querySelector('.input > select[name="transfer_type"]');
      const state = form.querySelector('.input > select[name="state"]');
      const city = form.querySelector('.input > select[name="city"]');

      const selects = [
        type,
        transfer_type,
        state,
        city,
      ];

      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });

      (async () => {
        const loader = new Loader('fetching property states coverage');

        try {
          const { status, data } = await window.requestHandler.get('/states');

          loader.hideImage();
          loader.showText();
          loader.setMode(data.status);
          loader.setText(data.message || data.error);
          loader.setTitle('Server Response');

          if (status === 200) {
            const { data: responseData } = data;

            if (!Array.isArray(responseData)) {
              loader.setMode('error');
              loader.setText('Invalid response from the server');
              return;
            }

            const options = state.querySelectorAll('option:not(:disabled)');
            options.forEach((option) => {
              option.parentNode.removeChild(option);
            });

            const mainLocation = {};
            responseData.forEach(({name,latitude: lat,longitude: lng,capital}) => {
              const option = document.createElement('option');
              option.value = name
              option.textContent = name;

              option.dataset.latitude = lat;
              option.dataset.longitude = lng;

              if (capital === 'abuja') {
                mainLocation.longitude = lng;
                mainLocation.latitude = lat;
              }

              state.appendChild(option);
            });
            loader.remove();

            this.loadMap({
              ...mainLocation,
              latitudeContainer: latitude,
              longitudeContainer: longitude,
            });
          }
        } catch (error) {
          Utils.processRequestError({
            loader,
            error,
          });
        }
      })();

      state.addEventListener('change', async () => {
        const loader = new Loader('fetching selected state cities');

        try {
          const { status, data } = await window.requestHandler.get(`/states/${state.value.toLowerCase()}/cities`);

          loader.hideImage();
          loader.showText();
          loader.setMode(data.status);
          loader.setText(data.message || data.error);
          loader.setTitle('Server Response');

          if (status === 200) {
            const { data: responseData } = data;

            if (!Array.isArray(responseData)) {
              loader.setMode('error');
              loader.setText('Invalid response from the server');
              return;
            }

            const options = city.querySelectorAll('option:not(:disabled)');
            options.forEach((option) => {
              option.parentNode.removeChild(option);
            });

            responseData.forEach(({ name }) => {
              const option = document.createElement('option');
              option.value = name
              option.textContent = name;

              city.appendChild(option);
            });

            loader.remove();
          }
        } catch (error) {
          Utils.processRequestError({
            loader,
            error,
          });
        }
      });

      selects.forEach((select) => {
        let select_timer;
        const select_change_handler = function (e) {
          if (select_timer) {
            clearTimeout(select_timer);
          }

          select_timer = setTimeout(() => {
            const value = String(this.value);
            if (value.length) {
              removeError(this);
              makeValid(this);
              return;
            }

            setError(this, 'Please select a value');
          }, 300);
        };

        events.forEach((event) => {
          select.addEventListener(event, select_change_handler);
        });
      });

      events.forEach((event) => {
        title.addEventListener(event, title_change_handler);
        description.addEventListener(event, description_change_handler);
        address.addEventListener(event, address_change_handler);
        latitude.addEventListener(event, latitude_change_handler);
        longitude.addEventListener(event, longitude_change_handler);
        price.addEventListener(event, price_change_handler);
        form.addEventListener(event, form_change_handler);
      });

      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const data = {
          title: title.value,
          type: type.value,
          option: transfer_type.value,
          state: state.value,
          city: city.value,
          address: address.value,
          description: description.value,
          price: parseFloat(price.value),
        }

        const images = [];
        imagesHolder.childNodes.forEach((childNode) => {
          if (childNode.classList.contains('image')) {
            const { publicId = null, secureUrl = null } = childNode.dataset;
            if (publicId && secureUrl) {
              images.push({
                secure_url: secureUrl,
                public_id: publicId
              });
            }
          }
        });

        data.images = images;

        const lat = latitude.value ? parseFloat(latitude.value) : null;
        const lng = longitude.value ? parseFloat(longitude.value) : null;

        if (lat && lng) {
          data.location = {
            latitude: lat,
            longitude: lng,
          };
        }

        this.submit(data);
      });

      this._hasBindedEvents = true;
    }
  }

  async submit(params) {
    const loader = new Loader('Adding property data');

    try{
      const { data, status, headers } = await window.requestHandler.post('/property', params);

      loader.hideImage();
      loader.showText();
      loader.setMode(data.status);
      loader.setText(data.message || data.error);
      loader.setTitle('Server Response');

      if (status === 201) {
        const { data: responseData } = data;
        const { location } = headers;

        loader.setText('Property advert added succesfully... redirecting to property advert page....');
        setTimeout(() => {
          window.location.href = location;
        }, 5000);
      }
    } catch (error) {
      Utils.processRequestError({
        loader,
        error
      });
    }
  }

  init() {
    this.bindEvents();
  }
}

class EditPropertyPage extends PostPropertyPage {
  constructor() {
    super();
  }

  bindEvents() {
    const removeButtons = document.querySelectorAll('main > .parent.form > form.container > .input.image > .holder > .image > button.remove');

    if (removeButtons.length) {
      removeButtons.forEach((removeButton, index) => {
        const parent = removeButton.parentNode;
        const image = parent.querySelector('img');
        const { src } = image.dataset;

        image.onload = function () {
          const data = { src };
          parent.____arrayBuffer = data;
        };

        image.onerror = function () {
          parent.parentNode.removeChild(parent);
        };

        image.src = src;
        removeButton.addEventListener('click', (e) => {
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

class LandingPage extends PropertiesPage {
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
