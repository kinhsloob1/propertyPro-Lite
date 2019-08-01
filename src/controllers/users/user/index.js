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
      new_password: newPassword = null,
      can_remember: canRemember = null,
      phoneNumber = null,
      address = null,
      is_admin: isAdmin = null,
      is_verified: isVerified = null,
      created_on: createdOn = null,
    },
  ) {
    const purpose = this.get('_purpose');
    const isForUser = (purpose === 'user');
    const isForUpdate = (purpose === 'updateData');
    const isForRegistration = (purpose === 'registration');
    const isForLogin = (purpose === 'login');
    const isForReset = (purpose === 'reset');
    const errors = [];

    let value = String(id);
    let valueLength = 0;

    if (isForUser) {
      if ((id === null) || (!((value.match(/^\d{1,}$/)) && (parseInt(id, 10) > 0)))) {
        errors.push('user id is required');
      } else {
        this.set('id', parseInt(id, 10));
      }
    }

    value = String(login);
    if (isForLogin) {
      if (login === null) {
        errors.push('Invalid login is required Please insert your email address');
      } else if (!value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
        errors.push('Invalid login specified... Please insert your registered email address');
      } else {
        this.set('login', value);
      }
    }

    value = String(email);
    if (isForRegistration || isForLogin || isForUser) {
      if (email === null) {
        if (isForUser || isForRegistration) {
          errors.push('Invalid email address');
        }
      } else if ((!value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/))) {
        errors.push('Invalid email address.');
      } else {
        this.set('email', value);
      }
    }

    value = String(firstName);
    valueLength = value.length;
    if ((firstName === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid first name');
      }
    } else if (!((valueLength >= 3) && (valueLength <= 255))) {
      errors.push('First name should be above 3 charcters and below 255 characters.');
    } else if (!value.match(/^\S{1,}$/)) {
      errors.push('Invalid characters as first name');
    } else {
      this.set('first_name', value.toLowerCase());
    }

    value = String(lastName);
    valueLength = value.length;
    if ((lastName === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid last name');
      }
    } else if (!((valueLength >= 3) && (valueLength <= 255))) {
      errors.push('Last name should be above 3 charcters and below 255 characters.');
    } else if (!value.match(/^\S{1,}$/)) {
      errors.push('Invalid characters as last name');
    } else {
      this.set('last_name', value.toLowerCase());
    }

    value = Boolean(canRemember);
    if (isForReset) {
      if (canRemember === null) {
        errors.push('Please select the option asking if you remember your password');
      } else {
        this.set('can_remember', value);
      }
    }

    value = String(password);
    valueLength = value.length;
    if (isForUpdate || isForRegistration || isForLogin || isForUser || isForReset) {
      if (password === null) {
        if (isForRegistration || isForLogin || isForUser || (isForReset && canRemember)) {
          errors.push('Invalid password... please insert your password');
        }
      } else if (!((valueLength >= 3) && (valueLength <= 255))) {
        errors.push('Password should be above 3 charcters and below 255 characters.');
      } else {
        this.set('password', createHash('sha512').update(value).digest('hex'));
      }

      if (isForUpdate || isForRegistration) {
        value = String(passwordConfirmation);
        if (passwordConfirmation === null) {
          if (isForRegistration) {
            errors.push('Password confirmation is required');
          }
        } else if (this.getPassword() !== createHash('sha512').update(value).digest('hex')) {
          errors.push('Passwords does not match');
        }
      }

      if (isForReset && canRemember) {
        value = String(newPassword);
        valueLength = value.length;
        const newPasswordDigest = createHash('sha512').update(value).digest('hex');
        if (newPassword === null) {
          errors.push('new password is required');
        } else if (!((valueLength >= 3) && (valueLength <= 255))) {
          errors.push('new password should be above 3 charcters and below 255 characters');
        } else if (!this.getPassword()) {
          errors.push('current account password is required');
        } else if (this.getPassword() === newPasswordDigest) {
          errors.push('new password must be different from previous password');
        } else if (passwordConfirmation === null) {
          errors.push('new password confirmation is required');
        } else if ((createHash('sha512').update(passwordConfirmation).digest('hex') !== newPasswordDigest)) {
          errors.push('Password confirmation does not match new password');
        } else {
          this.set('new_password', newPasswordDigest);
        }
      }
    }

    value = String(phoneNumber);
    if ((phoneNumber === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid phone number');
      }
    } else if (!value.match(/^\d{11,15}$/)) {
      errors.push('Phone number must be 11 digits or at most 15 digits only');
    } else {
      this.set('phoneNumber', value);
    }

    value = String(address);
    if ((address === null)) {
      if (isForUser || isForRegistration) {
        errors.push('Invalid address');
      }
    } else if (!value.match(/^[\S]{1,}[\d\s\S]{5,255}$/)) {
      errors.push('Invalid address.. please insert a valid address');
    } else {
      this.set('address', value.toLowerCase());
    }

    value = Boolean(isAdmin);
    if (isForUser) {
      if (isAdmin === null) {
        errors.push('user admin status is required');
      } else if (![true, false].includes(value)) {
        errors.push('Invalid user admin status');
      } else {
        this.set('is_admin', value);
      }

      value = Boolean(isVerified);
      if (isVerified === null) {
        errors.push('user verification status is required');
      } else if (![true, false].includes(value)) {
        errors.push('Invalid user verification status');
      } else {
        this.set('is_verified', value);
      }

      if ((createdOn === null)) {
        errors.push('Invalid user created date');
      } else if (!Date.parse(createdOn)) {
        errors.push('Ooops... invalid user created date');
      } else {
        this.set('created_on', new Date(createdOn));
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
    return null;
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
