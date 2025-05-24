import asyncHandler from "express-async-handler";



export const roleLoginController=asyncHandler(async(req,res)=>{
       switch (decodedToken.role) {
            case "customer":
            case "admin": // Assuming both are stored in User model
                user = await User.findById(decodedToken.userId).select("-password");
                break;
            case "seller":
                user = await Seller.findById(decodedToken.userId).select("-password");
                break;
            default:
                res.status(401);
                throw new Error("Invalid role inside token.");
        }
})