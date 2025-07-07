const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/response");

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("userId", "username")
      .populate("items.productId", "name price");
    return successResponse(res, 200, "Fetch all Orders successfully.", orders);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err.message);
  }
}

// async function getOrdersByProductId ( req,res ) {
//     try {
//         const productId = req.params.id
//         const orders = await Order.find({'items.productId': productId})
//             .populate('userId', 'email')
//             .populate('items.productId', 'name price');

//         res.status(200).json({
//             status: 200,
//             message: `Orders that include product ${productId}`,
//             data: orders
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: err.message,
//             data: []
//         })
//     }
// }

async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    let items = req.body;

    if (!Array.isArray(items)) {
      items = [items];
    }

    if (!items || items.length === 0) {
      return errorResponse(
        res,
        400,
        "At least one item is required.",
        (data = [])
      );
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return errorResponse(
          res,
          400,
          `Product not found: ${items.productId}`,
          []
        );
      }

      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

      if (product.stock < quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
          []
        );
      }

      total += product.price * quantity;

      orderItems.push({
        productId: product._id,
        quantity,
        // priceAtPurchase,
      });
    }

    const order = new Order({
      userId: userId,
      items: orderItems,
      total,
    });

    await order.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    return successResponse(res, 201, 'Order created successfully, Stock updated', order)
  } catch (err) {
    return errorResponse(res, 400, 'Something went wrong', err.message)
  }
}

module.exports = {
  getAllOrders,
  createOrder,
};
