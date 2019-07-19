"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resetUserPassword = exports.getUsers = exports.getUserObject = exports.getUserById = exports.deleteUser = exports.updateUser = exports.getUserData = exports.getUser = exports.logUser = exports.addUser = exports.UsersDb = void 0;

var _crypto = require("crypto");

var _utils = require("../utils");

var _token = require("../token");

var _index = require("./user/index");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Users =
/*#__PURE__*/
function () {
  function Users() {
    _classCallCheck(this, Users);
  }

  _createClass(Users, null, [{
    key: "getDb",
    value: function getDb(req) {
      var data = req.data;
      var db = data.get('database');

      if (!db.hasStorage('users')) {
        db.createStorage('users');
      }

      return db.getStorage('users');
    }
  }, {
    key: "addUser",
    value: function addUser(req, res) {
      var registrationData = req.body;
      var userData = (0, _index.parseData)(registrationData, 'registration');

      if (!userData.isValid()) {
        return (0, _utils.Reply)(userData.getError()).setStatusCode(400).send(res);
      }

      var UsersDb = Users.getDb(req);
      var users = Array.from(UsersDb);
      var hasEmail = users.find(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            user = _ref2[1];

        return user.get('email') === userData.getEmail();
      });

      if (hasEmail) {
        return (0, _utils.Reply)('Email already registered... If you are the owner please try logging in').setStatusCode(400).send(res);
      }

      var id = UsersDb.size > 0 ? parseInt(Array.from(UsersDb.keys()).pop(), 10) + 1 : 1;
      userData.set('is_verified', false).set('is_blocked', false).set('is_admin', false).set('id', id).set('created_on', new Date());
      UsersDb.set(id, userData.getSavedMapObject());

      var _userData$getSavedDat = userData.getSavedData(),
          password = _userData$getSavedDat.password,
          savedData = _objectWithoutProperties(_userData$getSavedDat, ["password"]);

      var tokenManager = (0, _token.JwtManager)().encode({
        id: userData.get('id'),
        created_on: userData.get('created_on')
      });

      if (!tokenManager.isValid()) {
        UsersDb["delete"](id);
        return (0, _utils.ReplyFor)('invalid-token-assigned').send(res);
      }

      var token = tokenManager.getJwt();
      return (0, _utils.Reply)('User registered succesfully', true, {
        data: _objectSpread({}, savedData, {
          token: token
        })
      }).setStatusCode(200).send(res);
    }
  }, {
    key: "logUser",
    value: function logUser(req, res) {
      var data = req.body;
      var userData = (0, _index.parseData)(data, 'login');

      if (!userData.isValid()) {
        return (0, _utils.Reply)(userData.getError()).setStatusCode(400).send(res);
      }

      var UsersDb = Users.getDb(req);
      var login = userData.getLogin();
      var password = userData.getPassword();
      var userId = Array.from(UsersDb.keys()).find(function (key) {
        var user = UsersDb.get(key);

        if (user instanceof Map) {
          if (user.get('email') === login && user.get('password') === password) {
            return true;
          }
        }

        return false;
      });
      var User = UsersDb.get(userId);

      if (!(userId && User instanceof Map)) {
        return (0, _utils.Reply)('User does not exists').setStatusCode(404).send(res);
      }

      var userObject = Array.from(User.entries()).reduce(function (obj, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        var object = obj;
        object[key] = value;
        return obj;
      }, {});

      var pass = userObject.password,
          outData = _objectWithoutProperties(userObject, ["password"]);

      var tokenManager = (0, _token.JwtManager)().encode({
        id: User.get('id'),
        created_on: User.get('created_on')
      });

      if (!tokenManager.isValid()) {
        return (0, _utils.ReplyFor)('invalid-token-assigned').send(res);
      }

      var token = tokenManager.getJwt();
      return (0, _utils.Reply)('user logged succesfully', true, {
        data: _objectSpread({}, outData, {
          token: token
        })
      }).setStatusCode(200).send(res);
    }
  }, {
    key: "getUser",
    value: function getUser(req) {
      var userDb = Users.getDb(req);
      var userId = parseInt(req.params.id, 10) || 0;
      return userDb.get(userId);
    }
  }, {
    key: "getUserData",
    value: function getUserData(req, res) {
      var data = req.data;
      var userAccount = data.get('User');
      var userObject = Users.getUserObject(userAccount);

      if (!userObject.isOk()) {
        return (0, _utils.Reply)('Invalid user').send(res);
      }

      userObject = userObject.get('Object');
      var reply = (0, _utils.Reply)('User fetched succesfully', true).setStatusCode(200);
      reply.setObjectData({
        data: userObject
      });
      return reply.send(res);
    }
  }, {
    key: "updateUser",
    value: function updateUser(req, res) {
      var updateData = req.body,
          data = req.data;
      var userAccount = data.get('User');
      var userData = (0, _index.parseData)(updateData, 'updateData');

      if (!userData.isValid()) {
        return (0, _utils.Reply)(userData.getError()).setStatusCode(400).send(res);
      }

      var userObject = userData.getSavedData();
      var updatedDataCount = 0;
      Object.entries(userObject).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            key = _ref6[0],
            value = _ref6[1];

        userAccount.set(key, value);
        updatedDataCount += 1;
      });

      if (updatedDataCount === 0) {
        return (0, _utils.Reply)('Ooops... no data to update', false).setStatusCode(400).send(res);
      }

      var password = userObject.password,
          outData = _objectWithoutProperties(userObject, ["password"]);

      return (0, _utils.Reply)('User data updated succesfully', true).setStatusCode(200).setObjectData({
        data: _objectSpread({}, outData)
      }).send(res);
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(req, res) {
      var data = req.data;
      var userAccount = data.get('User');
      var usersDb = Users.getDb(req);
      usersDb["delete"](userAccount.get('id'));
      return (0, _utils.Reply)('User removed succesfully succesfully').setStatusCode(204).send(res);
    }
  }, {
    key: "getUserById",
    value: function getUserById(id) {
      return function (req) {
        var UsersDb = Users.getDb(req);
        var User = UsersDb.get(id);

        if (User instanceof Map) {
          return (0, _utils.Reply)('User found', true, {
            data: User
          });
        }

        return (0, _utils.Reply)('User not found');
      };
    }
  }, {
    key: "getUserObject",
    value: function getUserObject(user) {
      if (!(user instanceof Map)) {
        return (0, _utils.Reply)('Invalid user');
      }

      var userObject = Array.from(user.entries()).reduce(function (obj, _ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            key = _ref8[0],
            value = _ref8[1];

        var object = obj;
        object[key] = value;
        return obj;
      }, {});

      var password = userObject.password,
          userData = _objectWithoutProperties(userObject, ["password"]);

      return (0, _utils.Reply)('User', true, {
        Object: userData
      });
    }
  }, {
    key: "getUsers",
    value: function getUsers(req, res) {
      var _req$query = req.query,
          _req$query$limit = _req$query.limit,
          limit = _req$query$limit === void 0 ? 12 : _req$query$limit,
          _req$query$offset = _req$query.offset,
          offset = _req$query$offset === void 0 ? 0 : _req$query$offset;
      var UsersDb = Users.getDb(req);
      var out = [];
      var offsetCount = 0;
      Array.from(UsersDb.keys()).forEach(function (key) {
        var user = UsersDb.get(key);

        if (user.get('is_blocked')) {
          return;
        }

        var userObject = Users.getUserObject(user);

        if (userObject.isOk()) {
          if (offsetCount < offset) {
            offsetCount += 1;
          } else if (out.length < limit) {
            out.push(userObject.get('Object'));
          }
        }
      });
      var reply = (0, _utils.Reply)('Users list', true);
      reply.setStatusCode(200);
      reply.setObjectData({
        data: out
      });
      return reply.send(res);
    }
  }, {
    key: "resetUserPassword",
    value: function resetUserPassword(req, res) {
      var userEmail = req.params.userEmail,
          data = req.data,
          clientResetData = req.body;
      var resetData = (0, _index.parseData)(clientResetData, 'reset');

      if (!resetData.isValid()) {
        return (0, _utils.Reply)(resetData.getError()).setStatusCode(400).send(res);
      }

      var UsersDb = Users.getDb(req);
      var userId = Array.from(UsersDb.keys()).find(function (key) {
        var user = UsersDb.get(key);

        if (user instanceof Map) {
          if (user.get('email') === userEmail) {
            return true;
          }
        }

        return false;
      });
      var User = UsersDb.get(userId);

      if (!(userId && User instanceof Map)) {
        return (0, _utils.Reply)('email address is not registered').setStatusCode(404).send(res);
      }

      var canRemember = resetData.get('can_remember');
      var newPassword = resetData.get('new_password');

      if (canRemember) {
        User.set('password', newPassword);
        return res.status(200).json({
          status: 204
        });
      }

      var passwordString = (0, _crypto.randomBytes)(10).toString('hex').substr(0, 10);
      var passwordData = (0, _index.parseData)({
        password: passwordString,
        password_confirmation: passwordString
      }, 'update');

      if (!passwordData.isValid()) {
        return (0, _utils.ReplyFor)('server-error').send(res);
      }

      return _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var mailer, mailData;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                mailer = data.get('mailer');
                mailData = {
                  from: "Support <support@".concat(req.get('host'), ">"),
                  to: userEmail,
                  subject: 'Kingsley property-pro-lite Account Password Reset',
                  template: 'new_password_mail',
                  first_name: User.get('first_name'),
                  new_password: passwordString
                };
                _context.prev = 2;
                _context.next = 5;
                return new Promise(function (resolve, reject) {
                  mailer.messages().send(mailData, function (error, body) {
                    if (error) {
                      return reject(error);
                    }

                    return resolve(body);
                  });
                });

              case 5:
                User.set('password', passwordData.get('password'));
                return _context.abrupt("return", res.status(200).json({
                  status: 204
                }));

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                return _context.abrupt("return", (0, _utils.Reply)('An error occured while sending password reset mail').setStatusCode(500).send(res));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
      }))();
    }
  }]);

  return Users;
}();

var UsersDb = Users.getDb,
    addUser = Users.addUser,
    logUser = Users.logUser,
    getUser = Users.getUser,
    getUserData = Users.getUserData,
    updateUser = Users.updateUser,
    deleteUser = Users.deleteUser,
    getUserById = Users.getUserById,
    getUserObject = Users.getUserObject,
    getUsers = Users.getUsers,
    resetUserPassword = Users.resetUserPassword;
exports.resetUserPassword = resetUserPassword;
exports.getUsers = getUsers;
exports.getUserObject = getUserObject;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUserData = getUserData;
exports.getUser = getUser;
exports.logUser = logUser;
exports.addUser = addUser;
exports.UsersDb = UsersDb;
var _default = Users;
exports["default"] = _default;