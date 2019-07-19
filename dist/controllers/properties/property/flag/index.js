"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.parseData = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Flag =
/*#__PURE__*/
function (_Map) {
  _inherits(Flag, _Map);

  function Flag(data, _ref) {
    var _this;

    var _ref$purpose = _ref.purpose,
        purpose = _ref$purpose === void 0 ? 'new' : _ref$purpose;

    _classCallCheck(this, Flag);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Flag).call(this));

    _this.set('_isValid', false);

    _this.set('_purpose', purpose);

    if (_typeof(data) === 'object') {
      _this.parseData(data);
    }

    return _this;
  }

  _createClass(Flag, [{
    key: "parseData",
    value: function parseData(_ref2) {
      var _ref2$id = _ref2.id,
          id = _ref2$id === void 0 ? null : _ref2$id,
          _ref2$owner = _ref2.owner,
          owner = _ref2$owner === void 0 ? null : _ref2$owner,
          _ref2$property_id = _ref2.property_id,
          propertyId = _ref2$property_id === void 0 ? null : _ref2$property_id,
          _ref2$created_on = _ref2.created_on,
          createdOn = _ref2$created_on === void 0 ? null : _ref2$created_on,
          _ref2$reason = _ref2.reason,
          reason = _ref2$reason === void 0 ? null : _ref2$reason,
          _ref2$description = _ref2.description,
          description = _ref2$description === void 0 ? null : _ref2$description;
      var purpose = this.get('_purpose');
      var isForNew = purpose === 'new';
      var isForFlag = purpose === 'flag';
      var errors = [];

      if (isForFlag) {
        if (id === null || !(String(id).match(/^\d{1,}$/) && parseInt(id, 10) > 0)) {
          errors.push('Flag id is required');
        } else {
          this.set('id', parseInt(id, 10));
        }
      }

      if (description === null) {
        if (isForNew || isForFlag) {
          errors.push('Invalid flag description');
        }
      } else if (!(String(description).length >= 3 && String(description).length <= 255)) {
        errors.push('Description should be above 3 charcters and below 255 characters.');
      } else {
        this.set('description', String(description).toLowerCase());
      }

      if (reason === null) {
        if (isForNew || isForFlag) {
          errors.push('Invalid flag reason');
        }
      } else if (!(String(reason).length >= 3 && String(reason).length <= 255)) {
        errors.push('Reason should be above 3 charcters and below 255 characters.');
      } else {
        this.set('reason', String(reason).toLowerCase());
      }

      if (isForFlag) {
        if (owner === null) {
          errors.push('Invalid flag owner');
        } else if (!(String(owner).match(/^\d{1,}$/) && parseInt(owner, 10) > 0)) {
          errors.push('Ooops flag owner should be an integer');
        } else {
          this.set('owner', parseInt(owner, 10));
        }

        if (propertyId === null) {
          errors.push('Invalid flaged property');
        } else if (!(String(propertyId).match(/^\d{1,}$/) && parseInt(propertyId, 10) > 0)) {
          errors.push('Ooops flaged property id should be an integer');
        } else {
          this.set('property_id', parseInt(propertyId, 10));
        }
      }

      if (isForFlag) {
        if (createdOn === null) {
          errors.push('Invalid property created date');
        } else if (!Date.parse(createdOn)) {
          errors.push('Ooops... invalid property created date');
        } else {
          this.set('created_on', new Date(createdOn));
        }
      }

      if (errors.length > 0) {
        this.set('_isValid', false);
        this.set('_errors', errors);
      } else {
        this.set('_isValid', true);
      }

      return this;
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return this.get('_isValid');
    }
  }, {
    key: "getMap",
    value: function getMap() {
      return this.map;
    }
  }, {
    key: "setMap",
    value: function setMap(map) {
      this.map = map;
      return this;
    }
  }, {
    key: "getError",
    value: function getError() {
      var errors = this.get('_errors');

      if (errors !== null && Array.isArray(errors)) {
        return errors.shift();
      }

      return null;
    }
  }, {
    key: "getSavedData",
    value: function getSavedData() {
      var out = {};
      Array.from(this).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        if (typeof key === 'string' && key.substr(0, 1) !== '_') {
          out[key] = value;
        }
      });
      return out;
    }
  }, {
    key: "get",
    value: function get(key) {
      return _get(_getPrototypeOf(Flag.prototype), "has", this).call(this, key) ? _get(_getPrototypeOf(Flag.prototype), "get", this).call(this, key) : null;
    }
  }, {
    key: "getSavedMapObject",
    value: function getSavedMapObject() {
      var map = new Map(Object.entries(this.getSavedData()));
      return map;
    }
  }], [{
    key: "parseData",
    value: function parseData(data, purpose) {
      return new Flag(data, {
        purpose: purpose
      });
    }
  }]);

  return Flag;
}(_wrapNativeSuper(Map));

var parseData = Flag.parseData;
exports.parseData = parseData;
var _default = Flag;
exports["default"] = _default;