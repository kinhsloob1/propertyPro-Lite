"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.parseData = void 0;

var _crypto = require("crypto");

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

var User =
/*#__PURE__*/
function (_Map) {
  _inherits(User, _Map);

  function User(data, _ref) {
    var _this;

    var _ref$purpose = _ref.purpose,
        purpose = _ref$purpose === void 0 ? 'user' : _ref$purpose;

    _classCallCheck(this, User);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(User).call(this));

    _this.set('_isValid', false);

    _this.set('_purpose', purpose);

    if (_typeof(data) === 'object') {
      _this.parseData(data);
    }

    return _this;
  }

  _createClass(User, [{
    key: "parseData",
    value: function parseData(_ref2) {
      var _ref2$id = _ref2.id,
          id = _ref2$id === void 0 ? null : _ref2$id,
          _ref2$email = _ref2.email,
          email = _ref2$email === void 0 ? null : _ref2$email,
          _ref2$login = _ref2.login,
          login = _ref2$login === void 0 ? null : _ref2$login,
          _ref2$first_name = _ref2.first_name,
          firstName = _ref2$first_name === void 0 ? null : _ref2$first_name,
          _ref2$last_name = _ref2.last_name,
          lastName = _ref2$last_name === void 0 ? null : _ref2$last_name,
          _ref2$password = _ref2.password,
          password = _ref2$password === void 0 ? null : _ref2$password,
          _ref2$password_confir = _ref2.password_confirmation,
          passwordConfirmation = _ref2$password_confir === void 0 ? null : _ref2$password_confir,
          _ref2$new_password = _ref2.new_password,
          newPassword = _ref2$new_password === void 0 ? null : _ref2$new_password,
          _ref2$can_remember = _ref2.can_remember,
          canRemember = _ref2$can_remember === void 0 ? null : _ref2$can_remember,
          _ref2$phoneNumber = _ref2.phoneNumber,
          phoneNumber = _ref2$phoneNumber === void 0 ? null : _ref2$phoneNumber,
          _ref2$address = _ref2.address,
          address = _ref2$address === void 0 ? null : _ref2$address,
          _ref2$is_admin = _ref2.is_admin,
          isAdmin = _ref2$is_admin === void 0 ? null : _ref2$is_admin,
          _ref2$is_verified = _ref2.is_verified,
          isVerified = _ref2$is_verified === void 0 ? null : _ref2$is_verified,
          _ref2$created_on = _ref2.created_on,
          createdOn = _ref2$created_on === void 0 ? null : _ref2$created_on;
      var purpose = this.get('_purpose');
      var isForUser = purpose === 'user';
      var isForUpdate = purpose === 'updateData';
      var isForRegistration = purpose === 'registration';
      var isForLogin = purpose === 'login';
      var isForReset = purpose === 'reset';
      var errors = [];
      var value = String(id);
      var valueLength = 0;

      if (isForUser) {
        if (id === null || !(value.match(/^\d{1,}$/) && parseInt(id, 10) > 0)) {
          errors.push('user id is required');
        } else {
          this.set('id', parseInt(id, 10));
        }
      }

      value = String(login);

      if (isForLogin) {
        if (login === null) {
          errors.push('Invalid login is required Please insert your email address');
        } else if (!value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
          errors.push('Invalid login specified... Please insert your registered email address');
        } else {
          this.set('login', value);
        }
      }

      value = String(email);

      if (isForRegistration || isForLogin || isForUser) {
        if (email === null) {
          if (isForUser || isForRegistration) {
            errors.push('Invalid email address');
          }
        } else if (!value.match(/^\S{1,255}@\S{2,30}\.\S{2,20}$/)) {
          errors.push('Invalid email address.');
        } else {
          this.set('email', value);
        }
      }

      value = String(firstName);
      valueLength = value.length;

      if (firstName === null) {
        if (isForUser || isForRegistration) {
          errors.push('Invalid first name');
        }
      } else if (!(valueLength >= 3 && valueLength <= 255)) {
        errors.push('First name should be above 3 charcters and below 255 characters.');
      } else if (!value.match(/^\S{1,}$/)) {
        errors.push('Invalid characters as first name');
      } else {
        this.set('first_name', value.toLowerCase());
      }

      value = String(lastName);
      valueLength = value.length;

      if (lastName === null) {
        if (isForUser || isForRegistration) {
          errors.push('Invalid last name');
        }
      } else if (!(valueLength >= 3 && valueLength <= 255)) {
        errors.push('Last name should be above 3 charcters and below 255 characters.');
      } else if (!value.match(/^\S{1,}$/)) {
        errors.push('Invalid characters as last name');
      } else {
        this.set('last_name', value.toLowerCase());
      }

      value = Boolean(canRemember);

      if (isForReset) {
        if (canRemember === null) {
          errors.push('Please select the option asking if you remember your password');
        } else {
          this.set('can_remember', value);
        }
      }

      value = String(password);
      valueLength = value.length;

      if (isForUpdate || isForRegistration || isForLogin || isForUser || isForReset) {
        if (password === null) {
          if (isForRegistration || isForLogin || isForUser || isForReset && canRemember) {
            errors.push('Invalid password... please insert your password');
          }
        } else if (!(valueLength >= 3 && valueLength <= 255)) {
          errors.push('Password should be above 3 charcters and below 255 characters.');
        } else {
          this.set('password', (0, _crypto.createHash)('sha512').update(value).digest('hex'));
        }

        value = String(passwordConfirmation);

        if (passwordConfirmation === null) {
          if (isForRegistration) {
            errors.push('Password confirmation is required');
          }
        } else if (!(this.getPassword() === (0, _crypto.createHash)('sha512').update(value).digest('hex'))) {
          errors.push('Passwords does not match');
        }

        if (isForReset && canRemember) {
          value = String(newPassword);
          valueLength = value.length;
          var newPasswordDigest = (0, _crypto.createHash)('sha512').update(value).digest('hex');

          if (newPassword === null) {
            errors.push('new password is required');
          } else if (!(valueLength >= 3 && valueLength <= 255)) {
            errors.push('new password should be above 3 charcters and below 255 characters');
          } else if (!this.getPassword()) {
            errors.push('current account password is required');
          } else if (this.getPassword() === newPasswordDigest) {
            errors.push('new password must be different from previous password');
          } else if (passwordConfirmation === null) {
            errors.push('new password confirmation is required');
          } else if ((0, _crypto.createHash)('sha512').update(passwordConfirmation).digest('hex') !== newPasswordDigest) {
            errors.push('Password confirmayion does not match new password');
          } else {
            this.set('new_password', newPasswordDigest);
          }
        }
      }

      value = String(phoneNumber);

      if (phoneNumber === null) {
        if (isForUser || isForRegistration) {
          errors.push('Invalid phone number');
        }
      } else if (!value.match(/^\d{11,15}$/)) {
        errors.push('Phone number must be 11 digits or at most 15 digits only');
      } else {
        this.set('phoneNumber', value);
      }

      value = String(address);

      if (address === null) {
        if (isForUser || isForRegistration) {
          errors.push('Invalid address');
        }
      } else if (!value.match(/^[\S]{1,}[\d\s\S]{5,255}$/)) {
        errors.push('Invalid address.. please insert a valid address');
      } else {
        this.set('address', value.toLowerCase());
      }

      value = Boolean(isAdmin);

      if (isForUser) {
        if (isAdmin === null) {
          errors.push('user admin status is required');
        } else if (![true, false].includes(value)) {
          errors.push('Invalid user admin status');
        } else {
          this.set('is_admin', value);
        }

        value = Boolean(isVerified);

        if (isVerified === null) {
          errors.push('user verification status is required');
        } else if (![true, false].includes(value)) {
          errors.push('Invalid user verification status');
        } else {
          this.set('is_verified', value);
        }

        if (createdOn === null) {
          errors.push('Invalid user created date');
        } else if (!Date.parse(createdOn)) {
          errors.push('Ooops... invalid user created date');
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
    key: "getFirstName",
    value: function getFirstName() {
      return this.get('first_name');
    }
  }, {
    key: "getLastName",
    value: function getLastName() {
      return this.get('last_name');
    }
  }, {
    key: "getLogin",
    value: function getLogin() {
      return this.get('login');
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.get('id');
    }
  }, {
    key: "getEmail",
    value: function getEmail() {
      return this.get('email');
    }
  }, {
    key: "getPassword",
    value: function getPassword() {
      return this.get('password');
    }
  }, {
    key: "getPhoneNumber",
    value: function getPhoneNumber() {
      return this.get('phoneNumber');
    }
  }, {
    key: "getAdrress",
    value: function getAdrress() {
      return this.get('address');
    }
  }, {
    key: "getIsVerified",
    value: function getIsVerified() {
      return this.get('is_verified');
    }
  }, {
    key: "getisAdmin",
    value: function getisAdmin() {
      return this.get('is_admin');
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
      return _get(_getPrototypeOf(User.prototype), "has", this).call(this, key) ? _get(_getPrototypeOf(User.prototype), "get", this).call(this, key) : null;
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
      return new User(data, {
        purpose: purpose
      });
    }
  }]);

  return User;
}(_wrapNativeSuper(Map));

var parseData = User.parseData;
exports.parseData = parseData;
var _default = User;
exports["default"] = _default;