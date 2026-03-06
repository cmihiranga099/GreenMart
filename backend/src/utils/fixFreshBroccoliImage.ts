import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product';

dotenv.config();

const NEW_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const updated = await Product.findOneAndUpdate(
      { name: 'Fresh Broccoli' },
      {
        $set: {
          'images.0.url': NEW_IMAGE_URL,
          'images.0.publicId': 'sample_broccoli',
          'images.0.isPrimary': true,
        },
      },
      { new: true }
    );

    if (!updated) {
      console.log('Fresh Broccoli product not found.');
    } else {
      console.log('Fresh Broccoli image updated successfully.');
      console.log(`New URL: ${updated.images?.[0]?.url}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to update Fresh Broccoli image:', error);
    process.exit(1);
  }
};

run();
