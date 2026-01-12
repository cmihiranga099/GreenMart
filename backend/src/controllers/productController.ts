import { Request, Response } from 'express';
import Product from '../models/Product';
import { uploadImage, deleteImage } from '../services/cloudinaryService';

// @desc    Get all products with filtering, search, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { status: 'active' };

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    // Search by name, description, or tags
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Sort
    let sort: any = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'name_asc':
          sort = { name: 1 };
          break;
        case 'name_desc':
          sort = { name: -1 };
          break;
      }
    }

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;

    const products = await Product.find({ featured: true, status: 'active' })
      .populate('category', 'name slug')
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching featured products',
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      sku,
      quantity,
      category,
      unit,
      tags,
      featured,
    } = req.body;

    // Check if files are uploaded
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please upload at least one product image',
      });
      return;
    }

    // Upload images to Cloudinary
    const files = req.files as Express.Multer.File[];
    const imageUploads = files.map((file, index) =>
      uploadImage(file, 'greenmart/products').then((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        isPrimary: index === 0, // First image is primary
      }))
    );

    const images = await Promise.all(imageUploads);

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      compareAtPrice,
      sku,
      quantity,
      images,
      category,
      unit,
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      sku,
      quantity,
      category,
      unit,
      tags,
      status,
      featured,
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.compareAtPrice = compareAtPrice !== undefined ? compareAtPrice : product.compareAtPrice;
    product.sku = sku || product.sku;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.category = category || product.category;
    product.unit = unit || product.unit;
    product.tags = tags ? (typeof tags === 'string' ? tags.split(',') : tags) : product.tags;
    product.status = status || product.status;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

    // If new images are uploaded
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      // Delete old images
      for (const image of product.images) {
        await deleteImage(image.publicId);
      }

      // Upload new images
      const files = req.files as Express.Multer.File[];
      const imageUploads = files.map((file, index) =>
        uploadImage(file, 'greenmart/products').then((result) => ({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: index === 0,
        }))
      );

      product.images = await Promise.all(imageUploads);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      await deleteImage(image.publicId);
    }

    // Delete product
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide valid quantity',
      });
      return;
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    product.quantity = quantity;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating stock',
    });
  }
};
