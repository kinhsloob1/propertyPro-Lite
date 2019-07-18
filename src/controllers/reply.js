class Reply extends Map {
  isOk() {
    return (this.getStatus() === 'success');
  }

  setMessage(message = null) {
    this.set('_message', (message ? String(message) : ''));
    return this;
  }

  setStatus(status = false) {
    this.set('_status', (status ? 'success' : 'error'));
    return this;
  }

  setStatusCode(code = null) {
    this.set('_statusCode', (code ? parseInt(code, 10) : 0));
    return this;
  }

  setObjectData(obj = {}) {
    const additionalData = (((typeof obj === 'object') && !Array.isArray(obj)) ? obj : {});
    Object.keys(additionalData).forEach((key) => {
      this.set(key, obj[key]);
    });
    return this;
  }

  getStatusCode() {
    const code = this.get('_statusCode');
    if (code === 0) {
      if (this.isOk()) {
        return 200;
      }

      return 404;
    }

    return code;
  }

  getMessage() {
    const message = this.get('_message');
    if (message === '') {
      if (this.isOk()) {
        return 'Task completed successfully';
      }

      return 'An error occured';
    }

    return message;
  }

  getStatus() {
    return this.get('_status');
  }

  getResponseObject() {
    const data = {};
    const otherData = Array.from(this.entries()).filter(([key]) => {
      if (typeof key === 'string') {
        if (key.substr(0, 1) !== '_') {
          return true;
        }
      }

      return false;
    });

    otherData.forEach(([key, value]) => {
      data[key] = value;
    });

    data.status = this.getStatus();

    if (!this.isOk()) {
      data.error = this.getMessage();
    } else {
      data.message = this.getMessage();
    }

    return data;
  }

  send(res) {
    const headers = this.getHeaders();
    headers.forEach(header => res.set(...header));
    return res.status(this.getStatusCode()).json(this.getResponseObject());
  }

  addHeader(...data) {
    let headers = [];
    if (this.has('_headers')) {
      headers = this.get('_headers');
    }

    headers.push(data);
    return this.set('_headers', headers);
  }

  getHeaders() {
    let headers = this.get('_headers');
    if (!Array.isArray(headers)) {
      headers = [];
    }

    return headers;
  }
}

export default Reply;
