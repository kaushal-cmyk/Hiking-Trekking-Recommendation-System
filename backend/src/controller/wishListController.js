import { HTLocation, WishList } from "../schema/model.js";

export let getWishList = async (req, res) => {
  try {
    let wishList = await WishList.find({ userId: req._id });
    // console.log(wishList)
    // if (wishList.length === 0) throw new Error("wishList is empty");
    res.status(200).json({
      success: true,
      message: "wishList get successful",
      length: wishList.length,
      result: wishList,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let addToWishList = async (req, res) => {
  try {
    console.log(req.params);
    let wishListObj = await WishList.findOne({
      userId: req._id,
      hTLocationId: req.params.hTLocId,
    });
    let isHTLocationValid = await HTLocation.findById(req.params.hTLocId);
    console.log(isHTLocationValid);
    if (!isHTLocationValid) throw new Error("Cannot find hTLocation");
    if (wishListObj) throw new Error("hTLocation already in wishList");
    let data = {
      userId: req._id,
      hTLocationId: req.params.hTLocId,
    };
    let result = await WishList.create(data);
    res.status(201).json({
      success: true,
      message: "hTLocation added to wishlist",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let deleteFromWishList = async (req, res) => {
  try {
    let wishListObj = await WishList.findOne({
      userId: req._id,
      hTLocationId: req.params.hTLocId,
    });
    if (!wishListObj) throw new Error("hTLocation not in wishList");
    let result = await WishList.findByIdAndDelete(wishListObj._id);
    res.status(200).json({
      success: true,
      message: "hTLocation deleted successfully from wishList",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
