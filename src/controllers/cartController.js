// profile
const profile = async (req, res) => {
    try {
        const userId=req.user.id

        const userData = await User.findById(userId).select("-password")
        return res.status(200).json({data:userData,message:"Profile retrived"})

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({error: error.message ||
         'Internal Server Error'})
    }
}

// update profile
const update = async (req, res) => {
    try {
        const userId=req.user.id

        const{name,email,password,profilepic,bio,expertise} =req.body ||{}

        const userData = await User.findByIdAndUpdate(userId,{name,email,password,profilepic,bio,expertise},{new:true}).select("-password")
        return res.status(200).json({data:userData,message:"Profile updated"})

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({error: error.message ||
         'Internal Server Error'})
    }
}