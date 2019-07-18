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
import { userSpec } from '../../../utils/data_spec_model';
import addUser from '../../../utils/add_user';
import generateInvalidTest from '../../../utils/generate_invalid_test';
import generateValidTest from '../../../utils/generate_valid_test';

const path = '/user/1';
const STORE = new Map();

const updateUserSpecs = Object.keys(userSpec).reduce((updateUserSpec, param) => {
  const updateSpecs = updateUserSpec;
  const specData = userSpec[param] || {};
  const isUpdateable = specData.isUpdateable || false;
  if (isUpdateable) {
    const { type, invalid: invalidData = null } = specData;
    if (invalidData !== null) {
      updateSpecs[param] = {
        invalidData,
        type,
      };
    }
  }

  return updateSpecs;
}, {});

const getUpdateUserData = dataStore => Object.keys(dataStore).reduce((regData, param) => {
  const data = regData;
  if (updateUserSpecs[param]) {
    data[param] = dataStore[param];
  }
  return data;
}, {});

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

describe('Update user record end point ( /user/:user-id )', () => {
  const updateData = getUpdateUserData(firstUser);
  const method = 'patch';
  describe('When PATCH request method is used to update user information', () => {
    testLoggedMiddleware({
      STORE,
      url: path,
      data: updateData,
      methods: [method],
    });

    describe('When valid user JWT token is sent and user is valid', () => {
      testUserPermissionMiddleware({
        STORE,
        url: path,
        methods: [method],
        data: updateData,
        invalidUser: secondUser,
      });

      describe('when user has access permission', () => {
        describe('when invalid data is sent as updateable params', () => {
          Object.keys(updateUserSpecs).forEach((param) => {
            describe(`When invalid data is used as ${param}`, () => {
              const paramSpec = updateUserSpecs[param];
              const { invalidData = {} } = paramSpec;
              const { invalidParams, errorMessage: paramsErrorMessage = '' } = invalidData;

              if (Array.isArray(invalidParams)) {
                invalidParams.forEach((invalidParam) => {
                  const { value, errorMessage: paramErrorMessage = false } = invalidParam;

                  describe(`When '${value}' is used as ${param}`, () => {
                    const out = {
                      errorMessage: (paramErrorMessage || paramsErrorMessage),
                    };

                    before((done) => {
                      (async () => {
                        try {
                          const request = STORE.get('request');
                          const Bearer = STORE.get('Bearer');
                          const newData = { [param]: value };
                          out.response = await request({
                            method,
                            data: newData,
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
                      out.response = null;
                    });

                    generateInvalidTest(out);
                  });
                });
              }
            });
          });
        });

        describe('When valid params is sent to the end point', () => {
          const { password, ...newUpdateables } = updateData;

          describe('When all updateable fields exculding the password field is being updated', () => {
            Object.keys(newUpdateables).forEach((param) => {
              const value = newUpdateables[param];

              describe(`When '${value}' is used as ${param}`, () => {
                let response;

                before((done) => {
                  (async () => {
                    try {
                      const request = STORE.get('request');
                      const Bearer = STORE.get('Bearer');
                      const data = { [param]: value };
                      response = await request({
                        method,
                        url: path,
                        headers: {
                          Bearer,
                        },
                        data,
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

                it('should return status code 200', () => {
                  expect(response.status).to.equal(200);
                });

                it('should return a response json object', () => {
                  expect(response.data, 'Invalid response body').to.be.an('object');
                });

                it('respponse object should have three fields namely "status" and "message" and "data"', () => {
                  expect(response.data.status).to.exist;
                  expect(response.data.message).to.exist;
                  expect(response.data.data).to.exist;
                });

                it('response object "status" field should be equal to "success"', () => {
                  expect(response.data.status, 'Invalid response body status').to.be.equal('success');
                });

                it('response object "message" field should be equal to "User data updated succesfully"', () => {
                  expect(response.data.message, 'Invalid response body error message').to.be.equal('User data updated succesfully');
                });

                it('response object "data" field should be an object', () => {
                  expect(response.data.data, 'Invalid response data').to.be.an('object');
                });

                it(`response "data" field should have ${param} field`, () => {
                  expect(response.data.data[param], `Invalid response data ${param} field`).to.exist;
                });

                const type = updateUserSpecs[param].type || 'string';
                if (typeof type === 'string') {
                  it(`response "data" ${param} field should be of type "${type}" and equal ${value}`, () => {
                    expect(response.data.data[param], `response data ${param} field should be a "${type}"`).to.be.a(type);
                    expect(response.data.data[param], `response data ${param} field should equal "${value}"`).to.equal(value);
                  });
                }
              });
            });
          });

          describe('When password field is sent to the end point', () => {
            describe(`When '${password}' is used as password`, () => {
              let out = {
                message: 'User data updated succesfully',
                has: {},
              };

              before((done) => {
                (async () => {
                  try {
                    const request = STORE.get('request');
                    const Bearer = STORE.get('Bearer');
                    const data = {
                      password,
                      password_confirmation: password,
                    };

                    out.response = await request({
                      method,
                      url: path,
                      headers: {
                        Bearer,
                      },
                      data,
                    });
                    done();
                  } catch (error) {
                    done(error);
                  }
                })();
              });

              after(() => {
                out = null;
              });

              generateValidTest(out);
            });
          });
        });
      });

      describe('When no updateable and invalid field is sent to the api end point', () => {
        let out = {
          errorMessage: 'Ooops... no data to update',
        };

        before((done) => {
          (async () => {
            try {
              const request = STORE.get('request');
              const Bearer = STORE.get('Bearer');
              const data = {};
              out.response = await request({
                method,
                url: path,
                headers: {
                  Bearer,
                },
                data,
              });
              done();
            } catch (error) {
              done(error);
            }
          })();
        });

        after(() => {
          out = null;
        });

        generateInvalidTest(out);
      });
    });
  });
});
