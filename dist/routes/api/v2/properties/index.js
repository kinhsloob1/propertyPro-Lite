"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../controllers/properties/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.route('/').get(_index.getProperties);
var _default = router;
exports["default"] = _default;