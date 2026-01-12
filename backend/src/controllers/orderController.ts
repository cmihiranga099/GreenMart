import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { createPaymentIntent } from '../services/stripeService';

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order',
    });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const { shippingAddress, paymentMethod } = req.body;

    // Validate shipping address
    if (!shippingAddress) {
      res.status(400).json({
        success: false,
        message: 'Please provide shipping address',
      });
      return;
    }

    // Validate all required shipping address fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'street', 'city', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
      return;
    }

    // Validate payment method
    if (!paymentMethod || !['stripe', 'cash_on_delivery'].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid payment method',
      });
      return;
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
      return;
    }

    // Filter out items with null products
    const validItems = cart.items.filter((item: any) => item.product && item.product._id);

    if (validItems.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No valid items in cart. Some products may have been removed.',
      });
      return;
    }

    if (validItems.length !== cart.items.length) {
      // Update cart to remove invalid items
      cart.items = validItems;
      await cart.save();
    }

    // Prepare order items and calculate total
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product: any = item.product;

      // Check product availability
      if (!product || product.status !== 'active') {
        res.status(400).json({
          success: false,
          message: `Product ${product?.name || 'unknown'} is not available`,
        });
        return;
      }

      // Check stock
      if (product.quantity < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
        return;
      }

      const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: primaryImage.url,
        subtotal: product.price * item.quantity,
      });

      subtotal += product.price * item.quantity;

      // Reduce product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Calculate totals
    const tax = 0; // You can calculate tax here
    const shippingCost = 0; // You can calculate shipping here
    const total = subtotal + tax + shippingCost;

    // Create payment intent for Stripe
    let paymentInfo: any = {
      method: paymentMethod,
      status: 'pending',
    };

    let clientSecret: string | null = null;

    if (paymentMethod === 'stripe') {
      const paymentIntent = await createPaymentIntent(total);
      paymentInfo.stripePaymentIntentId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret;
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress,
      paymentInfo,
      status: 'pending',
    });

    // Clear user's cart
    cart.items = [];
    await cart.save();

    // Populate order
    const populatedOrder = await Order.findById(order._id).populate('items.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: populatedOrder,
        clientSecret: clientSecret,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
    });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
      return;
    }

    // Check if order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel this order',
      });
      return;
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling order',
    });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'Please provide status',
      });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status',
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const requestedLimit = parseInt(req.query.limit as string) || 20;
    const limit = Math.min(requestedLimit, 100); // Maximum 100 orders per page
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};
