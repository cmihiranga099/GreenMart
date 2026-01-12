import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

interface IImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  quantity: number;
  images: IImage[];
  category: mongoose.Types.ObjectId;
  unit: string;
  tags: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    sku: {
      type: String,
      required: [true, 'Please provide SKU'],
      unique: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: function (v: IImage[]) {
          return v && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide product category'],
    },
    unit: {
      type: String,
      required: [true, 'Please provide unit'],
      enum: ['kg', 'g', 'liter', 'ml', 'piece', 'dozen', 'pack'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  // Update status based on quantity
  if (this.quantity === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock' && this.quantity > 0) {
    this.status = 'active';
  }

  next();
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ sku: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
