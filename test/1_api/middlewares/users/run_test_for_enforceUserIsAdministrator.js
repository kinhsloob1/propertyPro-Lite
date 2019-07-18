/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import {
  describe,
  before,
  after,
} from 'mocha';
import generateInvalidTest from '../../../utils/generate_invalid_test';
import logUser from '../../../utils/log_user';

export default ({
  STORE,
  methods,
  url,
  data = null,
  headers = {},
  query = {},
  invalidUser,
  errorMessage = 'Ooops you dont have appropriate permission.',
}) => {
  if (!Array.isArray(methods)) {
    return;
  }

  if (typeof url !== 'string') {
    return;
  }

  methods.forEach((method) => {
    let out = {
      status: 403,
      errorMessage,
    };

    before((done) => {
      (async () => {
        try {
          const request = STORE.get('request');
          const invalUser = await logUser(request, invalidUser);
          if (!invalUser.data.status === 'success') {
            return done(new Error('Please register the invalid user first before running test'));
          }

          const Bearer = invalUser.data.data.token;
          out.response = await request({
            method,
            url,
            data,
            query,
            headers: {
              ...headers,
              Bearer,
            },
          });
          return done();
        } catch (e) {
          return done(e);
        }
      })();
    });

    after(() => {
      out = null;
    });

    describe(`When a user who is not an administrator attempts to perform request on ${url} which requires administrator prvilleges`, () => {
      generateInvalidTest(out);
    });
  });
};
