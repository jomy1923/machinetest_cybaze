const express = require('express')
const router = express.Router()
const ProductController = require('../Controllers/productController')



router.get('/getAllProducts',ProductController().getAllProducts)
router.post('/AddProduct',ProductController().AddProduct)



module.exports = router