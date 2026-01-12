import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products.product',
      select: 'name price images quantity status slug compareAtPrice',
    });

    // Create empty wishlist if doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching wishlist',
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    // Check if product already in wishlist
    const exists = wishlist.products.some(
      (item: any) => item.product.toString() === productId
    );

    if (exists) {
      res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
      return;
    }

    // Add product
    wishlist.products.push({
      product: productId,
      addedAt: new Date(),
    });

    await wishlist.save();

    // Populate and return
    wishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products.product',
      select: 'name price images quantity status slug',
    });

    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      data: wishlist,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding to wishlist',
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
      return;
    }

    // Filter out the product
    wishlist.products = wishlist.products.filter(
      (item: any) => item.product.toString() !== productId
    );

    await wishlist.save();

    // Populate and return
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products.product',
      select: 'name price images quantity status slug',
    });

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
      data: updatedWishlist,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing from wishlist',
    });
  }
};
