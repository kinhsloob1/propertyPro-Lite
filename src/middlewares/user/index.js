import { ReplyFor, Reply } from '../../controllers/utils';
import { getUser } from '../../controllers/users/index';

class UserMiddleware {
  static ensureUserHasPermission(req, res, next) {
    const { data } = req;
    const user = getUser(req);

    if (user instanceof Map) {
      const loggedUser = data.get('loggedUser');
      const loggedId = loggedUser.get('id');
      const isAdmin = loggedUser.get('is_admin');
      const isSameId = (loggedId === user.get('id'));

      if (!isAdmin) {
        if (!isSameId) {
          return ReplyFor('invalid-user-permission').send(res);
        }
      }

      data.set('User', user);
      return next();
    }

    return Reply('Invalid user... User not found')
      .setStatusCode(404)
      .send(res);
  }
}

export const {
  ensureUserHasPermission,
} = UserMiddleware;
export default UserMiddleware;
