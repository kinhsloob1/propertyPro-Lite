"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../middlewares/auth/index");

var _index2 = require("../../../../middlewares/property/index");

var _index3 = require("../../../../controllers/properties/index");

var _index4 = _interopRequireDefault(require("./sold/index"));

var _index5 = _interopRequireDefault(require("./flag/index"));

var _index6 = _interopRequireDefault(require("./flags/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)({
  mergeParams: true
});
router.post('/', _index.enforceLogged, _index3.addProperty);
router.route('/:propertyId').get([_index2.processProperty], _index3.getPropertyData).patch([_index2.processProperty, _index.enforceLogged, _index2.ensureUserHasPermission], _index3.updateProperty)["delete"]([_index2.processProperty, _index.enforceLogged, _index2.ensureUserHasPermission], _index3.deleteProperty);
router.use('/:propertyId/sold', _index4["default"]);
router.use('/:propertyId/flag', _index5["default"]);
router.use('/:propertyId/flags', _index6["default"]);
var _default = router;
exports["default"] = _default;