"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getPropertyFlags = exports.deletePropertyFlag = exports.updatePropertyFlag = exports.flagProperty = exports.getPropertyFlag = exports.setPropertySold = exports.getPropertyById = exports.getProperties = exports.deleteProperty = exports.updateProperty = exports.getPropertyData = exports.getProperty = exports.addProperty = exports.PropertiesDb = void 0;

var Cloud = _interopRequireWildcard(require("cloudinary"));

var _utils = require("../utils");

var _index = require("./property/index");

var flagSpecData = _interopRequireWildcard(require("./property/flag/index"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var signUploadData = Cloud.v2.utils.api_sign_request;
var parsePropertyFlagData = flagSpecData.parseData;

var Properties =
/*#__PURE__*/
function () {
  function Properties() {
    _classCallCheck(this, Properties);
  }

  _createClass(Properties, null, [{
    key: "getDb",
    value: function getDb(req) {
      var data = req.data;
      var db = data.get('database');

      if (!db.hasStorage('properties')) {
        db.createStorage('properties');
      }

      return db.getStorage('properties');
    }
  }, {
    key: "generateCloudinaryHash",
    value: function generateCloudinaryHash(req, res) {
      var params = req.body,
          data = req.data;

      var file = params.file,
          resourceType1 = params.resource_type,
          apiKey1 = params.api_key,
          resourceType = params.resourceType,
          apiKey = params.apiKey,
          mainParams = _objectWithoutProperties(params, ["file", "resource_type", "api_key", "resourceType", "apiKey"]);

      var signatuue = signUploadData(mainParams, data.get('env').get('CLOUDINARY_API_SECRET'));
      var reply = (0, _utils.Reply)('Signature created succesfully', true);
      reply.setObjectData({
        signatuue: signatuue
      });
      reply.setStatusCode(200);
      return reply.send(res);
    }
  }, {
    key: "addProperty",
    value: function addProperty(req, res) {
      var propertiesData = req.body,
          data = req.data;
      var propertyData = (0, _index.parseData)(propertiesData, 'new');

      if (!propertyData.isValid()) {
        return (0, _utils.Reply)(propertyData.getError()).setStatusCode(400).send(res);
      }

      var PropertiesDb = Properties.getDb(req);
      var id = PropertiesDb.size > 0 ? parseInt(Array.from(PropertiesDb.keys()).pop(), 10) + 1 : 1;
      var owner = data.get('loggedUser');
      propertyData.set('status', 'available').set('id', id).set('owner', owner.get('id')).set('created_on', new Date());
      var propertyMapData = propertyData.getSavedMapObject().set('ownerMap', owner).set('is_blocked', false);
      PropertiesDb.set(id, propertyMapData);
      var savedData = propertyData.getSavedData();
      var reply = (0, _utils.Reply)('Property registered succesfully', true);
      reply.setObjectData({
        data: _objectSpread({}, savedData)
      });
      reply.setStatusCode(201);
      reply.addHeader('Location', "/v1/property/".concat(id));
      return reply.send(res);
    }
  }, {
    key: "getProperty",
    value: function getProperty(req) {
      var propertyDb = Properties.getDb(req);
      var propertyId = parseInt(req.params.propertyId, 10) || 0;
      return propertyDb.get(propertyId);
    }
  }, {
    key: "getPropertyData",
    value: function getPropertyData(req, res) {
      var data = req.data;
      var property = data.get('Property');
      var propertyObject = Properties.getPropertyObject(property);

      if (!propertyObject.isOk()) {
        return (0, _utils.ReplyFor)('invalid-property').send(res);
      }

      propertyObject = propertyObject.get('Object');
      var reply = (0, _utils.Reply)('Property fetched succesfully', true, {
        data: _objectSpread({}, propertyObject)
      });
      reply.setStatusCode(200);
      return reply.send(res);
    }
  }, {
    key: "getPropertyById",
    value: function getPropertyById(id) {
      return function (req) {
        var Property = Properties.getDb(req).get(id);

        if (!(Property instanceof Map)) {
          return (0, _utils.Reply)('Invalid property', false);
        }

        return (0, _utils.Reply)('valid property', true, {
          Property: Property
        });
      };
    }
  }, {
    key: "getPropertyObject",
    value: function getPropertyObject(property) {
      if (!(property instanceof Map)) {
        return (0, _utils.Reply)('Invalid property', false);
      }

      var propertyObject = Array.from(property.keys()).reduce(function (obj, key) {
        var object = obj;

        switch (key) {
          case 'ownerMap':
            {
              var _owner = property.get(key);

              object.ownerEmail = _owner.get('email');
              object.ownerPhoneNumber = _owner.get('phoneNumber');
            }
            break;

          default:
            object[key] = property.get(key);
        }

        return obj;
      }, {});

      var owner = propertyObject.owner,
          propertyData = _objectWithoutProperties(propertyObject, ["owner"]);

      return (0, _utils.Reply)('Property data', true, {
        Object: propertyData
      });
    }
  }, {
    key: "updateProperty",
    value: function updateProperty(req, res) {
      var updateData = req.body,
          data = req.data;
      var property = data.get('Property');
      var propertyData = (0, _index.parseData)(updateData, 'update');

      if (!propertyData.isValid()) {
        return (0, _utils.Reply)(propertyData.getError()).setStatusCode(400).send(res);
      }

      var propertyObject = propertyData.getSavedData();
      Object.entries(propertyObject).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        property.set(key, value);
      });
      var reply = (0, _utils.Reply)('Property data updated succesfully', true);
      reply.setStatusCode(200);
      reply.setObjectData({
        data: _objectSpread({}, propertyObject)
      });
      return reply.send(res);
    }
  }, {
    key: "deleteProperty",
    value: function deleteProperty(req, res) {
      var data = req.data;
      var property = data.get('Property');
      var propertiesDb = Properties.getDb(req);
      propertiesDb["delete"](property.get('id'));
      return (0, _utils.Reply)('Property removed succesfully succesfully').setStatusCode(204).send(res);
    }
  }, {
    key: "getProperties",
    value: function getProperties(req, res) {
      var _req$query = req.query,
          _req$query$propertyTy = _req$query.propertyType,
          propType = _req$query$propertyTy === void 0 ? null : _req$query$propertyTy,
          _req$query$limit = _req$query.limit,
          limit = _req$query$limit === void 0 ? 12 : _req$query$limit,
          _req$query$offset = _req$query.offset,
          offset = _req$query$offset === void 0 ? 0 : _req$query$offset;
      var propertiesDb = Properties.getDb(req);
      var out = [];
      var offsetCount = 0;
      var propertyType = typeof propType === 'string' ? propType : 'all';
      propertyType = propertyType.toLowerCase();
      Array.from(propertiesDb.keys()).forEach(function (key) {
        var property = propertiesDb.get(key);

        if (property.get('is_blocked')) {
          return;
        }

        if (propertyType !== 'all' && property.get('type') !== propertyType) {
          return;
        }

        var propertyObject = Properties.getPropertyObject(property);

        if (propertyObject.isOk()) {
          if (offsetCount < offset) {
            offsetCount += 1;
          } else if (out.length < limit) {
            out.push(propertyObject.get('Object'));
          }
        }
      });
      var reply = (0, _utils.Reply)('Properties list', true);
      reply.setStatusCode(200);
      reply.setObjectData({
        data: out
      });
      return reply.send(res);
    }
  }, {
    key: "setPropertySold",
    value: function setPropertySold(req, res) {
      var data = req.data;
      var property = data.get('Property');
      property.set('status', 'sold');
      var propertyObject = Properties.getPropertyObject(property);

      if (!propertyObject.isOk()) {
        return (0, _utils.ReplyFor)('invalid-property').send(res);
      }

      propertyObject = propertyObject.get('Object');
      return (0, _utils.Reply)('Property information updated succesfully').setStatusCode(200).setObjectData({
        data: propertyObject
      }).send(res);
    }
  }, {
    key: "getFlagsDb",
    value: function getFlagsDb(req) {
      var data = req.data;
      var db = data.get('database');

      if (!db.hasStorage('flags')) {
        db.createStorage('flags');
      }

      return db.getStorage('flags');
    }
  }, {
    key: "getPropertyFlag",
    value: function getPropertyFlag(req) {
      var propertyFlagDb = Properties.getFlagsDb(req);
      var propertyFlagId = parseInt(req.params.propertyFlagId, 10) || 0;
      return propertyFlagDb.get(propertyFlagId);
    }
  }, {
    key: "flagProperty",
    value: function flagProperty(req, res) {
      var data = req.data,
          flagClientData = req.body;
      var flagData = parsePropertyFlagData(flagClientData, 'new');

      if (!flagData.isValid()) {
        return (0, _utils.Reply)(flagData.getError()).setStatusCode(400).send(res);
      }

      var property = data.get('Property');
      var flagsDb = Properties.getFlagsDb(req);
      var id = flagsDb.size > 0 ? parseInt(Array.from(flagsDb.keys()).pop(), 10) + 1 : 1;
      var owner = data.get('loggedUser');
      flagData.set('id', id).set('owner', owner.get('id')).set('property_id', property.get('id')).set('created_on', new Date());
      var flagMapData = flagData.getSavedMapObject().set('ownerMap', owner);
      flagsDb.set(id, flagMapData);
      var flags = property.get('flags') || [];
      flags.push(flagMapData);
      property.set('flags', flags);
      var savedData = flagData.getSavedData();
      var reply = (0, _utils.Reply)('Property flagged succesfully', true);
      reply.setObjectData({
        data: _objectSpread({}, savedData)
      });
      reply.setStatusCode(200);
      return reply.send(res);
    }
  }, {
    key: "getPropertyFlagObject",
    value: function getPropertyFlagObject(propertyFlag) {
      if (!(propertyFlag instanceof Map)) {
        return (0, _utils.Reply)('Invalid property flag', false);
      }

      var propertyFlagObject = Array.from(propertyFlag.keys()).reduce(function (obj, key) {
        var object = obj;

        switch (key) {
          case 'ownerMap':
            {
              var _owner2 = propertyFlag.get(key);

              object.ownerEmail = _owner2.get('email');
              object.ownerPhoneNumber = _owner2.get('phoneNumber');
            }
            break;

          default:
            object[key] = propertyFlag.get(key);
        }

        return object;
      }, {});

      var owner = propertyFlagObject.owner,
          propertyFlagData = _objectWithoutProperties(propertyFlagObject, ["owner"]);

      return (0, _utils.Reply)('Property flag data', true, {
        Object: propertyFlagData
      });
    }
  }, {
    key: "updatePropertyFlag",
    value: function updatePropertyFlag(req, res) {
      var updateData = req.body,
          data = req.data;
      var propertyFlag = data.get('PropertyFlag');
      var propertyFlagData = parsePropertyFlagData(updateData, 'update');

      if (!propertyFlagData.isValid()) {
        return (0, _utils.Reply)(propertyFlagData.getError()).setStatusCode(400).send(res);
      }

      var propertyFlagObject = propertyFlagData.getSavedData();
      Object.entries(propertyFlagObject).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        propertyFlag.set(key, value);
      });
      var reply = (0, _utils.Reply)('Property flag data updated succesfully', true);
      reply.setStatusCode(200);
      reply.setObjectData({
        data: _objectSpread({}, propertyFlagObject)
      });
      return reply.send(res);
    }
  }, {
    key: "deletePropertyFlag",
    value: function deletePropertyFlag(req, res) {
      var data = req.data;
      var propertyFlag = data.get('PropertyFlag');
      var propertyFlagsDb = Properties.getFlagsDb(req);
      propertyFlagsDb["delete"](propertyFlag.get('id'));
      return (0, _utils.Reply)('Property flag removed succesfully').setStatusCode(204).send(res);
    }
  }, {
    key: "getPropertyFlags",
    value: function getPropertyFlags(req, res) {
      var data = req.data;
      var _req$query2 = req.query,
          _req$query2$limit = _req$query2.limit,
          limit = _req$query2$limit === void 0 ? 12 : _req$query2$limit,
          _req$query2$offset = _req$query2.offset,
          offset = _req$query2$offset === void 0 ? 0 : _req$query2$offset;
      limit = parseInt(limit, 10);
      offset = parseInt(offset, 10);
      var property = data.get('Property');
      var out = [];
      var offsetCount = 0;
      var propertyFlags = property.get('flags');

      if (Array.isArray(propertyFlags)) {
        propertyFlags = propertyFlags.reverse();
        propertyFlags.forEach(function (propertyFlag) {
          var propertyFlagObject = Properties.getPropertyFlagObject(propertyFlag);

          if (propertyFlagObject.isOk()) {
            if (offsetCount < offset) {
              offsetCount += 1;
            } else if (out.length < limit) {
              out.push(propertyFlagObject.get('Object'));
            }
          }
        });
      }

      var reply = (0, _utils.Reply)('Property flags list', true);
      reply.setStatusCode(200);
      reply.setObjectData({
        data: out
      });
      return reply.send(res);
    }
  }]);

  return Properties;
}();

var PropertiesDb = Properties.getDb,
    addProperty = Properties.addProperty,
    getProperty = Properties.getProperty,
    getPropertyData = Properties.getPropertyData,
    updateProperty = Properties.updateProperty,
    deleteProperty = Properties.deleteProperty,
    getProperties = Properties.getProperties,
    getPropertyById = Properties.getPropertyById,
    setPropertySold = Properties.setPropertySold,
    getPropertyFlag = Properties.getPropertyFlag,
    flagProperty = Properties.flagProperty,
    updatePropertyFlag = Properties.updatePropertyFlag,
    deletePropertyFlag = Properties.deletePropertyFlag,
    getPropertyFlags = Properties.getPropertyFlags;
exports.getPropertyFlags = getPropertyFlags;
exports.deletePropertyFlag = deletePropertyFlag;
exports.updatePropertyFlag = updatePropertyFlag;
exports.flagProperty = flagProperty;
exports.getPropertyFlag = getPropertyFlag;
exports.setPropertySold = setPropertySold;
exports.getPropertyById = getPropertyById;
exports.getProperties = getProperties;
exports.deleteProperty = deleteProperty;
exports.updateProperty = updateProperty;
exports.getPropertyData = getPropertyData;
exports.getProperty = getProperty;
exports.addProperty = addProperty;
exports.PropertiesDb = PropertiesDb;
var _default = Properties;
exports["default"] = _default;