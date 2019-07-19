"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = require("path");

var _dotenv = require("dotenv");

var _storage = _interopRequireDefault(require("../models/storage"));

var _index = require("../middlewares/index");

var _index2 = require("../middlewares/auth/index");

var _index3 = _interopRequireDefault(require("../routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default() {
  (0, _dotenv.config)();
  var store = new _storage["default"]();
  var app = (0, _express["default"])();
  app.set('x-powered-by', false);
  app.set('views', (0, _path.join)(__dirname, '../../views'));
  app.set('view engine', 'ejs');
  app.use('/api/v1', _express["default"]["static"]((0, _path.resolve)(__dirname, '../../public')));
  app.use(_express["default"].json());
  app.use(_express["default"].urlencoded({
    extended: true
  }));
  app.use((0, _index.init)(store));
  app.use(_index2.processLogged);
  app.use('/', _index3["default"]);
  app.use(_index.processInvalidRequest);
  app.use(_index.catchAllErrors);
  return app;
};

exports["default"] = _default;