const express = require("express")
const app = express()
var dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose')
const user = require("./Routes/User");
const product = require("./Routes/Product")

//Db connection
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.connection.on('connected',()=>{
  console.log('CONNECTED TO MONGOOSE'); 
})
mongoose.connection.on('err',(err)=>{
  console.log('mongodb error',err);
})

//Middleware

app.use(express.json())
app.use("/api", user);
app.use("/api", product);

//PORT configuration
app.listen(PORT, () => {
    console.log(`App is listening on local HOST ${PORT}`);
  });