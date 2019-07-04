class Storage extends Map {
  constructor() {
    super();
    this.STORAGE_PREFIX = process.env.NODE_ENV === 'test' ? 'test_' : 'main_';
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
}

export default Storage;
