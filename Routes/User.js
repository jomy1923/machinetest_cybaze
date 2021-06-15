const express = require('express')
const router = express.Router()
const formController = require('../Controllers/formController')
const requiredLogin = require('../middleWare/requiredlogin')


router.post('/Signup',formController().signup)
router.post('/Login',formController().login)
router.get('/signout',formController().signout)
router.post('/addProductsToCart',requiredLogin,formController().addProductsToCart)
router.get('/getProductsInCart',formController().getProductsInCart)



module.exports = router
