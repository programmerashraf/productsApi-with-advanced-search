exports.logger = async(req,res,next)=>{
    await console.log(req)
    return next()
}

