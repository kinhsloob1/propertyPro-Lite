class Flag extends Map {
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
      owner = null,
      property_id: propertyId = null,
      created_on: createdOn = null,
      reason = null,
      description = null,
    },
  ) {
    const purpose = this.get('_purpose');
    const isForNew = (purpose === 'new');
    const isForFlag = (purpose === 'flag');
    const errors = [];

    if (isForFlag) {
      if ((id === null) || (!((String(id).match(/^\d{1,}$/)) && (parseInt(id, 10) > 0)))) {
        errors.push('Flag id is required');
      } else {
        this.set('id', parseInt(id, 10));
      }
    }

    if (description === null) {
      if (isForNew || isForFlag) {
        errors.push('Invalid flag description');
      }
    } else if (!((String(description).length >= 3) && (String(description).length <= 255))) {
      errors.push('Description should be above 3 charcters and below 255 characters.');
    } else {
      this.set('description', String(description).toLowerCase());
    }

    if (reason === null) {
      if (isForNew || isForFlag) {
        errors.push('Invalid flag reason');
      }
    } else if (!((String(reason).length >= 3) && (String(reason).length <= 255))) {
      errors.push('Reason should be above 3 charcters and below 255 characters.');
    } else {
      this.set('reason', String(reason).toLowerCase());
    }

    if (isForFlag) {
      if ((owner === null)) {
        errors.push('Invalid flag owner');
      } else if (!(String(owner).match(/^\d{1,}$/) && (parseInt(owner, 10) > 0))) {
        errors.push('Ooops flag owner should be an integer');
      } else {
        this.set('owner', parseInt(owner, 10));
      }

      if ((propertyId === null)) {
        errors.push('Invalid flaged property');
      } else if (!(String(propertyId).match(/^\d{1,}$/) && (parseInt(propertyId, 10) > 0))) {
        errors.push('Ooops flaged property id should be an integer');
      } else {
        this.set('property_id', parseInt(propertyId, 10));
      }
    }

    if (isForFlag) {
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
    return new Flag(data, {
      purpose,
    });
  }
}

export const { parseData } = Flag;
export default Flag;
