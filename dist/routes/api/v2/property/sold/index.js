"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../../middlewares/auth/index");

var _index2 = require("../../../../../middlewares/property/index");

var _index3 = require("../../../../../controllers/properties/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.patch('/', [_index2.processProperty, _index.enforceLogged, _index2.ensureUserHasPermission], _index3.setPropertySold);
var _default = router;
exports["default"] = _default;