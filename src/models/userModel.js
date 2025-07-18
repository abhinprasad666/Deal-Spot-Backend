import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name required!"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email required!"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password required!"],
            minLength: [8, "Password must be at least 8 characters"],
            maxLength: [128, "Password cannot exceed 128 characters"],
        },
        resetPasswordOtp:{
                    type:String
        },
       resetPasswordExpire:{
            type:Date
        },
        role: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer",
        },
        profilePic: {
            type: String,
            default: "",
        },
        status: {
            type: "String",
            enum: ["active", "blocked", "deleted"],
            default: "active",
        },
        statusUpdatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (givenPassword) {
    return await bcrypt.compare(givenPassword, this.password);
};

const User = model("User", userSchema);

export default User;
