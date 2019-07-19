"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = _interopRequireDefault(require("./auth/index"));

var _index2 = _interopRequireDefault(require("./user/index"));

var _index3 = _interopRequireDefault(require("./properties/index"));

var _index4 = _interopRequireDefault(require("./property/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)({
  mergeParams: true
});
router.use('/auth', _index["default"]);
router.use('/user/:id', _index2["default"]);
router.use('/properties', _index3["default"]);
router.use('/property', _index4["default"]);
var _default = router;
exports["default"] = _default;