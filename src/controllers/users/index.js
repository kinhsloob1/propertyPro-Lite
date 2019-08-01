import { randomBytes } from 'crypto';
import { Reply, ReplyFor } from '../utils';
import { JwtManager } from '../token';
import { parseData } from './user/index';
import mailgun from '../mailgun';

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

    const id = ((UsersDb.size > 0) ? (parseInt(Array.from(UsersDb.keys()).pop(), 10) + 1) : 1);
    userData
      .set('is_verified', false)
      .set('is_blocked', false)
      .set('is_admin', false)
      .set('id', id)
      .set('created_on', new Date());

    UsersDb.set(id, userData.getSavedMapObject());
    const { password, ...savedData } = userData.getSavedData();

    const tokenManager = JwtManager().encode({
      id: userData.get('id'),
      created_on: userData.get('created_on'),
    });

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

    const tokenManager = JwtManager().encode({
      id: User.get('id'),
      created_on: User.get('created_on'),
    });

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
    const userId = parseInt(req.params.userId, 10) || 0;
    return userDb.get(userId);
  }

  static getUserData(req, res) {
    const { data } = req;
    const userAccount = data.get('User');
    let userObject = Users.getUserObject(userAccount);

    if (!userObject.isOk()) {
      return Reply('Invalid user').send(res);
    }

    userObject = userObject.get('Object');
    const reply = Reply('User fetched succesfully', true)
      .setStatusCode(200);

    reply.setObjectData({
      data: userObject,
    });

    return reply.send(res);
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
    let updatedDataCount = 0;
    Object.entries(userObject).forEach(([key, value]) => {
      userAccount.set(key, value);
      updatedDataCount += 1;
    });

    if (updatedDataCount === 0) {
      return Reply('Ooops... no data to update', false)
        .setStatusCode(400)
        .send(res);
    }

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

  static deleteUser(req, res) {
    const { data } = req;
    const userAccount = data.get('User');
    const usersDb = Users.getDb(req);

    usersDb.delete(userAccount.get('id'));
    return Reply('User removed succesfully succesfully')
      .setStatusCode(204)
      .send(res);
  }

  static getUserById(id) {
    return (req) => {
      const UsersDb = Users.getDb(req);
      const User = UsersDb.get(id);

      if (User instanceof Map) {
        return Reply('User found', true, {
          data: User,
        });
      }

      return Reply('User not found');
    };
  }

  static getUserObject(user) {
    if (!(user instanceof Map)) {
      return Reply('Invalid user');
    }

    const userObject = Array.from(user.entries()).reduce((obj, [key, value]) => {
      const object = obj;
      object[key] = value;
      return obj;
    }, {});

    const { password, ...userData } = userObject;
    return Reply('User', true, {
      Object: userData,
    });
  }

  static getUsers(req, res) {
    const {
      query: {
        limit = 12,
        offset = 0,
      },
    } = req;

    const UsersDb = Users.getDb(req);
    const out = [];
    let offsetCount = 0;

    Array.from(UsersDb.keys()).forEach((key) => {
      const user = UsersDb.get(key);
      if (user.get('is_blocked')) {
        return;
      }

      const userObject = Users.getUserObject(user);
      if (userObject.isOk()) {
        if (offsetCount < offset) {
          offsetCount += 1;
        } else if (out.length < limit) {
          out.push(userObject.get('Object'));
        }
      }
    });

    const reply = Reply('Users list', true);
    reply.setStatusCode(200);
    reply.setObjectData({
      data: out,
    });
    return reply.send(res);
  }

  static resetUserPassword(req, res) {
    const {
      params: {
        userEmail,
      },
      body: clientResetData,
    } = req;

    const resetData = parseData(clientResetData, 'reset');
    if (!resetData.isValid()) {
      return Reply(resetData.getError())
        .setStatusCode(400)
        .send(res);
    }

    const UsersDb = Users.getDb(req);
    const userId = Array.from(UsersDb.keys()).find((key) => {
      const user = UsersDb.get(key);
      if ((user instanceof Map)) {
        if (user.get('email') === userEmail) {
          return true;
        }
      }

      return false;
    });

    const User = UsersDb.get(userId);
    if (!(userId && (User instanceof Map))) {
      return Reply('email address is not registered')
        .setStatusCode(404)
        .send(res);
    }

    const canRemember = resetData.get('can_remember');
    const newPassword = resetData.get('new_password');

    if (canRemember) {
      User.set('password', newPassword);
      return res.status(200).json({
        status: 204,
      });
    }

    const passwordString = randomBytes(10).toString('hex').substr(0, 10);
    const passwordData = parseData({
      password: passwordString,
      password_confirmation: passwordString,
    }, 'update');

    if (!passwordData.isValid()) {
      return ReplyFor('server-error').send(res);
    }

    return (async () => {
      const mailData = {
        from: `Support <support@${req.get('host')}>`,
        to: userEmail,
        subject: 'Kingsley property-pro-lite Account Password Reset',
        template: 'new_password_mail',
        first_name: User.get('first_name'),
        new_password: passwordString,
      };

      try {
        await new Promise((resolve, reject) => {
          mailgun.messages().send(mailData, (error, body) => {
            if (error) {
              return reject(error);
            }
            return resolve(body);
          });
        });

        User.set('password', passwordData.get('password'));
        return res.status(200).json({
          status: 204,
        });
      } catch (e) {
        return Reply('An error occured while sending password reset mail')
          .setStatusCode(500)
          .send(res);
      }
    })();
  }
}

export const {
  getDb: UsersDb,
  addUser,
  logUser,
  getUser,
  getUserData,
  updateUser,
  deleteUser,
  getUserById,
  getUserObject,
  getUsers,
  resetUserPassword,
} = Users;
export default Users;
