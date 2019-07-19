"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../../middlewares/auth/index");

var _index2 = require("../../../../../middlewares/property/index");

var _index3 = require("../../../../../middlewares/property/flag/index");

var _index4 = require("../../../../../controllers/properties/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.post('/', [_index2.processProperty, _index.enforceLogged], _index4.flagProperty);
router.route('/:propertyFlagId').patch([_index2.processProperty, _index3.processPropertyFlag, _index.enforceLogged, _index3.ensureUserHasPermission], _index4.updatePropertyFlag)["delete"]([_index2.processProperty, _index3.processPropertyFlag, _index.enforceLogged, _index3.ensureUserHasPermission], _index4.deletePropertyFlag);
var _default = router;
exports["default"] = _default;