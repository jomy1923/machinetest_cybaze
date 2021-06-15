const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var objectId = require('mongodb').ObjectID;
function formController() {
  return {
    // user register  /api/signup
    async signup(req, res) {
      console.log(req.body);
      const { username, email, password } = req.body;
      if (!email || !password || !username) {
        return res.status(422).json({ error: "please add all fields" });
      } else {
        //checking a user email unique or not
        await User.findOne({ email: email })
          .then((savedUser) => {
            if (savedUser) {
              return res.status(422).json({
                error: "user already existing in that username",
              });
              
            } else {
              // if email is unique then hashing the password 
              bcrypt.hash(password, 12).then((hashedPassword) => {
                const user = new User({
                  email,
                  password: hashedPassword,
                  username,
                });
                user
                  .save()
                  .then((user) => {
                    return res.json({
                      message: "New user created successfully",
                    });
                  })
                  .catch((err) => {
                    console.log("err 1", err);
                  });
              });
            }
          })
          .catch((err) => {
            console.log("err 2", err);
          });
      }
    },
    // existing user login    /api/login
    login(req, res) {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({ error: "please fill all the fields" });
      } else {
        //checking user have account in the db
        User.findOne({ email: email }).then((savedUser) => {
          if (!savedUser) {
            return res.json({ error: "something went wrong" });
          } else {
            // comparing user password using bcrypt compare
            bcrypt
              .compare(password, savedUser.password)
              .then((doMatch) => {
                if (doMatch) {
                  const token = jwt.sign(
                    { _id: savedUser._id },
                    process.env.JWT_SECRET
                  );
                  const { _id, username, email } = savedUser;
                  return res.json({ token, user: { _id, username, email } });
                } else {
                  return res.json({
                    error: "you have entered an incorrect password",
                  });
                }
              })
              .catch((err) => {
                console.log("err at the signin ", err);
              });
          }
        });
      }
    },
    signout(req, res) {
      res.localStorage.setItem("jwt", "NULL");
      res.json({ message: "Signout success" });
    },

    async addProductsToCart(req, res) {
      console.log(req.body);
      let CartDetails = req.body;
      let productId = CartDetails.productId;
      let userId = CartDetails.userId;

      let proObj = {
        item: productId,
        quantity: 1,
      };
      console.log(proObj);

      let userCart = await Cart.findOne({ user: userId });

      if (userCart) {
        let proExist = userCart.products.findIndex(
          (product) => product.item == productId
        );

        if (proExist != -1) {
          Cart.findByIdAndUpdateOne(
            { user:userId, "products.item": productId },
            {
              $inc: { "products.$.quantity": 1 },
            }
          ).then(() => {
            res.status(200).json({ message: "product quantity added" });
          });
        } else {
          Cart.updateOne(
            { user: userId },
            {
              $push: { products: proObj },
            }
          ).then((response) => {
            res.status(200).json({ message: "product added to the cart" });
          });
        }
      } else {
        let cartObj = {
          user: userId,
          products: [proObj],
        };
        console.log('cartObj',cartObj);
        Cart.insertOne(cartObj).then((response) => {
          res.status(200).json({ message: "product added to the cart" });
        });
      }
    },

    async getProductsInCart(req, res) {
      const userId = req.body;
      console.log(userId + "get cart products");

      let userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        let cartItems = await Cart.aggregate([
          {
            $match: { user: userId },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: Product,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ]).toArray();

        res.status(200).json({ message: "product added to the cart" });
      } else {
        console.log(response);
      }
    },
  };
}

module.exports = formController;
