import * as Cloud from 'cloudinary';
import { Reply, ReplyFor } from '../utils';
import { parseData } from './property/index';
import * as flagSpecData from './property/flag/index';

const {
  v2: {
    utils: {
      api_sign_request: signUploadData,
    },
  },
} = Cloud;

const { parseData: parsePropertyFlagData } = flagSpecData;

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

  static getProperty(req) {
    const propertyDb = Properties.getDb(req);
    const propertyId = parseInt(req.params.propertyId, 10) || 0;
    return propertyDb.get(propertyId);
  }

  static getPropertyData(req, res) {
    const { data } = req;
    const property = data.get('Property');

    let propertyObject = Properties.getPropertyObject(property);
    if (!propertyObject.isOk()) {
      return ReplyFor('invalid-property').send(res);
    }

    propertyObject = propertyObject.get('Object');
    const reply = Reply('Property fetched succesfully', true, {
      data: {
        ...propertyObject,
      },
    });
    reply.setStatusCode(200);
    return reply.send(res);
  }

  static getPropertyById(id) {
    return (req) => {
      const Property = Properties.getDb(req).get(id);
      if (!(Property instanceof Map)) {
        return Reply('Invalid property', false);
      }

      return Reply('valid property', true, {
        Property,
      });
    };
  }

  static getPropertyObject(property) {
    if (!(property instanceof Map)) {
      return Reply('Invalid property', false);
    }

    const propertyObject = Array.from(property.keys()).reduce((obj, key) => {
      const object = obj;

      switch (key) {
        case 'ownerMap': {
          const owner = property.get(key);
          object.ownerEmail = owner.get('email');
          object.ownerPhoneNumber = owner.get('phoneNumber');
        }
          break;

        default:
          object[key] = property.get(key);
      }

      return obj;
    }, {});

    const { owner, ...propertyData } = propertyObject;

    return Reply('Property data', true, {
      Object: propertyData,
    });
  }

  static updateProperty(req, res) {
    const { body: updateData, data } = req;
    const property = data.get('Property');
    const propertyData = parseData(updateData, 'update');

    if (!propertyData.isValid()) {
      return Reply(propertyData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const propertyObject = propertyData.getSavedData();
    Object.entries(propertyObject).forEach(([key, value]) => {
      property.set(key, value);
    });

    const reply = Reply('Property data updated succesfully', true);
    reply.setStatusCode(200);
    reply.setObjectData({
      data: {
        ...propertyObject,
      },
    });
    return reply.send(res);
  }

  static deleteProperty(req, res) {
    const { data } = req;
    const property = data.get('Property');
    const propertiesDb = Properties.getDb(req);

    propertiesDb.delete(property.get('id'));
    return Reply('Property removed succesfully succesfully')
      .setStatusCode(204)
      .send(res);
  }

  static setPropertySold(req, res) {
    const { data } = req;
    const property = data.get('Property');

    property.set('status', 'sold');
    let propertyObject = Properties.getPropertyObject(property);
    if (!propertyObject.isOk()) {
      return ReplyFor('invalid-property').send(res);
    }

    propertyObject = propertyObject.get('Object');
    return Reply('Property information updated succesfully')
      .setStatusCode(200)
      .setObjectData({
        data: propertyObject,
      })
      .send(res);
  }

  static getFlagsDb(req) {
    const { data } = req;
    const db = data.get('database');
    if (!db.hasStorage('flags')) {
      db.createStorage('flags');
    }

    return db.getStorage('flags');
  }

  static getPropertyFlag(req) {
    const propertyFlagDb = this.getFlagsDb(req);
    const propertyFlagId = parseInt(req.params.propertyFlagId, 10) || 0;
    return propertyFlagDb.get(propertyFlagId);
  }

  static flagProperty(req, res) {
    const { data, body: flagClientData } = req;
    const flagData = parsePropertyFlagData(flagClientData, 'new');

    if (!flagData.isValid()) {
      return Reply(flagData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const property = data.get('Property');
    const flagsDb = this.getFlagsDb(req);

    const id = (
      (flagsDb.size > 0)
        ? (parseInt(Array.from(flagsDb.keys()).pop(), 10) + 1)
        : 1
    );
    const owner = data.get('loggedUser');

    flagData
      .set('id', id)
      .set('owner', owner.get('id'))
      .set('property_id', property.get('id'))
      .set('created_on', new Date());

    const flagMapData = flagData
      .getSavedMapObject()
      .set('ownerMap', owner);

    flagsDb.set(id, flagMapData);

    const flags = property.get('flags') || [];
    flags.push(flagMapData);

    const savedData = flagData.getSavedData();
    const reply = Reply('Property flagged succesfully', true);
    reply.setObjectData({
      data: {
        ...savedData,
      },
    });
    reply.setStatusCode(200);
    return reply.send(res);
  }

  static getPropertyFlagObject(propertyFlag) {
    if (!(propertyFlag instanceof Map)) {
      return Reply('Invalid property flag', false);
    }

    const propertyFlagObject = Array.from(propertyFlag.keys()).reduce((obj, key) => {
      const object = obj;

      switch (key) {
        case 'ownerMap': {
          const owner = propertyFlag.get(key);
          object.ownerEmail = owner.get('email');
          object.ownerPhoneNumber = owner.get('phoneNumber');
        }
          break;

        default:
          object[key] = propertyFlag.get(key);
      }

      return object;
    }, {});

    const { owner, ...propertyFlagData } = propertyFlagObject;

    return Reply('Property flag data', true, {
      Object: propertyFlagData,
    });
  }

  static updatePropertyFlag(req, res) {
    const { body: updateData, data } = req;
    const propertyFlag = data.get('PropertyFlag');
    const propertyFlagData = parsePropertyFlagData(updateData, 'update');

    if (!propertyFlagData.isValid()) {
      return Reply(propertyFlagData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const propertyFlagObject = propertyFlagData.getSavedData();
    Object.entries(propertyFlagObject).forEach(([key, value]) => {
      propertyFlag.set(key, value);
    });

    const reply = Reply('Property flag data updated succesfully', true);
    reply.setStatusCode(200);
    reply.setObjectData({
      data: {
        ...propertyFlagObject,
      },
    });
    return reply.send(res);
  }
}

export const {
  getDb: PropertiesDb,
  addProperty,
  getProperty,
  getPropertyData,
  updateProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  setPropertySold,
  getPropertyFlag,
  flagProperty,
  updatePropertyFlag,
} = Properties;
export default Properties;
