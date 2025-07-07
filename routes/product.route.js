const express = require("express");
const router = express.Router();
const productController = require('../controllers/product.controller')

router.get('/:id/orders',productController.getOrdersByProductId)
router.get('/', productController.getAllProducts)
router.get('/:id',productController.getProductById)
router.post('/', productController.createProducts)
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

module.exports = router