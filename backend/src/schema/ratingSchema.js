import {Schema} from "mongoose";

let ratingSchema = new Schema({
    rating: {
        type: Number,
        required: [true, "rating is required"],
        min: 0,
        max: 5
    },
    review: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    hTLocationId: {
        type: Schema.ObjectId,
        required: true
    }
}, {timestamps: true});

// ratingSchema.index({userId: 1, hTLocationId: 1}, {unique: true});

export default ratingSchema;