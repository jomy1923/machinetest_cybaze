const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add product name'],
        trim:true,
        maxLength:[100,'Product name cannot be more than 100']
    },
    color:{
        type:[String],
        required:[true,'Please add product color'],
        trim:true,
    },
    uom:[
        {
            size:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            }

        }
    ],
    stock:{
        type:Number,
        required:[true,'Please add product stock'],
        default:0
    }


},{timestamps:true})

module.exports=mongoose.model('Product',productSchema,'Products')