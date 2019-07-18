class Storage extends Map {
  constructor() {
    super();
    this.STORAGE_PREFIX = process.env.NODE_ENV === 'test' ? 'test_' : 'main_';
    this.loadStatesData();
  }

  getStoragePrefix() {
    return this.STORAGE_PREFIX;
  }

  createStorage(name) {
    const child = new Map();
    this.set(`${this.getStoragePrefix()}${name}`, child);
    return this;
  }

  hasStorage(name) {
    const storage = `${this.getStoragePrefix()}${name}`;
    return (this.has(storage) && (this.get(storage) instanceof Map));
  }

  deleteStorage(name) {
    const storage = `${this.getStoragePrefix()}${name}`;
    if (this.hasStorage(name)) {
      return this.delete(storage);
    }
    return false;
  }

  getStorage(name) {
    const storage = `${this.getStoragePrefix()}${name}`;
    if (this.hasStorage(name)) {
      return this.get(storage);
    }
    return null;
  }

  clearStorage(name) {
    const storage = `${this.getStoragePrefix()}${name}`;
    if (this.hasStorage(name)) {
      return this.set(storage, new Map());
    }
    return null;
  }

  loadStatesData() {
    const statesDb = this.createStorage('states').getStorage('states');
    const states = {
      lagos: {
        cities: [
          'lekki',
          'ajah',
          'victoria island',
          'surulere',
          'oshodi',
          'jibowu',
        ],
      },
      rivers: {
        cities: [
          'port harcourt',
          'etche',
          'ahoda',
          'elele',
          'town',
        ],
      },
      imo: {
        cities: [
          'owerri',
          'mbaise',
          'obowow',
          'okigwe',
          'umuagwo',
        ],
      },
    };

    Object.keys(states).forEach((stateName) => {
      statesDb.set(stateName, new Map());
      const stateData = states[stateName];
      const store = statesDb.get(stateName);

      Object.keys(stateData).forEach((dataKey) => {
        store.set(dataKey, stateData[dataKey]);
      });
    });

    return this;
  }
}

export default Storage;
