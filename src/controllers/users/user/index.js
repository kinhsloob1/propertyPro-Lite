import { createHash } from 'crypto';

class User extends Map {
  constructor(data, { purpose = 'user' }) {
    super();
    this.set('_isValid', false);
    this.set('_purpose', purpose);

    if (typeof data === 'object') {
      this.parseData(data);
    }
  }

  parseData(
    {
      id = null,
      email = null,
      login = null,
      first_name: firstName = null,
      last_name: lastName = null,
      password = null,
      password_confirmation: passwordConfirmation = null,
      phoneNumber = null,
      address = null,
      is_admin: isAdmin = null,
      is_verified: isVerified = null,
    },
  ) {
    const purpose = this.get('_purpose');
    const isForUser = (purpose === 'user');
    const isForUpdate = (purpose === 'updateData');
    const isForRegistration = (purpose === 'registration');
    const isForLogin = (purpose === 'login');
    const errors = [];

    if (isForUser) {
      if ((id === null) || ((!String(id).match(/^\d{1,}$/)) && (parseInt(id, 10) > 0))) {
        errors.push('user id is required');
      } else {
        this.set('id', parseInt(id, 10));
      }
    }

    if (isForLogin) {
      if (login === null) {
        errors.push('Invalid login is required Please insert your email address');
      } else if (!String(login).match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
        errors.push('Invalid login specified... Please insert your registered email address');
      } else {
        this.set('login', String(login));
      }
    }

    if (email === null) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid email address');
      }
    } else if ((!String(email).match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/))) {
      errors.push('Invalid email address.');
    } else {
      this.set('email', String(email));
    }

    if ((firstName === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid first name');
      }
    } else if (!(String(firstName).length >= 3) && (String(firstName).length <= 255)) {
      errors.push('First name should be above 3 charcters and below 255 characters.');
    } else {
      this.set('first_name', String(firstName).toLowerCase());
    }

    if ((lastName === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid last name');
      }
    } else if (!(String(lastName).length >= 3) && (String(lastName).length <= 255)) {
      errors.push('Last name should be above 3 charcters and below 255 characters.');
    } else {
      this.set('last_name', String(lastName).toLowerCase());
    }

    if (isForUpdate || isForRegistration || isForLogin || isForUser) {
      if (password === null) {
        if (isForRegistration || isForLogin || isForUser) {
          errors.push('Invalid password... please insert your password');
        }
      } else if (!(String(password).length >= 3) && (String(password).length <= 255)) {
        errors.push('Password should be above 3 charcters and below 255 characters.');
      } else {
        this.set('password', createHash('sha512').update(String(password)).digest('hex'));
      }

      if (passwordConfirmation === null) {
        if (isForRegistration) {
          errors.push('Password confirmation is required');
        }
      } else if (!(this.getPassword() === createHash('sha512').update(passwordConfirmation).digest('hex'))) {
        errors.push('Passwords does not match');
      }
    }

    if ((phoneNumber === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid phone number');
      }
    } else if (!String(phoneNumber).match(/^\d{11,15}$/)) {
      errors.push('Phone number must be 11 digits or at most 15 digits');
    } else {
      this.set('phoneNumber', String(phoneNumber));
    }

    if ((address === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid address');
      }
    } else if (!String(address).match(/^[\S]{1,}[\d\s\S]{5,255}$/)) {
      errors.push('Invalid address.. space should be between address data');
    } else {
      this.set('address', String(address).toLowerCase());
    }

    if (isForUser) {
      if (isAdmin === null) {
        errors.push('user admin status is required');
      } else if (![true, false].includes(Boolean(isAdmin))) {
        errors.push('Invalid user admin status');
      } else {
        this.set('is_admin', Boolean(isAdmin));
      }

      if (isVerified === null) {
        errors.push('user verification status is required');
      } else if (![true, false].includes(Boolean(isVerified))) {
        errors.push('Invalid user verification status');
      } else {
        this.set('is_verified', Boolean(isVerified));
      }
    }

    if (errors.length > 0) {
      this.set('_isValid', false);
      this.set('_errors', errors);
    } else {
      this.set('_isValid', true);
    }

    return this;
  }

  isValid() {
    return this.get('_isValid');
  }

  getFirstName() {
    return this.get('first_name');
  }

  getLastName() {
    return this.get('last_name');
  }

  getLogin() {
    return this.get('login');
  }

  getId() {
    return this.get('id');
  }

  getEmail() {
    return this.get('email');
  }

  getPassword() {
    return this.get('password');
  }

  getPhoneNumber() {
    return this.get('phoneNumber');
  }

  getAdrress() {
    return this.get('address');
  }

  getIsVerified() {
    return this.get('is_verified');
  }

  getisAdmin() {
    return this.get('is_admin');
  }

  getMap() {
    return this.map;
  }

  setMap(map) {
    this.map = map;
    return this;
  }

  getError() {
    const errors = this.get('_errors');
    if ((errors !== null) && Array.isArray(errors)) {
      return errors.shift();
    }
    return this.get('is_admin');
  }

  getSavedData() {
    const out = {};
    Array.from(this).forEach(([key, value]) => {
      if ((typeof key === 'string') && (key.substr(0, 1) !== '_')) {
        out[key] = value;
      }
    });

    return out;
  }

  get(key) {
    return super.has(key) ? super.get(key) : null;
  }

  getSavedMapObject() {
    const map = new Map(Object.entries(this.getSavedData()));
    return map;
  }

  static parseData(data, purpose) {
    return new User(data, {
      purpose,
    });
  }
}

export const { parseData } = User;
export default User;
