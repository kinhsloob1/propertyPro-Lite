class Reply extends Map {
  constructor(reply) {
    let data = reply;
    if (!((typeof data === 'object') && !Array.isArray(data))) {
      data = {};
    }

    super();
    Object.keys(data).forEach((key) => {
      this.set(key, data[key]);
    });
  }

  isOk() {
    return (this.get('status') === 'success');
  }
}

export default Reply;
