const express = require('express')
const Router = express.Router()
const ProductsController = require("../controllers/products.controller")

Router.post("/",ProductsController.createProduct)
Router.get("/", ProductsController.getProducts)
Router.get("/:id", ProductsController.getProduct)
Router.patch("/:id", ProductsController.updateProduct)
Router.delete("/:id", ProductsController.deleteProduct)

module.exports = Router