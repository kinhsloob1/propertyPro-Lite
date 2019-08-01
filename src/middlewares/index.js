import { ReplyFor } from '../controllers/utils';

class generalMiddleware {
  static init(database) {
    return (req, res, next) => {
      if (!(database instanceof Map)) {
        return ReplyFor('storage-notfound').send(res);
      }

      req.data = new Map();
      req.data
        .set('envs', new Map(Object.entries(process.env)))
        .set('database', database);

      return next();
    };
  }

  static processInvalidRequest(req, res) {
    return ReplyFor('invalid-request').send(res);
  }

  static catch(err, req, res, next) {
    if (err) {
      return ReplyFor(null).setMessage(err)
        .send(res);
    }

    return next();
  }
}

export const {
  init,
  catch: catchAllErrors,
  processInvalidRequest,
} = generalMiddleware;
export default generalMiddleware;
