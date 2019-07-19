"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ensureUserHasPermission = void 0;

var _utils = require("../../controllers/utils");

var _index = require("../../controllers/users/index");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserMiddleware =
/*#__PURE__*/
function () {
  function UserMiddleware() {
    _classCallCheck(this, UserMiddleware);
  }

  _createClass(UserMiddleware, null, [{
    key: "ensureUserHasPermission",
    value: function ensureUserHasPermission(req, res, next) {
      var data = req.data;
      var user = (0, _index.getUser)(req);

      if (user instanceof Map) {
        var loggedUser = data.get('loggedUser');
        var loggedId = loggedUser.get('id');
        var isAdmin = loggedUser.get('is_admin');
        var isSameId = loggedId === user.get('id');

        if (!isAdmin) {
          if (!isSameId) {
            return (0, _utils.ReplyFor)('invalid-user-permission').send(res);
          }
        }

        data.set('User', user);
        return next();
      }

      return (0, _utils.Reply)('Invalid user... User not found').setStatusCode(404).send(res);
    }
  }]);

  return UserMiddleware;
}();

var ensureUserHasPermission = UserMiddleware.ensureUserHasPermission;
exports.ensureUserHasPermission = ensureUserHasPermission;
var _default = UserMiddleware;
exports["default"] = _default;