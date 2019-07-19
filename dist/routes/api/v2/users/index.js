"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../controllers/users/index");

var _index2 = require("../../../../middlewares/auth/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.route('/').get([_index2.enforceLogged, _index2.enforceUserIsAdministrator], _index.getUsers);
var _default = router;
exports["default"] = _default;