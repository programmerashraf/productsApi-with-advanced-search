const Products = require("../models/product.model")

exports.getProducts = async(req,res)=>{
    try {
        const queryObjects = {}
        const {featured,company,name,price,sort,fields,numericFilters} = req.query
        if(featured) queryObjects.featured = featured === 'true'?true:false
        if(company) queryObjects.company = company
        if(price) queryObjects.price = price
        if(name) queryObjects.name = {$regex:name,$options:'i'}

        if(numericFilters){
            const operatorMap = {
                '>':'$gt',
                '>=':'$gte',
                '=':'$eq',
                '<':'$lt',
                '<=':'$lte',
            }
            const regEx = /\b(<|<=|=|>|>=)\b/g
            let filters = numericFilters.replace(
                regEx,
                (match)=>`-${operatorMap[match]}-`
            )
            const options = ['price','rating']
            filters = filters.split(',').forEach(item => {
                const [field,operator,value] = item.split('-')
                if(options.includes(field) && Number(value)){
                    queryObjects[field] = { [operator]: Number(value) }
                }
            });
        }
        
        let result =  Products.find(queryObjects)
        if(sort){
            const sortList = sort.split(",").join(" ")
            result = result.sort(sortList)
        }
        if(fields){
            const fieldsList = fields.split(",").join(" ")
            result = result.select(fieldsList)
        }
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1)*limit
        result = result.skip(skip).limit(limit)
        products = await result
        res.status(200).json({rows:products.length,page:page,products:products})
    }catch(error){
        res.status(404).json({message:error.message})
        console.log(error)
    }
}

exports.getProduct = async (req,res)=>{
    try{
        const {id} = req.params
        const product = await Products.findById(id)
        res.status(201).json({"product":product})

    }catch(error){
        res.status(404).json({"message":error.message})
        console.log(error)
    }
}

exports.createProduct = async(req,res)=>{
    try{
        
        const Product = await Products.create(req.body)
        if(Products){
            res.status(200).json(Product)
            console.log(`${Product._id} Created`)
        }
    }catch(error){
        res.status(404).json({"message":error.message})
        console.log(error)
    }
};

exports.updateProduct = async (req,res)=>{
    try{
        const { id } = req.params
        const product = await Products.findByIdAndUpdate(id,req.body,{new:true})
        if(!product){
            res.status(404).json({"message":"product not found"})
        }
        res.status(201).json({"product":product})
        
    }catch(error){
        res.status(404).json({"message":error.message})
        console.log(error)
    }
}

exports.deleteProduct = async (req,res)=>{
    try{
        const {id} = req.params
        const product = await Products.findByIdAndDelete(id)
        if(!product){
            res.status(404).json({"message":"product not found"})
        }
        res.status(201).json({"message":"deleted"})
        
    }catch(error){
        res.status(404).json({"message":error.message})
        console.log(error)
    }
}
