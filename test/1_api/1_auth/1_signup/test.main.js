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
import { firstUser } from '../../../utils/users_data_model';
import { userSpec } from '../../../utils/data_spec_model';

const context = describe;
const path = '/api/v2/auth/signup';
const STORE = new Map();

before((done) => {
  (async () => {
    const { server, request } = await getServer();
    STORE.set('server', server);
    STORE.set('request', request);
    done();
  })();
});

after(() => {
  STORE.get('server').close();
  STORE.delete('server');
  STORE.delete('request');
});

const registrationSpecs = Object.keys(userSpec).reduce((registrationSpec, param) => {
  const regSpecs = registrationSpec;
  const specData = userSpec[param] || {};
  const { required = false, errorMessage = '', unique = {} } = specData.registration || {};
  if (required) {
    const { invalid: invalidData = null } = specData;
    if (invalidData !== null) {
      const { required: isUnique = false, errorMessage: uniqueErrorMessage = '' } = unique;
      regSpecs[param] = {
        invalidData,
        errorMessage,
        isUnique,
        uniqueErrorMessage,
      };
    }
  }

  return regSpecs;
}, {});

describe('Sign Up api end point ( /api/v2/auth/sign-up )', () => {
  runInvalids({
    STORE,
    url: path,
    methods: ['get', 'patch', 'put', 'delete'],
  });

  context('When POST is used to make request', () => {
    describe('when incomplete parameters is sent to the server', () => {
      Object.keys(registrationSpecs).forEach((param) => {
        describe(`When ${param} parameter is ommited from the payload that is sent to the end point`, () => {
          const paramSpec = registrationSpecs[param];
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
                done(error.getMessage());
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
      Object.keys(registrationSpecs).forEach((param) => {
        describe(`When invalid data is used as ${param}`, () => {
          const paramSpec = registrationSpecs[param];
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
                      done(error.getMessage());
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
          }
        });
      });
    });

    describe('When valid data is sent to the end point', () => {
      describe('When unique and non existent information is used to sign up', () => {
        const registrationData = Object.keys(firstUser).reduce((regData, param) => {
          const data = regData;
          if (registrationSpecs[param]) {
            data[param] = firstUser[param];
          }
          return data;
        }, {});

        let data = {
          userData: firstUser,
        };

        before((done) => {
          (async () => {
            try {
              const request = STORE.get('request');
              data.response = await request.post(path, registrationData);
              done();
            } catch (error) {
              done(error.getMessage());
            }
          })();
        });

        after(() => {
          data = null;
        });

        runTestForUser('registration', data);
      });

      describe('when existing record is used to sign up again', () => {
        Object.keys(registrationSpecs).forEach((param) => {
          const paramSpec = registrationSpecs[param];
          const { isUnique, uniqueErrorMessage: errorMessage } = paramSpec;
          const { [param]: value } = firstUser;

          if (!isUnique) {
            return;
          }

          describe(`When ${value} which is an already registered ${param} is used to create a new account`, () => {
            let response;

            before((done) => {
              (async () => {
                try {
                  const request = STORE.get('request');
                  const { ...newData } = firstUser;
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
      });
    });
  });
});
