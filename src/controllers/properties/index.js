import { Reply, ReplyFor } from '../utils';
import { parseData } from './property/index';
import cloudinary from '../cloudinary';
import * as flagSpecData from './property/flag/index';

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

    const signature = cloudinary
      .utils
      .api_sign_request(
        mainParams,
        data.get('envs').get('CLOUDINARY_API_SECRET'),
      );

    const reply = Reply('Signature created succesfully', true);
    reply.setObjectData({
      signature,
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
    reply.addHeader('Location', `/api/v1/property/${id}`);
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
          object.ownerAddress = owner.get('address');
          object.ownerIsAdmin = owner.get('is_admin');
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

  static async deleteProperty(req, res) {
    const { data } = req;
    const property = data.get('Property');
    const propertiesDb = Properties.getDb(req);

    const images = property.get('images');
    const promises = [];
    images.forEach(({ public_id: publicId }) => {
      promises.push(new Promise((success, error) => {
        cloudinary.uploader.destroy(
          publicId,
          {
            invalidate: true,
          },
          (err, resp) => {
            const { result = null } = resp || {};
            if (result === 'ok') {
              success();
            }

            error(err);
          },
        );
      }));
    });

    try {
      await Promise.all(promises);
      propertiesDb.delete(property.get('id'));
      return Reply('Property removed succesfully succesfully')
        .setStatusCode(204)
        .send(res);
    } catch (error) {
      return Reply('An error occured while deleting property image')
        .setStatusCode(400)
        .send(res);
    }
  }

  static deleteUploadedFile(req, res) {
    const { query: params } = req;
    const { public_id: publicId = null } = params;

    if (typeof publicId !== 'string') {
      return Reply('Ooops file url is required').send(res);
    }

    return cloudinary.uploader.destroy(
      publicId,
      {
        invalidate: true,
      },
      (err, resp) => {
        const { result = null } = resp || {};
        if (result === 'ok') {
          return Reply('file removed succesfully', true)
            .setStatusCode(200)
            .send(res);
        }

        return Reply('An error occured while deleting file')
          .setStatusCode(400)
          .send(res);
      },
    );
  }

  static deletePropertyImage(req, res) {
    const { query: params, data } = req;
    const property = data.get('Property');
    const { public_id: publicId = null } = params;

    if (typeof punlicId !== 'string') {
      return Reply('Ooops property image url is required').send(res);
    }

    return cloudinary.uploader.destroy(
      publicId,
      {
        invalidate: true,
        resource_type: 'image',
      },
      (err, resp) => {
        const { result = null } = resp || {};
        if (result === 'ok') {
          let images = property.get('images') || [];
          images = images.filter(image => image.public_id !== publicId);
          property.set('images', images);

          return Reply('image removed succesfully', true)
            .setStatusCode(200)
            .send(res);
        }

        return Reply('An error occured while deleting image')
          .setStatusCode(400)
          .send(res);
      },
    );
  }

  static getProperties(req, res) {
    const {
      query: {
        propertyType: propType = null,
        limit = 12,
        offset = 0,
      },
    } = req;

    const propertiesDb = Properties.getDb(req);
    const out = [];
    let offsetCount = 0;

    let propertyType = (typeof propType === 'string' ? propType : 'all');
    propertyType = propertyType.toLowerCase();

    Array.from(propertiesDb.keys()).forEach((key) => {
      const property = propertiesDb.get(key);
      if (property.get('is_blocked')) {
        return;
      }

      if ((propertyType !== 'all') && (property.get('type') !== propertyType)) {
        return;
      }

      const propertyObject = Properties.getPropertyObject(property);
      if (propertyObject.isOk()) {
        if (offsetCount < offset) {
          offsetCount += 1;
        } else if (out.length < limit) {
          out.push(propertyObject.get('Object'));
        }
      }
    });

    const reply = Reply('Properties list', true);
    reply.setStatusCode(200);
    reply.setObjectData({
      data: out,
    });
    return reply.send(res);
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
    const propertyFlagDb = Properties.getFlagsDb(req);
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
    const flagsDb = Properties.getFlagsDb(req);

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
    property.set('flags', flags);

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

  static deletePropertyFlag(req, res) {
    const { data } = req;
    const propertyFlag = data.get('PropertyFlag');
    const propertyFlagsDb = Properties.getFlagsDb(req);

    propertyFlagsDb.delete(propertyFlag.get('id'));
    return Reply('Property flag removed succesfully')
      .setStatusCode(204)
      .send(res);
  }

  static getPropertyFlags(req, res) {
    const { data } = req;
    let {
      query: {
        limit = 12,
        offset = 0,
      },
    } = req;

    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    const property = data.get('Property');
    const out = [];
    let offsetCount = 0;
    let propertyFlags = property.get('flags');

    if (Array.isArray(propertyFlags)) {
      propertyFlags = propertyFlags.reverse();
      propertyFlags.forEach((propertyFlag) => {
        const propertyFlagObject = Properties.getPropertyFlagObject(propertyFlag);
        if (propertyFlagObject.isOk()) {
          if (offsetCount < offset) {
            offsetCount += 1;
          } else if (out.length < limit) {
            out.push(propertyFlagObject.get('Object'));
          }
        }
      });
    }

    const reply = Reply('Property flags list', true);
    reply.setStatusCode(200);
    reply.setObjectData({
      data: out,
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
  deleteUploadedFile,
  deletePropertyImage,
  getProperties,
  getPropertyById,
  setPropertySold,
  getPropertyFlag,
  flagProperty,
  updatePropertyFlag,
  deletePropertyFlag,
  getPropertyFlags,
  generateCloudinaryHash,
} = Properties;
export default Properties;
