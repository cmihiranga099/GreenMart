import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Validate Cloudinary configuration
if (!cloudName || cloudName === 'your_cloud_name') {
  console.warn(
    '⚠️  WARNING: CLOUDINARY_CLOUD_NAME is not configured. Image uploads will fail.'
  );
}

if (!apiKey || apiKey === 'your_api_key') {
  console.warn(
    '⚠️  WARNING: CLOUDINARY_API_KEY is not configured. Image uploads will fail.'
  );
}

if (!apiSecret || apiSecret === 'your_api_secret') {
  console.warn(
    '⚠️  WARNING: CLOUDINARY_API_SECRET is not configured. Image uploads will fail.'
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
