import states from '../../models/ng_states';
import { Reply } from '../utils';

class Processor {
  static getStates(req, res) {
    const { query } = req;
    const { type = 'short' } = query || {};
    let statesData;

    switch (type) {
      case 'short':
        statesData = states.map(({
          name, capital, latitude, longitude,
        }) => ({
          name,
          capital,
          latitude,
          longitude,
        }));
        break;
      default:
        statesData = states;
    }

    return Reply('States data fetched succesfully', true, {
      data: statesData,
    })
      .setStatusCode(200)
      .send(res);
  }

  static getState(req, res) {
    const { data } = req;
    return Reply('state data fetched succesfully', true, {
      data: data.get('StateData'),
    })
      .setStatusCode(200)
      .send(res);
  }

  static getStateData(req) {
    const { params } = req;
    const { stateName = null } = params || {};

    if (typeof stateName !== 'string') {
      return Reply('Invalid state name').setStatusCode(400);
    }

    const searchState = stateName.toLowerCase();
    const stateData = states.find(({ name }) => name.toLowerCase() === searchState);

    if (!stateData) {
      return Reply('State does not exists').setStatusCode(404);
    }

    return Reply('state found succesfully', true, {
      stateData,
    }).setStatusCode(200);
  }

  static getCities(req, res) {
    const { data } = req;
    const stateData = data.get('StateData');
    const { cities } = stateData;

    if (!Array.isArray(cities) || (cities.length === 0)) {
      return Reply('Ooops state does not have any city')
        .setStatusCode(400)
        .send(res);
    }

    return Reply('state cities data fetched succesfully', true, {
      data: cities,
    })
      .setStatusCode(200)
      .send(res);
  }
}

export const {
  getCities,
  getState,
  getStateData,
  getStates,
} = Processor;
export default Processor;
