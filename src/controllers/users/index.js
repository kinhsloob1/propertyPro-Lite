import { Reply, ReplyFor } from '../utils';
import { JwtManager } from '../token';
import { parseData } from './user/index';

class Users {
  static getDb(req) {
    const { data } = req;
    const db = data.get('database');
    if (!db.hasStorage('users')) {
      db.createStorage('users');
    }

    return db.getStorage('users');
  }

  static addUser(req, res) {
    const { body: registrationData } = req;
    const userData = parseData(registrationData, 'registration');

    if (!userData.isValid()) {
      return Reply(userData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const UsersDb = Users.getDb(req);
    const users = Array.from(UsersDb);

    const hasEmail = users.find(
      ([, user]) => (
        user.get('email') === userData.getEmail()
      ),
    );

    if (hasEmail) {
      return Reply('Email already registered... If you are the owner please try logging in')
        .setStatusCode(400)
        .send(res);
    }

    const hasPhoneNumber = users.find(
      ([, user]) => (
        user.get('phoneNumber') === userData.getPhoneNumber()
      ),
    );

    if (hasPhoneNumber) {
      return Reply('Phone Number already registered... If you are the owner please try logging in')
        .setStatusCode(400)
        .send(res);
    }

    const id = (UsersDb.size + 1);
    userData
      .set('is_verified', false)
      .set('is_admin', false)
      .set('id', id)
      .set('register_time', String(Date.now()));

    UsersDb.set(id, userData.getSavedMapObject());
    const { password, ...savedData } = userData.getSavedData();

    const tokenManager = JwtManager().encode(savedData);
    if (!tokenManager.isValid()) {
      UsersDb.delete(id);
      return ReplyFor('invalid-token-assigned').send(res);
    }

    const token = tokenManager.getJwt();
    return Reply('User registered succesfully', true, {
      data: {
        ...savedData,
        token,
      },
    }).setStatusCode(200).send(res);
  }

  static logUser(req, res) {
    const { body: data } = req;
    const userData = parseData(data, 'login');

    if (!userData.isValid()) {
      return Reply(userData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const UsersDb = Users.getDb(req);
    const login = userData.getLogin();
    const password = userData.getPassword();

    const userId = Array.from(UsersDb.keys()).find((key) => {
      const user = UsersDb.get(key);
      if ((user instanceof Map)) {
        if ((user.get('email') === login) && (user.get('password') === password)) {
          return true;
        }
      }

      return false;
    });

    const User = UsersDb.get(userId);
    if (!(userId && (User instanceof Map))) {
      return Reply('User does not exists').setStatusCode(404).send(res);
    }

    const userObject = Array.from(User.entries()).reduce((obj, [key, value]) => {
      const object = obj;
      object[key] = value;
      return obj;
    }, {});

    const { password: pass, ...outData } = userObject;

    const tokenManager = JwtManager().encode(outData);
    if (!tokenManager.isValid()) {
      return ReplyFor('invalid-token-assigned').send(res);
    }

    const token = tokenManager.getJwt();
    return Reply('user logged succesfully', true, {
      data: {
        ...outData,
        token,
      },
    })
      .setStatusCode(200)
      .send(res);
  }

  static getUser(req) {
    const userDb = Users.getDb(req);
    const userId = parseInt(req.params.id, 10) || 0;
    return userDb.get(userId);
  }

  static getUserData(req, res) {
    const { data } = req;
    const userAccount = data.get('User');

    const userObject = Array.from(userAccount.entries()).reduce((obj, [key, value]) => {
      const object = obj;
      object[key] = value;
      return obj;
    }, {});

    const { password, ...userData } = userObject;
    return Reply('User fetched succesfully', true, userData)
      .setStatusCode(200)
      .send(res);
  }

  static updateUser(req, res) {
    const { body: updateData, data } = req;
    const userAccount = data.get('User');
    const userData = parseData(updateData, 'updateData');

    if (!userData.isValid()) {
      return Reply(userData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const userObject = userData.getSavedData();
    Object.entries(userObject).forEach(([key, value]) => {
      userAccount.set(key, value);
    });

    const { password, ...outData } = userObject;
    return Reply('User data updated succesfully', true)
      .setStatusCode(200)
      .setObjectData({
        data: {
          ...outData,
        },
      })
      .send(res);
  }
}

export const {
  getDb: UsersDb,
  addUser,
  logUser,
  getUser,
  getUserData,
  updateUser,
} = Users;
export default Users;
