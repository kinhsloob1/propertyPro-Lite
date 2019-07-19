"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _index = require("../../../../controllers/users/index");

var router = (0, _express.Router)({
  mergeParams: true
});
router.post('/signup', _index.addUser);
router.post('/signin', _index.logUser);
router.post('/:userEmail(\\S{1,}@\\S{1,}.\\S{1,})/reset_password', _index.resetUserPassword);
var _default = router;
exports["default"] = _default;