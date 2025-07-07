const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/response");

async function getOrdersByProductId(req, res) {
  try {
    const productId = req.params.id;

    const orders = await Order.find({ "items.productId": productId })
      .populate("userId", "username")
      .populate("items.productId", "name price");

    const filteredOrders = orders.map((order) => {
      const matchedItems = order.items.filter(
        (item) => item.productId && item.productId._id.toString() === productId
      );
      return {
        ...order.toObject(),
        items: matchedItems,
      };
    });
    return successResponse(
      res,
      200,
      `Found Orders that include only product ${productId}`,
      filteredOrders
    );
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong.", err.message);
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return errorResponse(res, 404, "Products not found.", products);
    }
    return successResponse(res, 200, "All products fetched.", products);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err.message);
  }
}

async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, "Product not found.", null);
    }
    return successResponse(res, 200, "Product fetched successfully", product);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err.message);
  }
}

async function createProducts(req, res) {
  const products = req.body;

  try {
    if (Array.isArray(req.body)) {
      const names = products.map((p) => p.name);
      const existing = await Product.find({ name: { $in: names } });

      // Find Duplicate products in Database
      //   const existingNames = existing.map((p) => p.name);
      //   const uniqueProducts = products.filter(
      //     (p) => !existingNames.includes(p.name)
      //   );
      //   const duplicateProducts = products.filter(
      //     (p) => existingNames.includes(p.name)
      //   );

      //   const inserted = await Product.insertMany(uniqueProducts);

      //   return res.status(201).json({
      //     status: 201,
      //     message: `เพิ่มสินค้าสำเร็จ ${inserted.length} รายการ, ซ้ำ ${duplicateProducts.length} รายการ`,
      //     data: {
      //         added: inserted,
      //         duplicates: duplicateProducts.map( p=> p.name)
      //     }
      //   })

      if (existing.length > 0) {
        return errorResponse(
          res,
          400,
          `Cannot proceed, Found ${
            existing.length
          } duplicate product(s): ${existing.map((p) => p.name).join(", ")}`,
          null
        );
      }
      const inserted = await Product.insertMany(products);
      return successResponse(
        res,
        201,
        `Successfully added ${inserted.length} product(s)`,
        inserted
      );
    }

    const { name, description, price, stock } = products;

    const exists = await Product.findOne({ name });
    if (exists) {
      return errorResponse(res, 400, "Product already exists.", null);
    }
    const product = new Product({ name, description, price, stock });
    await product.save();
    return successResponse(
      res,
      201,
      "Product registered successfully.",
      product
    );
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong.", err.message);
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, "Product not found.", null);
    }

    if (updates.name !== undefined) product.name = updates.name;
    if (updates.description !== undefined)
      product.description = updates.description;
    if (updates.price !== undefined) product.price = updates.price;
    if (updates.stock !== undefined) product.stock = updates.stock;

    await product.save();
    return successResponse(res, 200, "Product updated successfully.", product);
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err.message);
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found', null)
    }
    await product.deleteOne();
    return successResponse(res, 200, 'Product deleted successfully', [])

  } catch (err) {
    return errorResponse(res, 400, 'Something went wrong', err.message)
  }
}

module.exports = {
  getOrdersByProductId,
  getAllProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct,
};
