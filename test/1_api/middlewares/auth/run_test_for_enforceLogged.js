/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
import {
  describe,
} from 'mocha';
import runInvalids from '../../../utils/run_invalids_test';

export default ({
  STORE,
  url,
  methods,
  headers = {},
  query = {},
  data = {},
}) => {
  describe(`When invalid user JWT or no JWT is used to make request on ${url} endpoint`, () => {
    runInvalids({
      STORE,
      url,
      headers,
      query,
      data,
      status: 401,
      methods,
      errorMessage: 'Invalid user. Login to continue',
    });
  });
};
