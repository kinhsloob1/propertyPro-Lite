/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */

import {
  before, after, describe,
} from 'mocha';
import generateInvalidTest from './generate_invalid_test';

export default ({
  STORE,
  methods,
  url,
  data = null,
  headers = {},
  query = {},
  status = 400,
  errorMessage = 'Invalid request',
}) => {
  if (!Array.isArray(methods)) {
    return;
  }

  if (typeof url !== 'string') {
    return;
  }

  methods.forEach((method) => {
    let out = {
      status,
      errorMessage,
    };

    before((done) => {
      (async () => {
        try {
          const request = STORE.get('request');
          out.response = await request({
            method,
            url,
            data,
            query,
            headers,
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

    describe(
      `When "${method.toUpperCase()}" request method is used to access ${url} with the following :-
      Headers = ${JSON.stringify(headers)}, Query = ${JSON.stringify(query)}, Data = ${JSON.stringify(data)}
      `,
      () => {
        generateInvalidTest(out);
      },
    );
  });
};
