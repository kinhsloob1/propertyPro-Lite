"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.processInvalidRequest = exports.catchAllErrors = exports.init = void 0;

var _mailgunJs = _interopRequireDefault(require("mailgun-js"));

var _utils = require("../controllers/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var generalMiddleware =
/*#__PURE__*/
function () {
  function generalMiddleware() {
    _classCallCheck(this, generalMiddleware);
  }

  _createClass(generalMiddleware, null, [{
    key: "init",
    value: function init(database) {
      return function (req, res, next) {
        if (!(database instanceof Map)) {
          return (0, _utils.ReplyFor)('storage-notfound').send(res);
        }

        req.data = new Map();
        req.data.set('envs', new Map(Object.entries(process.env))).set('database', database).set('mailer', (0, _mailgunJs["default"])({
          apiKey: req.data.get('envs').get('MAILGUN_API_KEY') || 'dummystring',
          domain: req.get('host'),
          endpoint: '/v3'
        }));
        return next();
      };
    }
  }, {
    key: "processInvalidRequest",
    value: function processInvalidRequest(req, res) {
      return (0, _utils.ReplyFor)('invalid-request').send(res);
    }
  }, {
    key: "catch",
    value: function _catch(err, req, res, next) {
      if (err) {
        return (0, _utils.ReplyFor)(null).setMessage(err).send(res);
      }

      return next();
    }
  }]);

  return generalMiddleware;
}();

var init = generalMiddleware.init,
    catchAllErrors = generalMiddleware["catch"],
    processInvalidRequest = generalMiddleware.processInvalidRequest;
exports.processInvalidRequest = processInvalidRequest;
exports.catchAllErrors = catchAllErrors;
exports.init = init;
var _default = generalMiddleware;
exports["default"] = _default;