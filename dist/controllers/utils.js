"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ReplyFor = exports.Reply = void 0;

var _reply = _interopRequireDefault(require("./reply"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "reply",
    value: function reply() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var other = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var boolType = Boolean(type);
      var reply = new _reply["default"]();
      reply.setMessage(message).setStatus(boolType).setObjectData(other);
      return reply;
    }
  }, {
    key: "replyFor",
    value: function replyFor(type) {
      switch (type) {
        case 'server-error':
          return Utils.reply('An error occured with th server... Please try again later').setStatusCode(500);

        case 'invalid-request':
          return Utils.reply('Invalid request').setStatusCode(400);

        case 'storage-notfound':
          return Utils.reply('An error occured with the storage... Please try again later').setStatusCode(500);

        case 'invalid-user':
          return Utils.reply('Invalid user. Login to continue').setStatusCode(401).addHeader('WWW-Authenticate', 'Bearer realm="Bearer token required", charset = "UTF-8"');

        case 'invalid-token-assigned':
          return Utils.reply('Ooops a server error occured.. Please try again later').setStatusCode(500);

        case 'user-deleted':
          return Utils.reply('Ooops your account has been deleted from the system').setStatusCode(410);

        case 'invalid-user-permission':
          return Utils.reply('Ooops you dont have appropriate permission.').setStatusCode(403);

        case 'invalid-property':
          return Utils.reply('Ooops property does not exists').setStatusCode(404);

        case 'invalid-property-flag':
          return Utils.reply('Ooops property flag does not exists').setStatusCode(404);

        default:
          return Utils.reply('An error occured').setStatusCode(400);
      }
    }
  }]);

  return Utils;
}();

var Reply = Utils.reply,
    ReplyFor = Utils.replyFor;
exports.ReplyFor = ReplyFor;
exports.Reply = Reply;
var _default = Utils;
exports["default"] = _default;