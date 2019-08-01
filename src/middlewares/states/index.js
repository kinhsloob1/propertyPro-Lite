import { getStateData } from '../../controllers/states/index';

class StateMiddleware {
  static processState(req, res, next) {
    const { data } = req;
    const stateDataResponse = getStateData(req);

    if (!stateDataResponse.isOk()) {
      return stateDataResponse.send(res);
    }

    const stateData = stateDataResponse.get('stateData');
    data.set('StateData', stateData);
    return next();
  }
}

export const {
  processState,
} = StateMiddleware;
export default StateMiddleware;
