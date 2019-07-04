import { ReplyFor, Reply } from '../../controllers/utils';
import { UsersDb, getUser } from '../../controllers/users/index';

class UserMiddleware {
  static processUser(req, res, next) {
    const { data } = req;
    const user = getUser(req);

    if (user instanceof Map) {
      const loggedData = data.get('loggedData');
      const loggedId = loggedData.get('id');
      const isAdmin = loggedData.get('is_admin');
      const registerTime = loggedData.get('register_time');
      const isValidId = (!!UsersDb(req).get(loggedId));
      const isSameId = (loggedId === user.get('id'));
      const isSameTimestamp = (registerTime === user.get('register_time'));

      if ((!isValidId) || (isValidId && (!isSameTimestamp))) {
        return Reply('Ooops... Either your account has been removed or your token is invalid. Try authenticating again and if the problem persists, Do well to contact an administrator')
          .setStatusCode(410)
          .send(res);
      }

      if (isAdmin || isSameId) {
        data.set('User', user);
        return next();
      }

      return ReplyFor('invalid-user-permission').send(res);
    }

    return Reply('Invalid user... User not found')
      .setStatusCode(404)
      .send(res);
  }
}

export const { processUser } = UserMiddleware;
export default UserMiddleware;
