/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import {
  describe,
  before,
  after,
  it,
} from 'mocha';
import { expect } from 'chai';
import getServer from '../../../utils/get_server';
import testLoggedMiddleware from '../../middlewares/auth/run_test_for_enforceLogged';
import testUserPermissionMiddleware from '../../middlewares/user/run_test_for_ensureUserHasPermission';
import { firstUser, secondUser } from '../../../utils/users_data_model';
import addUser from '../../../utils/add_user';

const path = '/user/1';
const STORE = new Map();

before((done) => {
  (async () => {
    try {
      const { server, request } = await getServer();
      const user1Resp = await addUser(request, firstUser);
      const user2Resp = await addUser(request, secondUser);

      if ((user1Resp.data.status === 'success') && (user2Resp.data.status === 'success')) {
        STORE.set('server', server);
        STORE.set('request', request);
        STORE.set('Bearer', user1Resp.data.data.token);

        return done();
      }
      return done(new Error('Cannot execute user test.'));
    } catch (e) {
      return done(e);
    }
  })();
});

after(() => {
  STORE.get('server').close();
  STORE.delete('server');
  STORE.delete('request');
  STORE.delete('Bearer');
});

describe('Delete user record end point ( /user/:user-id )', () => {
  const method = 'delete';
  describe('When Delete request method is used to remove user data', () => {
    testLoggedMiddleware({
      STORE,
      url: path,
      methods: [method],
    });

    describe('When valid user JWT token is sent and user is valid', () => {
      testUserPermissionMiddleware({
        STORE,
        url: path,
        methods: [method],
        invalidUser: secondUser,
      });

      describe('when user has valid permission', () => {
        let response;

        before((done) => {
          (async () => {
            try {
              const request = STORE.get('request');
              const Bearer = STORE.get('Bearer');
              response = await request({
                method,
                headers: {
                  Bearer,
                },
                url: path,
              });
              done();
            } catch (error) {
              done(error);
            }
          })();
        });

        after(() => {
          response = null;
        });

        it('should return status code 204', () => {
          expect(response.status).to.equal(204);
        });

        it('should return a empty response body', () => {
          expect(response.data, 'Invalid response body').to.equal('');
        });
      });
    });
  });
});
