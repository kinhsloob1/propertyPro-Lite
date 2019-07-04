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
      .set('id', id);

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
}

export const {
  addUser,
} = Users;
export default Users;
