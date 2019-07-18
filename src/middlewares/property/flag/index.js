import { ReplyFor } from '../../../controllers/utils';
import { getPropertyFlag } from '../../../controllers/properties/index';

class PropertyFlagMiddleware {
  static processPropertyFlag(req, res, next) {
    const { data } = req;
    const flag = getPropertyFlag(req);

    if (!(flag instanceof Map)) {
      return ReplyFor('invalid-property-flag').send(res);
    }

    data.set('PropertyFlag', flag);
    return next();
  }

  static ensureUserHasPermission(req, res, next) {
    const { data } = req;
    const loggedUser = data.get('loggedUser');
    const isAdmin = loggedUser.get('is_admin');
    const propertyFlag = data.get('PropertyFlag');
    const owner = propertyFlag.get('ownerMap');
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
  processPropertyFlag,
  ensureUserHasPermission,
} = PropertyFlagMiddleware;
export default PropertyFlagMiddleware;
