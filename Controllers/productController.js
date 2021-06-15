const mongoose = require("mongoose");
const Product = require("../models/product");


function ProductController() {
  return {
      //get all products in the database     /api/getAllProducts
    async getAllProducts(req, res) {
      let allProducts = await Product.find({});
      return res.status(200).json({ allProducts });
    },
    
    // adding a new product and updating an exiting product  /api/AddProduct
    async AddProduct(req, res) {
      const { name, color, stock, uom } = req.body;
      // checking all required fields are in the request
      if (!name || !color || !stock || !uom) {
        return res
          .status(422)
          .json({ error: "please enter all the fields in it" });
      }

      //checking the product is existing or not
      let extProduct = await Product.findOne({ name: name });

      // if product is not in the database product added to the database
      if (!extProduct) {
        let newProduct = new Product({
          name,
          color,
          stock,
          uom,
        });
        newProduct
          .save()
          .then((response) => {
            return res.status(200).json({ newProduct: response });
          })
          .catch((err) => {
            console.log("err1", err);
          });
      }
      // if the product is existing updating the required fields
       else {
           // checking the colors in the  'color' array and updating with unique colors
        let colors = extProduct.color;
        colors = [...colors, ...color];
        let unique = [...new Set(colors)];
        if (unique) {
          extProduct.color = unique;
        }

        //checking the size of the product is existing or not, if exist updating price 
        // then remove new added size and price 
        extProduct.uom.forEach((value) => {
          uom.forEach((key, index) => {
            if (value.size == key.size) {
              value.price = key.price;
              uom.splice(index, 1);
            }
          });
        });

        // adding to new size and price to the uom field update is complete
        extProduct.uom.push(...uom);

        // update product is saved
        extProduct.save();
      }
      res.status(200).json({message:'product updated',extProduct});
    },
  };
}
module.exports = ProductController;
