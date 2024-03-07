import { Schema } from "mongoose";


let hTLocationSchema = new Schema({
    hTName: {
        type: String,
        required: [true, "hTName is required"]
    },
    location: {
        type: String,
        required: [true, "location is required"]
    },
    description: {
        type: String,
        required: [false]
    },
    difficulty: {
        type: String,
        required: [true, "difficulty is required"]
    },
    length: {
        value: {
            type: Number,
            required: [true, "value is required"]
        },
        unit: {
            type: String,
            required: [true, "unit is required"]
        }
    },
    elevationGain: {
        value: {
            type: Number,
            required: [true, "elevationGain is required"]
        },
        unit: {
            type: String,
            required: [true, "unit is required"]
        }
    },
    routeType: {
        type: String,
        required: [true, "routeType is required"]
    },
    attributes: {
        type: [String],
        required: [true, "attributes is required"],
        // enum: ["loop", "out and back", "point to point", "dog friendly", "kid friendly", "camping", "waterfall", "river", "lake", "wildflowers", "wildlife", "views"]
    },
    // hTLocationId: {
    //     type: String,
    //     required: [true, "hTLocationId is required"],
    //     unique: true
    // },
    userId: {
        type: Schema.ObjectId,
        required: [true, "userId is required"],
    },
    start: {
        latitude: {
            type: String,
            required: [true, "latitude is required"]
        },
        longitude: {
            type: String,
            required: [true, "longitude is required"]
        }
    },
    end: {
        latitude: {
            type: String,
            required: [true, "latitude is required"]
        },
        longitude: {
            type: String,
            required: [true, "longitude is required"]
        }
    },
    estTime:{
        type: String,
        required: false
    },
    avgRating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    pictures: {
        type: [String],
        required: true
    },
    nWishList: {
        type: Number,
        required: [true, "nWishList is required"]
    }
}, {timestamps: true});

export default hTLocationSchema;
