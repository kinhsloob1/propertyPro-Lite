"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../../middlewares/property/index");

var _index2 = require("../../../../../controllers/properties/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.get('/', [_index.processProperty], _index2.getPropertyFlags);
var _default = router;
exports["default"] = _default;