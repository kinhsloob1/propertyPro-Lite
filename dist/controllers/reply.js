"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Reply =
/*#__PURE__*/
function (_Map) {
  _inherits(Reply, _Map);

  function Reply() {
    _classCallCheck(this, Reply);

    return _possibleConstructorReturn(this, _getPrototypeOf(Reply).apply(this, arguments));
  }

  _createClass(Reply, [{
    key: "isOk",
    value: function isOk() {
      return this.getStatus() === 'success';
    }
  }, {
    key: "setMessage",
    value: function setMessage() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.set('_message', message ? String(message) : '');
      return this;
    }
  }, {
    key: "setStatus",
    value: function setStatus() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.set('_status', status ? 'success' : 'error');
      return this;
    }
  }, {
    key: "setStatusCode",
    value: function setStatusCode() {
      var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.set('_statusCode', code ? parseInt(code, 10) : 0);
      return this;
    }
  }, {
    key: "setObjectData",
    value: function setObjectData() {
      var _this = this;

      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var additionalData = _typeof(obj) === 'object' && !Array.isArray(obj) ? obj : {};
      Object.keys(additionalData).forEach(function (key) {
        _this.set(key, obj[key]);
      });
      return this;
    }
  }, {
    key: "getStatusCode",
    value: function getStatusCode() {
      var code = this.get('_statusCode');

      if (code === 0) {
        if (this.isOk()) {
          return 200;
        }

        return 404;
      }

      return code;
    }
  }, {
    key: "getMessage",
    value: function getMessage() {
      var message = this.get('_message');

      if (message === '') {
        if (this.isOk()) {
          return 'Task completed successfully';
        }

        return 'An error occured';
      }

      return message;
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.get('_status');
    }
  }, {
    key: "getResponseObject",
    value: function getResponseObject() {
      var data = {};
      var otherData = Array.from(this.entries()).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            key = _ref2[0];

        if (typeof key === 'string') {
          if (key.substr(0, 1) !== '_') {
            return true;
          }
        }

        return false;
      });
      otherData.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        data[key] = value;
      });
      data.status = this.getStatus();

      if (!this.isOk()) {
        data.error = this.getMessage();
      } else {
        data.message = this.getMessage();
      }

      return data;
    }
  }, {
    key: "send",
    value: function send(res) {
      var headers = this.getHeaders();
      headers.forEach(function (header) {
        return res.set.apply(res, _toConsumableArray(header));
      });
      return res.status(this.getStatusCode()).json(this.getResponseObject());
    }
  }, {
    key: "addHeader",
    value: function addHeader() {
      var headers = [];

      if (this.has('_headers')) {
        headers = this.get('_headers');
      }

      for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
        data[_key] = arguments[_key];
      }

      headers.push(data);
      return this.set('_headers', headers);
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      var headers = this.get('_headers');

      if (!Array.isArray(headers)) {
        headers = [];
      }

      return headers;
    }
  }]);

  return Reply;
}(_wrapNativeSuper(Map));

var _default = Reply;
exports["default"] = _default;