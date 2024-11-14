const Products= require("../models/product.model")

exports.getProducts = async(req,res)=>{
    // return all products
    // if query params are attached use them to search (featured,company,name)
    // for the name use reg expresssions
    // add the sort feature
    // select specific fields
    // add pagination with skip and limit

    try {
        const queryObjects = {}
        const {featured,company,name,sort,fields} = req.query
        if(featured) queryObjects.featured = featured === 'true'?true:false
        if(company) queryObjects.company = company
        if(name) queryObjects.name = {$regex:name,$options:'i'}
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
        res.status(200).json({rows:products.length,products:products})
    }catch(error){
        res.status(404).json({message:error.message})
    }
}