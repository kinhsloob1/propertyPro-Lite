/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */

import { it } from 'mocha';
import { expect } from 'chai';
import { userSpec } from './data_spec_model';

export default (forWhat, data) => {
  let what = forWhat;
  if (
    !['user', 'login', 'registration']
      .find(val => ((val === what) || (val.includes('user'))))) {
    return;
  }

  const { userData } = data;

  it('should return status code 200', () => {
    expect(data.response.status).to.equal(200);
  });

  it('should return a response json object', () => {
    expect(data.response.data, 'Invalid response body').to.be.an('object');
  });

  it('response object should have three fields namely "status" and "message" and "data"', () => {
    expect(data.response.data.status).to.exist;
    expect(data.response.data.message).to.exist;
    expect(data.response.data.data).to.exist;
  });

  it('response object "status" field should be equal to "success"', () => {
    expect(data.response.data.status, 'Invalid response body status').to.be.equal('success');
  });

  it('response object "data" field to be an object', () => {
    expect(data.response.data.data, 'Invalid response body data').to.be.an('object');
  });

  it('response object "data" field to be an object', () => {
    expect(data.response.data.data, 'Invalid response body data').to.be.an('object');
  });

  let messageText = '';
  switch (what) {
    case 'registration':
      messageText = 'User registered succesfully';
      break;

    case 'login':
      messageText = 'user logged succesfully';
      break;

    case 'user':
      messageText = 'User fetched succesfully';
      break;

    case 'user-update':
      messageText = 'User fetched succesfully';
      what = 'user';
      break;

    default:
  }

  it(`response object "message" field should be equal to "${messageText}"`, () => {
    expect(data.response.data.message, 'Invalid response body message').to.be.equal(messageText);
  });

  Object.keys(userSpec).forEach((param) => {
    const spec = userSpec[param];
    const { display = {} } = spec;
    const { [what]: canDisplay = false } = display;

    if (!canDisplay) {
      return;
    }

    const type = spec.type || null;
    let value = userData[param] || spec.default || null;

    if (value !== null) {
      switch (type) {
        case 'number':
          value = parseInt(value, 10);
          break;
        case 'boolean':
          value = Boolean(value);
          break;
        default:
          value = String(value);
      }
    }

    const append = (value !== null ? `and equal "${value}"` : '');
    it(`"data" object "${param}" field should exists, be of type "${type}" ${append}`, () => {
      expect(data.response.data.data[param]).to.exist;
      expect(data.response.data.data[param], `Invalid ${param} data`).to.be.a(type);

      if (value !== null) {
        expect(data.response.data.data[param], `${param} data should equal ${value}`).to.equal(value);
      }
    });
  });
};
