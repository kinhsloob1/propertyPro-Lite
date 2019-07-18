class Property extends Map {
  constructor(data, { purpose = 'new' }) {
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
      description = null,
      owner = null,
      price = null,
      state = null,
      city = null,
      address = null,
      type = null,
      option = null,
      images = [],
      location = null,
    },
  ) {
    const purpose = this.get('_purpose');
    const isForNew = (purpose === 'new');
    const isForUpdate = (purpose === 'update');
    const isForProperty = (purpose === 'property');
    const errors = [];

    if (isForProperty) {
      if ((id === null) || (!((String(id).match(/^\d{1,}$/)) && (parseInt(id, 10) > 0)))) {
        errors.push('Property id is required');
      } else {
        this.set('id', parseInt(id, 10));
      }
    }

    if (description === null) {
      if (isForNew || isForProperty) {
        errors.push('Invalid property description');
      }
    } else if (!((String(description).length >= 3) && (String(description).length <= 255))) {
      errors.push('First name should be above 3 charcters and below 255 characters.');
    } else {
      this.set('description', String(description).toLowerCase());
    }

    if (isForProperty) {
      if ((owner === null)) {
        errors.push('Invalid property owner');
      } else if (!(String(owner).match(/^\d{1,}$/) && (parseInt(owner, 10) > 0))) {
        errors.push('Ooops owner should be an integer');
      } else {
        this.set('owner', parseInt(owner, 10));
      }
    }

    if (price === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property price');
      }
    } else if (!this.constructor.isDigits(price)) {
      errors.push('Invalid property price... Price must be a decimal');
    } else {
      this.set('price', parseFloat(price));
    }

    if (state === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid state or region');
      }
    } else if (
      !(
        String(state).match(/^[\S]{1,}[a-zA-Z-_\s]{1,}$/)
            && (String(state).length >= 3)
            && (String(state).length <= 255)
      )
    ) {
      errors.push('Invalid state or region. Please insert a valid property region');
    } else {
      this.set('state', String(state).toLowerCase());
    }

    if (city === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property city');
      }
    } else if (
      !(
        String(city).match(/^[\S]{1,}[a-zA-Z-_\s]{1,}$/)
            && (String(city).length >= 3)
            && (String(city).length <= 255)
      )
    ) {
      errors.push('Invalid city. Please insert a valid property city');
    } else {
      this.set('city', String(city).toLowerCase());
    }

    if ((address === null)) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property address');
      }
    } else if (!(String(address).match(/^[\S]{1,}[\d\s\S]{5,}$/)) && (String(address).length <= 255)) {
      errors.push('Invalid address.. address should be less than 255 characters');
    } else {
      this.set('address', String(address).toLowerCase());
    }

    if (type === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property type');
      }
    } else if (!['1 bedroom', '2 bedroom', '3 bedroom', '4 bedroom', '5 bedroom', 'duplex', 'self contain'].includes(String(type).toLowerCase())) {
      errors.push('Invalid property type... Please select a valid property type');
    } else {
      this.set('type', String(type).toLowerCase());
    }

    if (option === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property option');
      }
    } else if (!['rent', 'sale'].includes(String(option).toLowerCase())) {
      errors.push('Invalid property option... Please select a valid property option');
    } else {
      this.set('option', String(option).toLowerCase());
    }

    if (isForNew || isForUpdate || isForProperty) {
      if (!Array.isArray(images)) {
        errors.push('Invalid images uploaded');
      } else if (images.length === 0) {
        if (isForNew || isForProperty) {
          errors.push('At least, an image is required');
        }
      } else {
        this.set('images', images.filter(image => (typeof image === 'string')));
      }
    }

    if (location !== null) {
      if (isForUpdate || isForProperty || isForNew) {
        let lat = null;
        let log = null;

        const locationType = (typeof location);

        if (locationType === 'string') {
          const mapPoints = location.split(',');
          [lat, log] = mapPoints.map(item => parseFloat(item.trim()));
        } else if (locationType === 'object') {
          if (Array.isArray(location)) {
            [lat, log] = location.map(value => parseFloat(value));
          } else {
            const { latitude = null, logitude = null } = location;
            lat = parseFloat(latitude);
            log = parseFloat(logitude);
          }
        }

        if ((lat === null) && (log === null)) {
          errors.push('Ooops.. invalid location. location can be a string with latitude and logitude seperated by a comma(,) or an object containing both');
        } else if (!this.constructor.isDigits(lat)) {
          errors.push('Ooops.. invalid location. Invalid latitude');
        } else if (!this.constructor.isDigits(log)) {
          errors.push('Ooops.. invalid location. Invalid logitude');
        } else {
          this.set('location', {
            latitude: lat,
            logitude: log,
          });
        }
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
    return new Property(data, {
      purpose,
    });
  }

  static isDigits(digits) {
    return ((String(digits).match(/^\d{1,}\.{0,1}\d{0,}$/)) && (parseFloat(digits) >= 0));
  }
}

export const { parseData } = Property;
export default Property;
