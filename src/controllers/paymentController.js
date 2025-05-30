const Product = require('../models/productsModel')
const { cloudinaryInstance } = require('../config/cloudinary');


// Create a new product
const createProduct = async (req, res,next) => {
    try {
        const {title,price,description,rating,stock,colors,catagoryID} = req.body || {}

        // Validate input
        if(!title || !price || !description|| !stock || !catagoryID){
            return res.status(400).json({error:"All fields are required"})
        }

        // take file deatails from multer
        const files = req.files
        if (!files || files.length === 0) {
        return res.status(400).json({ error: "At least one file is required" });
        }
        // console.log(files)

        // upload an image
        const cloudinaryResponse =files.map(file =>
        cloudinaryInstance.uploader.upload(file.path));

        const cloudinaryResults = await Promise.all(cloudinaryResponse);

        // console.log(cloudinaryResults)

        const sellerId = req.user.id

        const newProduct = new Product({
            title,
            price,
            description,
            rating: rating || 0,
            stock,
            colors: colors || [],
            images: cloudinaryResults.map(result => result.url),
            sellerId: sellerId,
            catagoryID: catagoryID
        })
        // save product to db
        await newProduct.save()

        res.status(200).json({
            success:true,
            message:"poduct created successfully",
            product:newProduct})

    } catch (error) {
       console.log(error)
        res.status(error.status||500).json({error:error.message || 
        'Internal Server Error'})   
    }
}

module.exports = {
    createProduct
}