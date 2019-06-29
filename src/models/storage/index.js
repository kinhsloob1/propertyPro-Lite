import process from 'process';

class Storage extends Map {
  constructor({ name, storage }) {
    super();
    this.set('_name', `${process.env.STORAGE_PREFIX}${name}`);

    if (storage instanceof Map) {
      this.set('_storage', storage);

      const store = this.getStorage();
      if (!store.has(this.getName())) {
        store.set(this.getName(), new Map());
      }

      return this.set('data', store.get(this.getName()));
    }

    return this.setError('Ooops could not access storage object');
  }

  /**
     *
     * @param null
     * @returns {Map Object}
     * it returns storage object pointing to name;
     */
  getData() {
    return this.get('data');
  }

  /**
     *
     * @param null
     * @returns {String}
     * it returns storage name;
     */
  getStorage() {
    return this.get('_storage');
  }

  /**
     *
     * @param null
     * @returns {String}
     * it returns storage name;
     */
  getName() {
    return this.get('_name');
  }

  /**
     *
     * @param null
     * @returns {Boolean}
     * it returns true if error exists or false;
     */
  hasError() {
    return (this.has('_errors') && (this.get('_errors').length > 0));
  }

  /**
     *
     * @param null
     * @returns {String | null}
     * it returns either single error string if error exists or null
     */
  getError() {
    if (this.hasError()) {
      const errors = this.get('_errors');
      return errors[0];
    }
    return null;
  }

  /**
     *
     * @param null
     * @returns {Storage Object}
     * it returns the storage object
     */
  setError(error) {
    let errors;
    if (!this.hasError()) {
      errors = [];
    } else {
      errors = this.get('_errors');
      errors = Array.isArray(errors) ? errors : [];
    }

    errors.push(error);
    this.set('_errors', errors);
    return this;
  }

  /**
   *
   * @param {*} key
   * @returns {*} Value that was saved in key
   */
  get(key) {
    if (super.has(key)) {
      return super.get(key);
    }
    return null;
  }
}

export default Storage;
