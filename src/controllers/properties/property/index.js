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
      title = null,
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
      created_on: createdOn = null,
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

    let value = String(title);
    let valueLength = value.length;
    if (title === null) {
      if (isForNew || isForProperty) {
        errors.push('Invalid property title');
      }
    } else if (!((valueLength >= 3) && (valueLength <= 255))) {
      errors.push('property title should be above 3 charcters and below 255 characters.');
    } else {
      this.set('title', value.toLowerCase());
    }

    value = String(description);
    valueLength = value.length;
    if (description === null) {
      if (isForNew || isForProperty) {
        errors.push('Invalid property description');
      }
    } else if (!((valueLength >= 3) && (valueLength <= 255))) {
      errors.push('description should be above 3 charcters and below 255 characters.');
    } else {
      this.set('description', value.toLowerCase());
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
    } else if (!(parseFloat(price) >= 0)) {
      errors.push('Invalid property price... Price must be a decimal');
    } else {
      this.set('price', parseFloat(price));
    }

    value = String(state);
    valueLength = value.length;
    if (state === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid state or region');
      }
    } else if (
      !(
        value.match(/^[\S]{1,}[a-zA-Z-_\s]{1,}$/)
            && (valueLength >= 3)
            && (valueLength <= 255)
      )
    ) {
      errors.push('Invalid state or region. Please insert a valid property region');
    } else {
      this.set('state', value.toLowerCase());
    }

    value = String(city);
    valueLength = value.length;
    if (city === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property city');
      }
    } else if (
      !(
        value.match(/^[\S]{1,}[a-zA-Z-_\s]{1,}$/)
            && (valueLength >= 3)
            && (valueLength <= 255)
      )
    ) {
      errors.push('Invalid city. Please insert a valid property city');
    } else {
      this.set('city', value.toLowerCase());
    }

    value = String(address);
    valueLength = value.length;
    if ((address === null)) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property address');
      }
    } else if (!(value.match(/^[\S]{1,}[\d\s\S]{5,}$/)) && (valueLength <= 255)) {
      errors.push('Invalid address.. address should be above 6 characters and less than 255 characters');
    } else {
      this.set('address', value.toLowerCase());
    }

    value = String(type).toLowerCase();
    if (type === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property type');
      }
    } else if (!['1 bedroom', '2 bedroom', '3 bedroom', '4 bedroom', '5 bedroom', 'duplex', 'self contain'].includes(value)) {
      errors.push('Invalid property type... Please select a valid property type');
    } else {
      this.set('type', value);
    }

    value = String(option).toLowerCase();
    if (option === null) {
      if (isForProperty || isForNew) {
        errors.push('Invalid property option');
      }
    } else if (!['rent-month', 'sale', 'rent-year'].includes(value)) {
      errors.push('Invalid property option... Please select a valid property option');
    } else {
      this.set('option', value);
    }

    if (isForNew || isForUpdate || isForProperty) {
      if (!Array.isArray(images)) {
        errors.push('Invalid images uploaded');
      } else if (images.length === 0) {
        if (isForNew || isForProperty) {
          errors.push('At least, an image is required');
        }
      } else {
        this.set('images', images.filter(image => ((typeof image === 'object') && image.public_id && image.secure_url)));
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
            [lat, log] = location.map(val => parseFloat(val));
          } else {
            const { latitude = null, longitude = null } = location;
            lat = parseFloat(latitude);
            log = parseFloat(longitude);
          }
        }

        if ((lat === null) && (log === null)) {
          errors.push('Ooops.. invalid location. location can be a string with latitude and logitude seperated by a comma(,) or an object containing both');
        } else if (!(lat >= -90) && (lat <= 90)) {
          errors.push('Ooops.. Invalid property latitude.. It must be a value between -90 and 90');
        } else if (!(log >= -90) && (log <= 90)) {
          errors.push('Ooops.. Invalid property longitude.. It must be a value between -180 and 180');
        } else {
          this.set('location', {
            latitude: lat,
            longitude: log,
          });
        }
      }
    }

    if (isForProperty) {
      if ((createdOn === null)) {
        errors.push('Invalid property created date');
      } else if (!Date.parse(createdOn)) {
        errors.push('Ooops... invalid property created date');
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
    return new Property(data, {
      purpose,
    });
  }
}

export const { parseData } = Property;
export default Property;
