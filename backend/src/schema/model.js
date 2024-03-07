import { model } from "mongoose";
import hTLocationSchema from "./hTLocationSchema.js";
import userSchema from "./userSchema.js";
import tokenSchema from "./tokenSchema.js";
import ratingSchema from "./ratingSchema.js";
import wishListSchema from "./wishListSchema.js";
import attributeSchema from "./attributeSchema.js";


export let HTLocation = new model("HTLocation", hTLocationSchema);
export let User = new model("User", userSchema);
export let Rating = new model("Rating", ratingSchema);
export let Token = new model("Token", tokenSchema);
export let WishList = new model("WishList", wishListSchema);
export let Attribute = new model("Attribute", attributeSchema);
