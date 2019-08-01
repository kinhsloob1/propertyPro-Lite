import { config } from 'dotenv';
import cloud from 'cloudinary';

config();
const cloudinary = cloud.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: !!parseInt(process.env.CLOUDINARY_SECURE, 10),
});

export default cloudinary;
