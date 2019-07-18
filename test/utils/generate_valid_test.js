/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import { it } from 'mocha';
import { expect } from 'chai';

export default (data) => {
  const {
    status = 200,
    statusText = 'success',
    message,
    has = null,
  } = data;

  const hasData = ((has !== null) && (typeof has === 'object'));

  it(`should return status code ${status}`, () => {
    expect(data.response.status, 'Invalid response status code').to.equal(status);
  });

  it('should return a response json object', () => {
    expect(data.response.data, 'Invalid response body').to.be.an('object');
  });

  it(`response object should have two fields namely "status" ${hasData ? ',' : 'and'} "message" ${hasData ? 'and "data" field' : ''}`, () => {
    expect(data.response.data.status).to.exist;
    expect(data.response.data.message).to.exist;
    if (hasData) {
      expect(data.response.data.data).to.exist;
    }
  });

  it(`response object status field should be equal to "${statusText}"`, () => {
    expect(data.response.data.status, 'Invalid response body status').to.be.equal(statusText);
  });

  it(`response object "message" field should be equal to "${message}"`, () => {
    expect(data.response.data.message, 'Invalid response body message').to.equal(message);
  });

  if (hasData) {
    const getData = (pointer) => {
      const pointerString = pointer ? `data.${String(pointer)}` : 'data';
      const parts = pointerString.split('.');
      const partsLength = parts.length;
      const dataStore = data.response.data.data;

      if (partsLength > 1) {
        let value = null;
        let current = dataStore;

        parts.forEach((part, index) => {
          if (index > 0) {
            if (current === null) {
              return;
            }

            if (current[part] !== undefined) {
              if ((index + 1) === partsLength) {
                value = current[part];
              } else if (typeof current[part] === 'object') {
                current = current[part];
              } else {
                current = null;
              }
            }
          }
        });

        return value;
      }

      return dataStore;
    };

    const processHas = (item, parent = '') => {
      if (Array.isArray(item)) {
        const isEmpty = (item.length === 0);
        it(`response object data${parent ? `.${parent}` : ''} field should be an array${isEmpty ? ' and should be empty' : ''}`, () => {
          const val = getData(parent);
          expect(val, 'Invalid response data object').to.be.an('array');
          if (isEmpty) {
            expect(val, 'Invalid response data.. Value should be empty').to.deep.equal([]);
          }
        });

        if (!isEmpty) {
          item.forEach((param, key) => {
            const currPointer = parent ? `${parent}.${key}` : key;
            if (typeof param === 'object') {
              processHas(param, currPointer);
            } else if (param.type || param.value) {
              if (param.type) {
                it(`response object data.${currPointer} field should be of type "${param.type}"`, () => {
                  expect(getData(currPointer), 'Invalid response body data').to.be.an(param.type);
                });
              }

              if (param.value) {
                it(`response object data${currPointer} field should equal ${param.value}`, () => {
                  expect(getData(currPointer), 'Invalid response body data').to.deep.equal(param.value);
                });
              }
            }
          });
        }
      } else {
        const isEmpty = (Object.keys(item).length === 0);
        it(`response object data${parent ? `.${parent}` : ''} field should be an object${isEmpty ? ' and should be empty' : ''}`, () => {
          const val = getData(parent);
          expect(val, 'Invalid response data object').to.be.an('object');
          if (isEmpty) {
            expect(val, 'Invalid response data.. Value should be empty').to.deep.equal({});
          }
        });

        if (!isEmpty) {
          Object.keys(item).forEach((param) => {
            const key = param;
            const value = item[param];
            const currPointer = parent ? `${parent}.${key}` : key;

            if (typeof value.has === 'object') {
              processHas(value.has, currPointer);
            } else if (value.type || value.value) {
              if (value.type) {
                it(`response object data.${currPointer} field should be of type "${value.type}"`, () => {
                  expect(getData(currPointer), 'Invalid response body data').to.be.an(value.type);
                });
              }

              if (value.value) {
                it(`response object data.${currPointer} field should equal ${value.value}`, () => {
                  expect(getData(currPointer), 'Invalid response body data').to.deep.equal(value.value);
                });
              }
            }
          });
        }
      }
    };
    processHas(has);
  }
};
