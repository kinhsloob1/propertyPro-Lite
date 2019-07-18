import { ReplyFor, Reply } from '../../controllers/utils';
import { JwtManager } from '../../controllers/token';
import { getUserById } from '../../controllers/users/index';

class AuthMiddleware {
  static enforceLogged(req, res, next) {
    const { data } = req;

    const loggedData = data.get('loggedData');
    const knownUser = data.get('loggedUser');

    if (!(data.get('logged') && (knownUser instanceof Map))) {
      return ReplyFor('invalid-user').send(res);
    }

    if (knownUser.size === 0) {
      return Reply('Ooops.. user account deleted', false)
        .setStatusCode(410)
        .send(res);
    }

    const loggedId = loggedData.get('id');
    const loggedRegisterTime = new Date(loggedData.get('created_on'));
    const knownId = knownUser.get('id');
    const knownRegisterTime = knownUser.get('created_on');
    const isSameId = (loggedId === knownId);
    const isSameTimestamp = (loggedRegisterTime.getTime() === knownRegisterTime.getTime());

    if (!isSameId) {
      return ReplyFor('invalid-user').send(res);
    }

    if (!isSameTimestamp) {
      return Reply('Ooops... Either your account has been removed or your token is invalid. Try authenticating again and if the problem persists, Do well to contact an administrator')
        .setStatusCode(410)
        .send(res);
    }

    if (knownUser.get('is_blocked')) {
      return Reply('Ooops... you have been blocked from using this platform.. please contact support if you don understand this')
        .setStatusCode(403)
        .send(res);
    }

    return next();
  }

  static processLogged(req, res, next) {
    const { data } = req;
    const token = req.get('Bearer');
    const tokenManager = JwtManager().decode(token);

    if (!tokenManager.isValid()) {
      data.set('logged', false);
    } else {
      data.set('logged', true);
      data.set('loggedData', tokenManager);

      let user = getUserById(tokenManager.get('id'))(req);
      if (user.isOk()) {
        user = user.get('data');
      } else {
        user = new Map();
      }

      data.set('loggedUser', user);
    }
    return next();
  }

  static enforceUserIsAdministrator(req, res, next) {
    const { data } = req;
    if (!(data.get('loggedUser') instanceof Map)) {
      return ReplyFor('invalid-user').send(res);
    }

    if (data.get('envs').get('NODE_ENV') !== 'test') {
      if (!data.get('is_admin')) {
        return Reply('Ooops... you dont have access to this information')
          .setStatusCode(403)
          .send(res);
      }
    }
    return next();
  }
}

export const {
  processLogged,
  enforceLogged,
  enforceUserIsAdministrator,
} = AuthMiddleware;
export default AuthMiddleware;
