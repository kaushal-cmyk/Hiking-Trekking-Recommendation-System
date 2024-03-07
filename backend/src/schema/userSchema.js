import { Schema } from "mongoose";


let userSchema = new Schema({
    firstName: {
        type: String,  
        required: [true, "firstName is required"]
    },
    lastName: {
        type: String,
        required: [true, "lastName is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    address: {
        type: String,
        required: [true, "address is required"]
    },
    dob: {
        type: Date,
        required: [true, "dob is required"]
    },
    gender: {
        type: String,
        required: [true, "gender is required"],
        enum: ["male", "female", "others"]
    },
    role : {
        type: String,
        required: [true, "role field is required."]
    },
    isVerifiedEmail: {
        type: Boolean,
        required: [true, "isVerifiedEmail is required"]
    }
}, {timestamps: true});

export default userSchema;