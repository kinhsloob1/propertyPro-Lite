/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import { it } from 'mocha';
import { expect } from 'chai';

export default (data) => {
  const { status = 400, errorMessage } = data;
  it(`should return status code ${status}`, () => {
    expect(data.response.status, 'Invalid response status code').to.equal(status);
  });

  if (status === 401) {
    const headerData = {
      name: 'www-authenticate',
      value: 'Bearer realm="Bearer token required", charset = "UTF-8"',
    };
    it(`should return header "${headerData.name}" that equals "${headerData.value}"`, () => {
      expect(data.response.headers[headerData.name]).to.equal(headerData.value);
    });
  }

  it('should return a response json object', () => {
    expect(data.response.data, 'Invalid response body').to.be.an('object');
  });

  it('response object should have two fields namely "status" and "error"', () => {
    expect(data.response.data.status).to.exist;
    expect(data.response.data.error).to.exist;
  });

  it('response object status field should be equal to error', () => {
    expect(data.response.data.status, 'Invalid response body status').to.be.equal('error');
  });

  it(`response object "error" field should be equal to "${errorMessage}"`, () => {
    expect(data.response.data.error, 'Invalid response body error message').to.be.equal(errorMessage);
  });
};
