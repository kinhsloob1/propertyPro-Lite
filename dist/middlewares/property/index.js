"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ensureUserHasPermission = exports.processProperty = void 0;

var _utils = require("../../controllers/utils");

var _index = require("../../controllers/properties/index");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PropertyMiddleware =
/*#__PURE__*/
function () {
  function PropertyMiddleware() {
    _classCallCheck(this, PropertyMiddleware);
  }

  _createClass(PropertyMiddleware, null, [{
    key: "processProperty",
    value: function processProperty(req, res, next) {
      var data = req.data;
      var property = (0, _index.getProperty)(req);
      var isLogged = data.get('logged');
      var isAdmin = isLogged && data.get('loggedUser').get('is_admin');

      if (!(property instanceof Map)) {
        return (0, _utils.ReplyFor)('invalid-property').send(res);
      }

      if (property.get('is_blocked')) {
        if (!isAdmin) {
          var reply = (0, _utils.ReplyFor)('invalid-user-permission');
          reply.setMessage('Ooops.. property is blocked temporaly and is being reviewed by administrators.. Please try again later');
          return reply.send(res);
        }
      }

      data.set('Property', property);
      return next();
    }
  }, {
    key: "ensureUserHasPermission",
    value: function ensureUserHasPermission(req, res, next) {
      var data = req.data;
      var loggedUser = data.get('loggedUser');
      var isAdmin = loggedUser.get('is_admin');
      var property = data.get('Property');
      var owner = property.get('ownerMap');
      var isOwner = loggedUser.get('id') === owner.get('id');

      if (!(isOwner || isAdmin)) {
        var reply = (0, _utils.ReplyFor)('invalid-user-permission');
        reply.setMessage('Ooops.. you dont have valid property permission');
        return reply.send(res);
      }

      return next();
    }
  }]);

  return PropertyMiddleware;
}();

var processProperty = PropertyMiddleware.processProperty,
    ensureUserHasPermission = PropertyMiddleware.ensureUserHasPermission;
exports.ensureUserHasPermission = ensureUserHasPermission;
exports.processProperty = processProperty;
var _default = PropertyMiddleware;
exports["default"] = _default;