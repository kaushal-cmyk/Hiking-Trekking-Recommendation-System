import { Schema } from "mongoose";

let wishListSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: [true, "userId is required"],
  },
  hTLocationId: {
    type: Schema.ObjectId,
    required: [true, "hTLocationId is required"],
  },
});

wishListSchema.index({ userId: 1, hTLocationId: 1 }, { unique: true });
export default wishListSchema;
