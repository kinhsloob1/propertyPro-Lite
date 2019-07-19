"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _application = _interopRequireDefault(require("./application"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var port = process.env.PORT || 3000;

var _default = (0, _application["default"])().listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});

exports["default"] = _default;