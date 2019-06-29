import Reply from './reply';

class Model {
  static reply(message, type = false, other = {}) {
    const boolType = Boolean(type);
    const isOk = (boolType === true);
    const status = (isOk ? 'success' : 'error');
    const outMessage = ((!isOk) && (String(message).length === 0)) ? 'An error occurred' : String(message);
    const additionalParam = (typeof other === 'object') ? other : {};
    const out = {
      ...additionalParam,
      status,
      message: outMessage,
    };

    return out;
  }

  static processReply(data) {
    return new Reply(data);
  }
}

export default Model;
