/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import { expect } from 'chai';
import {
  it,
  describe,
  before,
  after,
} from 'mocha';
import getServer from '../../../utils/get_server';
import runTestForUser from '../../../utils/run_user_data_test_for';
import runInvalids from '../../../utils/run_invalids_test';
import { firstUser, secondUser } from '../../../utils/users_data_model';
import { userSpec } from '../../../utils/data_spec_model';
import addUser from '../../../utils/add_user';

const context = describe;
const path = '/auth/signin';
const STORE = new Map();

before((done) => {
  (async () => {
    try {
      const { server, request } = await getServer();
      const resp = await addUser(request, firstUser);

      if (resp.data.status === 'success') {
        STORE.set('server', server);
        STORE.set('request', request);
        return done();
      }

      return done(new Error('Ooops... cannot test sign in due to a server error'));
    } catch (e) {
      return done(e);
    }
  })();
});

after(() => {
  STORE.get('server').close();
  STORE.delete('server');
  STORE.delete('request');
});

const loginSpecs = Object.keys(userSpec).reduce((loginSpec, param) => {
  const logSpecs = loginSpec;
  const specData = userSpec[param] || {};
  const { required = false, errorMessage = '' } = specData.login || {};
  if (required) {
    const { invalid: invalidData = null } = specData;
    if (invalidData !== null) {
      logSpecs[param] = {
        invalidData,
        errorMessage,
      };
    }
  }

  return logSpecs;
}, {});

const getLoginData = dataStore => Object.keys(dataStore).reduce((regData, param) => {
  const data = regData;
  if (loginSpecs[param]) {
    data[param] = dataStore[param];
  }
  return data;
}, {});

describe('Sign In api end point ( /auth/sign-in )', () => {
  runInvalids({
    STORE,
    url: path,
    methods: ['get', 'patch', 'put', 'delete'],
  });

  context('When POST is used to make request', () => {
    describe('when incomplete parameters is sent to the server', () => {
      Object.keys(loginSpecs).forEach((param) => {
        describe(`When ${param} parameter is ommited from the payload that is sent to the end point`, () => {
          const paramSpec = loginSpecs[param];
          const { errorMessage } = paramSpec;
          let response;

          before((done) => {
            (async () => {
              try {
                const request = STORE.get('request');
                const { [param]: omittedParam, ...newData } = firstUser;
                response = await request.post(path, newData);
                done();
              } catch (error) {
                done(error);
              }
            })();
          });

          it('should return status code 400', () => {
            expect(response.status).to.equal(400);
          });

          it('should return a json response object', () => {
            expect(response.data, 'Invalid response body').to.be.an('object');
          });

          it('response object should have two fields namely "status" and "error"', () => {
            expect(response.data.status).to.exist;
            expect(response.data.error).to.exist;
          });

          it('response object "status" field should be equal to error', () => {
            expect(response.data.status, 'Invalid response body status').to.be.equal('error');
          });

          it(`response object "error" field should be equal to "${errorMessage}"`, () => {
            expect(response.data.error, 'Invalid response body error message').to.be.equal(errorMessage);
          });
        });
      });
    });

    describe('when invalid data is sent in respective params', () => {
      Object.keys(loginSpecs).forEach((param) => {
        describe(`When invalid data is used as ${param}`, () => {
          const paramSpec = loginSpecs[param];
          const { invalidData = {} } = paramSpec;
          const { invalidParams, errorMessage: paramsErrorMessage = '' } = invalidData;

          if (Array.isArray(invalidParams)) {
            invalidParams.forEach((invalidParam) => {
              const { value, errorMessage: paramErrorMessage = false } = invalidParam;

              describe(`When '${value}' is used as ${param}`, () => {
                const errorMessage = paramErrorMessage || paramsErrorMessage;
                let response;

                before((done) => {
                  (async () => {
                    try {
                      const request = STORE.get('request');
                      const { [param]: omittedData, ...newData } = firstUser;
                      newData[param] = value;
                      response = await request.post(path, newData);
                      done();
                    } catch (error) {
                      done(error);
                    }
                  })();
                });

                after(() => {
                  response = null;
                });

                it('should return status code 400', () => {
                  expect(response.status).to.equal(400);
                });

                it('should return a response json object', () => {
                  expect(response.data, 'Invalid response body').to.be.an('object');
                });

                it('respponse object should have two fields namely "status" and "error"', () => {
                  expect(response.data.status).to.exist;
                  expect(response.data.error).to.exist;
                });

                it('response object "status" field should be equal to error', () => {
                  expect(response.data.status, 'Invalid response body status').to.be.equal('error');
                });

                it(`response object "error" field should be equal to "${errorMessage}"`, () => {
                  expect(response.data.error, 'Invalid response body error message').to.be.equal(errorMessage);
                });
              });
            });
          }
        });
      });
    });

    describe('When valid data is sent to the end point', () => {
      describe('When existent user information is used to sign in', () => {
        const loginData = getLoginData(firstUser);
        const data = {
          userData: firstUser,
        };

        before((done) => {
          (async () => {
            try {
              const request = STORE.get('request');
              data.response = await request.post(path, loginData);
              done();
            } catch (error) {
              done(error);
            }
          })();
        });

        runTestForUser('login', data);
      });

      describe('when non existing record is used to sign in', () => {
        const errorMessage = 'User does not exists';
        const nonExistentUserData = getLoginData(secondUser);

        let response;

        before((done) => {
          (async () => {
            try {
              const request = STORE.get('request');
              response = await request.post(path, nonExistentUserData);
              done();
            } catch (error) {
              done(error);
            }
          })();
        });

        it('should return status code 404', () => {
          expect(response.status).to.equal(404);
        });

        it('should return a response json object', () => {
          expect(response.data, 'Invalid response body').to.be.an('object');
        });

        it('respponse object should have two fields namely "status" and "error"', () => {
          expect(response.data.status).to.exist;
          expect(response.data.error).to.exist;
        });

        it('response object "status" field should be equal to error', () => {
          expect(response.data.status, 'Invalid response body status').to.be.equal('error');
        });

        it(`response object "error" field should be equal to "${errorMessage}"`, () => {
          expect(response.data.error, 'Invalid response body error message').to.be.equal(errorMessage);
        });
      });
    });
  });
});
