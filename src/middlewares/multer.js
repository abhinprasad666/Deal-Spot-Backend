import multer from "multer";


const storage = multer.diskStorage({
 
  filename: function (req, file, cb) {
   
    console.log("multerfile",file)
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })