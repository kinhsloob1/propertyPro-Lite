import { ReplyFor } from '../../controllers/utils';
import { JwtManager } from '../../controllers/token';

class AuthMiddleware {
  static enforceLogged(req, res, next) {
    const { data } = req;
    if (!data.get('logged')) {
      return ReplyFor('invalid-user').send(res);
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
    }

    return next();
  }
}

export const { processLogged, enforceLogged } = AuthMiddleware;
export default AuthMiddleware;
