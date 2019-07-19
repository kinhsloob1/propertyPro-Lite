"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.JwtManager = void 0;

var _crypto = require("crypto");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Token =
/*#__PURE__*/
function (_Map) {
  _inherits(Token, _Map);

  function Token() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Token);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Token).call(this));
    var _options$algorithim = options.algorithim,
        algorithim = _options$algorithim === void 0 ? 'HS512' : _options$algorithim,
        _options$secret = options.secret,
        secret = _options$secret === void 0 ? 'PropertyProLite' : _options$secret;

    _this.setValid(false);

    _this.setSecret(secret);

    _this.setAlgorithim(algorithim);

    return _this;
  }

  _createClass(Token, [{
    key: "decode",
    value: function decode() {
      var _this2 = this;

      var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (typeof token !== 'string') {
        return this.setValid(false);
      }

      var jwtParts = token.split('.');

      if (jwtParts.length !== 3) {
        return this.setValid(false);
      }

      var _jwtParts = _slicedToArray(jwtParts, 3),
          headerPartUrlString = _jwtParts[0],
          payloadPartUrlString = _jwtParts[1],
          signaturePartUrlString = _jwtParts[2];

      var payloadPart = null;
      var headerPart = null;

      try {
        headerPart = JSON.parse(Token.base64UrlDecode(headerPartUrlString));
        headerPart = new Map(Object.entries(headerPart));
        payloadPart = JSON.parse(Token.base64UrlDecode(payloadPartUrlString));
      } catch (e) {
        return this.setValid(false);
      }

      var alg = headerPart.get('alg');
      var type = headerPart.get('type');

      if (!(type === 'JWT' && alg === this.getAlgorithim())) {
        return this.setValid(false);
      }

      var receivedSignature = this.generateSignaturePart(headerPartUrlString, payloadPartUrlString);
      receivedSignature = Token.base64UrlEncode(receivedSignature, true);

      if (receivedSignature !== signaturePartUrlString) {
        return this.setValid(false);
      }

      var expires = payloadPart.expires || 0;

      if (Date.now() > expires) {
        return this.setValid(false);
      }

      Array.from(Object.entries(payloadPart)).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        _this2.set(key, value);
      });
      return this.setValid(true);
    }
  }, {
    key: "encode",
    value: function encode() {
      var userData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!(_typeof(userData) === 'object' && !Array.isArray(userData))) {
        return this.setValid(false);
      }

      var headerPartString = JSON.stringify({
        alg: this.getAlgorithim(),
        type: 'JWT'
      });
      headerPartString = Token.base64UrlEncode(headerPartString);
      var payloadPartString = JSON.stringify(_objectSpread({}, userData, {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000
      }));
      payloadPartString = Token.base64UrlEncode(payloadPartString);
      var signaturePartString = this.generateSignaturePart(headerPartString, payloadPartString);

      if (!signaturePartString) {
        return this.setValid(false);
      }

      signaturePartString = Token.base64UrlEncode(signaturePartString, true);
      return this.setValid(true).setJwt("".concat(headerPartString, ".").concat(payloadPartString, ".").concat(signaturePartString));
    }
  }, {
    key: "setJwt",
    value: function setJwt(jwt) {
      return this.set('_jwt', jwt);
    }
  }, {
    key: "getJwt",
    value: function getJwt() {
      return this.get('_jwt');
    }
  }, {
    key: "generateSignaturePart",
    value: function generateSignaturePart() {
      var headerPartUrlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var payloadPartUrlString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      try {
        return (0, _crypto.createHmac)('sha512', this.getSecret()).update("".concat(headerPartUrlString, ".").concat(payloadPartUrlString), 'utf8').digest('base64');
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "getAlgorithim",
    value: function getAlgorithim() {
      return this.get('_algorithim');
    }
  }, {
    key: "setAlgorithim",
    value: function setAlgorithim(algorithim) {
      this.set('_algorithim', algorithim);
      return this;
    }
  }, {
    key: "getSecret",
    value: function getSecret() {
      return this.get('_secret');
    }
  }, {
    key: "setSecret",
    value: function setSecret(secret) {
      this.set('_secret', secret);
      return this;
    }
  }, {
    key: "setValid",
    value: function setValid() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.set('_isValid', Boolean(type));
      return this;
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return this.has('_isValid') && this.get('_isValid') !== false;
    }
  }], [{
    key: "model",
    value: function model() {
      return new Token();
    }
  }, {
    key: "base64UrlEncode",
    value: function base64UrlEncode(data) {
      var isBase64 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var string = String(data);

      if (!isBase64) {
        string = Buffer.from(string, 'utf8').toString('base64');
      }

      return string.replace('+', '-').replace('/', '_');
    }
  }, {
    key: "base64UrlDecode",
    value: function base64UrlDecode(data) {
      var isBase64 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var string = String(data);

      if (!isBase64) {
        string = string.replace('-', '+').replace('_', '/');
      }

      return Buffer.from(string, 'base64').toString('utf8');
    }
  }]);

  return Token;
}(_wrapNativeSuper(Map));

var JwtManager = Token.model;
exports.JwtManager = JwtManager;
var _default = Token;
exports["default"] = _default;