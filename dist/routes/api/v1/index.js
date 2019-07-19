"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var router = (0, _express.Router)({
  mergeParams: true
});
router.get('/', function (req, res) {
  return res.render('index');
});
router.get('/auth/signup', function (req, res) {
  return res.render('register');
});
router.get('/auth/signin', function (req, res) {
  return res.render('login');
});
router.get('/auth/password-reset', function (req, res) {
  return res.render('forgotPassword');
});
router.get('/property/:propertyId([0-9]{1,})/edit', function (req, res) {
  return res.render('editProperty');
});
router.get('/property/:propertyId([0-9]{1,})/', function (req, res) {
  return res.render('property');
});
router.get('/property/add', function (req, res) {
  return res.render('addProperty');
});
router.get('/properties', function (req, res) {
  return res.render('properties');
});
var _default = router;
exports["default"] = _default;