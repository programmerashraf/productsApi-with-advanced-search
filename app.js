require('dotenv').config()
require("express-async-errors")
const mongoose = require('mongoose')
const connectDB = require('./db/connect')
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found');
// const logger = require('./middleware/logger')
const productsRouter = require('./routes/products.routes');
const bodyParser = require('body-parser');
app.use(express.static('./public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.use(logger)
app.use('/api/v1/products',productsRouter)

app.get('/',(req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">go to Products route</a>')
})

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)
const start = async ()=>{

    try{
        await connectDB(process.env.MONGO_URL)
        console.log("Connected")
        app.listen(PORT,console.log(`server is running at https://localhost:${PORT}`))
    }catch(error){
        console.log(error.message)
    }

}

start()