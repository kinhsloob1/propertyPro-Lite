import { ReplyFor } from '../../controllers/utils';
import { getProperty } from '../../controllers/properties/index';

class PropertyMiddleware {
  static processProperty(req, res, next) {
    const { data } = req;
    const property = getProperty(req);
    const isLogged = data.get('logged');
    const isAdmin = (isLogged && data.get('loggedUser').get('is_admin'));

    if (!(property instanceof Map)) {
      return ReplyFor('invalid-property').send(res);
    }

    if (property.get('is_blocked')) {
      if (!isAdmin) {
        const reply = ReplyFor('invalid-user-permission');
        reply.setMessage('Ooops.. property is blocked temporaly and is being reviewed by administrators.. Please try again later');
        return reply.send(res);
      }
    }

    data.set('Property', property);
    return next();
  }

  static ensureUserHasPermission(req, res, next) {
    const { data } = req;
    const loggedUser = data.get('loggedUser');
    const isAdmin = loggedUser.get('is_admin');
    const property = data.get('Property');
    const owner = property.get('ownerMap');
    const isOwner = (loggedUser.get('id') === owner.get('id'));

    if (!(isOwner || isAdmin)) {
      const reply = ReplyFor('invalid-user-permission');
      reply.setMessage('Ooops.. you dont have valid property permission');
      return reply.send(res);
    }

    return next();
  }
}

export const {
  processProperty,
  ensureUserHasPermission,
} = PropertyMiddleware;
export default PropertyMiddleware;
