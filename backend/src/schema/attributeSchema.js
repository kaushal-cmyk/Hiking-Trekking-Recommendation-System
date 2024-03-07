import { Schema } from "mongoose";


let attributeSchema = new Schema({
    attribute: {
        type: String,
        required: true,
        unique: true
    }
});

export default attributeSchema;