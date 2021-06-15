const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    products:[
        {
            item:{
                type:mongoose.Schema.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity:{
                type:Number,
                required:true
            },

        }
    ]


},{timestamps:true})

module.exports=mongoose.model('Cart',cartSchema,'cart')