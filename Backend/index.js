const express = require('express')
const mongoose = require('mongoose')
const productRouter = require('./Router/product')
const UserRouter = require('./Router/user')
const OrderRouter = require('./Router/Order')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});
app.use(express.json())
app.use(cookieParser())


app.use('/',UserRouter)
app.use('/',productRouter)
app.use('/',OrderRouter)


app.listen(5000,()=>{
    console.log("server connected");
})