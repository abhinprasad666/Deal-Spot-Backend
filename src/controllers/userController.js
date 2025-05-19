import asyncHandler from 'express-async-handler';




//get profile
export const getProfileController=asyncHandler(async(req,res)=>{
    res.send("ok")

})