import { Schema } from "mongoose";

let tokenSchema = new Schema({
    token: {
        type: String,
        required: [true, "token is required"]
    },
    purpose: {
        type: String,
        required: [true, "purpose of token is required"],
        enum: ["verify-email", "reset-password", "login"]
    }
});

export default tokenSchema;