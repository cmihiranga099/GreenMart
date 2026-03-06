import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product';

dotenv.config();

const NEW_IMAGE_URL = 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const updated = await Product.findOneAndUpdate(
      { name: 'Sweet Corn' },
      {
        $set: {
          'images.0.url': NEW_IMAGE_URL,
          'images.0.publicId': 'sample_corn',
          'images.0.isPrimary': true,
        },
      },
      { new: true }
    );

    if (!updated) {
      console.log('Sweet Corn product not found.');
    } else {
      console.log('Sweet Corn image updated successfully.');
      console.log(`New URL: ${updated.images?.[0]?.url}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to update Sweet Corn image:', error);
    process.exit(1);
  }
};

run();
