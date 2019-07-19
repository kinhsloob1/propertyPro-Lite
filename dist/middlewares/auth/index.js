"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.enforceUserIsAdministrator = exports.enforceLogged = exports.processLogged = void 0;

var _utils = require("../../controllers/utils");

var _token = require("../../controllers/token");

var _index = require("../../controllers/users/index");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthMiddleware =
/*#__PURE__*/
function () {
  function AuthMiddleware() {
    _classCallCheck(this, AuthMiddleware);
  }

  _createClass(AuthMiddleware, null, [{
    key: "enforceLogged",
    value: function enforceLogged(req, res, next) {
      var data = req.data;
      var loggedData = data.get('loggedData');
      var knownUser = data.get('loggedUser');

      if (!(data.get('logged') && knownUser instanceof Map)) {
        return (0, _utils.ReplyFor)('invalid-user').send(res);
      }

      if (knownUser.size === 0) {
        return (0, _utils.Reply)('Ooops.. user account deleted', false).setStatusCode(410).send(res);
      }

      var loggedId = loggedData.get('id');
      var loggedRegisterTime = new Date(loggedData.get('created_on'));
      var knownId = knownUser.get('id');
      var knownRegisterTime = knownUser.get('created_on');
      var isSameId = loggedId === knownId;
      var isSameTimestamp = loggedRegisterTime.getTime() === knownRegisterTime.getTime();

      if (!isSameId) {
        return (0, _utils.ReplyFor)('invalid-user').send(res);
      }

      if (!isSameTimestamp) {
        return (0, _utils.Reply)('Ooops... Either your account has been removed or your token is invalid. Try authenticating again and if the problem persists, Do well to contact an administrator').setStatusCode(410).send(res);
      }

      if (knownUser.get('is_blocked')) {
        return (0, _utils.Reply)('Ooops... you have been blocked from using this platform.. please contact support if you don understand this').setStatusCode(403).send(res);
      }

      return next();
    }
  }, {
    key: "processLogged",
    value: function processLogged(req, res, next) {
      var data = req.data;
      var token = req.get('Bearer');
      var tokenManager = (0, _token.JwtManager)().decode(token);

      if (!tokenManager.isValid()) {
        data.set('logged', false);
      } else {
        data.set('logged', true);
        data.set('loggedData', tokenManager);
        var user = (0, _index.getUserById)(tokenManager.get('id'))(req);

        if (user.isOk()) {
          user = user.get('data');
        } else {
          user = new Map();
        }

        data.set('loggedUser', user);
      }

      return next();
    }
  }, {
    key: "enforceUserIsAdministrator",
    value: function enforceUserIsAdministrator(req, res, next) {
      var data = req.data;

      if (!(data.get('loggedUser') instanceof Map)) {
        return (0, _utils.ReplyFor)('invalid-user').send(res);
      }

      if (data.get('envs').get('NODE_ENV') !== 'test') {
        if (!data.get('is_admin')) {
          return (0, _utils.Reply)('Ooops... you dont have access to this information').setStatusCode(403).send(res);
        }
      }

      return next();
    }
  }]);

  return AuthMiddleware;
}();

var processLogged = AuthMiddleware.processLogged,
    enforceLogged = AuthMiddleware.enforceLogged,
    enforceUserIsAdministrator = AuthMiddleware.enforceUserIsAdministrator;
exports.enforceUserIsAdministrator = enforceUserIsAdministrator;
exports.enforceLogged = enforceLogged;
exports.processLogged = processLogged;
var _default = AuthMiddleware;
exports["default"] = _default;