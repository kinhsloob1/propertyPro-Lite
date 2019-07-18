import * as Cloud from 'cloudinary';
import { Reply } from '../utils';
import { parseData } from './property/index';

const {
  v2: {
    utils: {
      api_sign_request: signUploadData,
    },
  },
} = Cloud;

class Properties {
  static getDb(req) {
    const { data } = req;
    const db = data.get('database');
    if (!db.hasStorage('properties')) {
      db.createStorage('properties');
    }

    return db.getStorage('properties');
  }

  static generateCloudinaryHash(req, res) {
    const { body: params, data } = req;
    const {
      file,
      resource_type: resourceType1,
      api_key: apiKey1,
      resourceType,
      apiKey,
      ...mainParams
    } = params;

    const signatuue = signUploadData(mainParams, data.get('env').get('CLOUDINARY_API_SECRET'));
    const reply = Reply('Signature created succesfully', true);
    reply.setObjectData({
      signatuue,
    });
    reply.setStatusCode(200);
    return reply.send(res);
  }

  static addProperty(req, res) {
    const { body: propertiesData, data } = req;
    const propertyData = parseData(propertiesData, 'new');

    if (!propertyData.isValid()) {
      return Reply(propertyData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const PropertiesDb = Properties.getDb(req);
    const id = (
      (PropertiesDb.size > 0)
        ? (parseInt(Array.from(PropertiesDb.keys()).pop(), 10) + 1)
        : 1
    );
    const owner = data.get('loggedUser');

    propertyData
      .set('status', 'available')
      .set('id', id)
      .set('owner', owner.get('id'))
      .set('created_on', new Date());

    const propertyMapData = propertyData
      .getSavedMapObject()
      .set('ownerMap', owner)
      .set('is_blocked', false);

    PropertiesDb.set(id, propertyMapData);
    const savedData = propertyData.getSavedData();

    const reply = Reply('Property registered succesfully', true);
    reply.setObjectData({
      data: {
        ...savedData,
      },
    });
    reply.setStatusCode(201);
    reply.addHeader('Location', `/v1/property/${id}`);
    return reply.send(res);
  }
}

export const {
  getDb: PropertiesDb,
  addProperty,
} = Properties;
export default Properties;
