/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import {
  describe,
  before,
  after,
} from 'mocha';
import getServer from '../../../utils/get_server';
import runTestForUser from '../../../utils/run_user_data_test_for';
import runInvalids from '../../../utils/run_invalids_test';
import testLoggedMiddleware from '../../middlewares/auth/run_test_for_enforceLogged';
import testUserPermissionMiddleware from '../../middlewares/user/run_test_for_ensureUserHasPermission';
import { firstUser, secondUser } from '../../../utils/users_data_model';
import addUser from '../../../utils/add_user';

const path = '/api/v2/user/1';
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

describe('Get user record end point ( /api/v2/user/:user-id )', () => {
  runInvalids({
    STORE,
    url: path,
    methods: ['post', 'put'],
  });

  describe('When GET request method is used to fetch user information', () => {
    testLoggedMiddleware({
      STORE,
      url: path,
      methods: ['get'],
    });

    describe('When valid user JWT token is sent and user is valid', () => {
      testUserPermissionMiddleware({
        STORE,
        url: path,
        methods: ['get'],
        invalidUser: secondUser,
      });

      describe('when user has access permission', () => {
        let out = {
          userData: firstUser,
        };

        before((done) => {
          const request = STORE.get('request');
          (async () => {
            try {
              out.response = await request({
                method: 'get',
                url: path,
                headers: {
                  Bearer: STORE.get('Bearer'),
                },
              });

              done();
            } catch (e) {
              done(e);
            }
          })();
        });

        after(() => {
          out = null;
        });

        runTestForUser('user', out);
      });
    });
  });
});
