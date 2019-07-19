"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../middlewares/auth/index");

var _index2 = require("../../../../middlewares/user/index");

var _index3 = require("../../../../controllers/users/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.route('/').get([_index.enforceLogged, _index2.ensureUserHasPermission], _index3.getUserData).patch([_index.enforceLogged, _index2.ensureUserHasPermission], _index3.updateUser)["delete"]([_index.enforceLogged, _index2.ensureUserHasPermission], _index3.deleteUser);
var _default = router;
exports["default"] = _default;