"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ensureUserHasPermission = exports.processPropertyFlag = void 0;

var _utils = require("../../../controllers/utils");

var _index = require("../../../controllers/properties/index");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PropertyFlagMiddleware =
/*#__PURE__*/
function () {
  function PropertyFlagMiddleware() {
    _classCallCheck(this, PropertyFlagMiddleware);
  }

  _createClass(PropertyFlagMiddleware, null, [{
    key: "processPropertyFlag",
    value: function processPropertyFlag(req, res, next) {
      var data = req.data;
      var flag = (0, _index.getPropertyFlag)(req);

      if (!(flag instanceof Map)) {
        return (0, _utils.ReplyFor)('invalid-property-flag').send(res);
      }

      data.set('PropertyFlag', flag);
      return next();
    }
  }, {
    key: "ensureUserHasPermission",
    value: function ensureUserHasPermission(req, res, next) {
      var data = req.data;
      var loggedUser = data.get('loggedUser');
      var isAdmin = loggedUser.get('is_admin');
      var propertyFlag = data.get('PropertyFlag');
      var owner = propertyFlag.get('ownerMap');
      var isOwner = loggedUser.get('id') === owner.get('id');

      if (!(isOwner || isAdmin)) {
        var reply = (0, _utils.ReplyFor)('invalid-user-permission');
        reply.setMessage('Ooops.. you dont have valid property permission');
        return reply.send(res);
      }

      return next();
    }
  }]);

  return PropertyFlagMiddleware;
}();

var processPropertyFlag = PropertyFlagMiddleware.processPropertyFlag,
    ensureUserHasPermission = PropertyFlagMiddleware.ensureUserHasPermission;
exports.ensureUserHasPermission = ensureUserHasPermission;
exports.processPropertyFlag = processPropertyFlag;
var _default = PropertyFlagMiddleware;
exports["default"] = _default;