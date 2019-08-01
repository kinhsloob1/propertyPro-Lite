import { config } from 'dotenv';
import mailGun from 'mailgun-js';

config();
export default mailGun({
  apiKey: process.env.MAILGUN_API_KEY || 'dummystring',
  domain: 'kingsley-property-pro-lite',
  endpoint: '/v3',
});
