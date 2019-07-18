import ReplyModel from './reply';

class Utils {
  static reply(message = null, type = false, other = {}) {
    const boolType = Boolean(type);
    const reply = new ReplyModel();
    reply.setMessage(message).setStatus(boolType).setObjectData(other);
    return reply;
  }

  static replyFor(type) {
    switch (type) {
      case 'invalid-request':
        return Utils
          .reply('Invalid request')
          .setStatusCode(400);

      case 'storage-notfound':
        return Utils
          .reply('An error occured with the storage... Please try again later')
          .setStatusCode(500);

      case 'invalid-user':
        return Utils
          .reply('Invalid user. Login to continue')
          .setStatusCode(401)
          .addHeader('WWW-Authenticate', 'Bearer realm="Bearer token required", charset = "UTF-8"');

      case 'invalid-token-assigned':
        return Utils
          .reply('Ooops a server error occured.. Please try again later')
          .setStatusCode(500);

      case 'user-deleted':
        return Utils
          .reply('Ooops your account has been deleted from the system')
          .setStatusCode(410);

      case 'invalid-user-permission':
        return Utils
          .reply('Ooops you dont have appropriate permission.')
          .setStatusCode(403);

      case 'invalid-property':
        return Utils
          .reply('Ooops property does not exists')
          .setStatusCode(404);

      default:
        return Utils
          .reply('An error occured')
          .setStatusCode(400);
    }
  }
}

export const { reply: Reply, replyFor: ReplyFor } = Utils;
export default Utils;
