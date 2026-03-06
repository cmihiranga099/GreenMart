import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product';

dotenv.config();

const NEW_IMAGE_URL = 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const updated = await Product.findOneAndUpdate(
      { name: 'Parmesan Cheese' },
      {
        $set: {
          'images.0.url': NEW_IMAGE_URL,
          'images.0.publicId': 'sample_parmesan',
          'images.0.isPrimary': true,
        },
      },
      { new: true }
    );

    if (!updated) {
      console.log('Parmesan Cheese product not found.');
    } else {
      console.log('Parmesan Cheese image updated successfully.');
      console.log(`New URL: ${updated.images?.[0]?.url}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to update Parmesan Cheese image:', error);
    process.exit(1);
  }
};

run();
