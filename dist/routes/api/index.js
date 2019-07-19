"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = _interopRequireDefault(require("./v1/index"));

var _index2 = _interopRequireDefault(require("./v2/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)({
  mergeParams: true
});
router.use('/v1', _index["default"]);
router.use('/v2', _index2["default"]);
var _default = router;
exports["default"] = _default;