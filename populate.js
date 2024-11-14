require("dotenv").config()
const connectDB = require("./db/connect")
const product = require("./models/product.model")
const jsonProducts = require("./products.json")

const start =  async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        await product.deleteMany()
        await product.create(jsonProducts)
        console.log('success')
        process.exit(0)
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}

start()