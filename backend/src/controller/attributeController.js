import { Attribute, HTLocation } from "../schema/model.js";

export let addAttribute = async (req, res) => {
  try {
    let hTLocations = await HTLocation.find({});
    console.log(hTLocations);
    hTLocations.forEach((hTLocation, i) => {
      let attributes = hTLocation.attributes;
      attributes.forEach(async (attribute, j) => {
        let result = await Attribute.findOne({ attribute: attribute });
        // console.log(result);
        if (!result) await Attribute.create({ attribute: attribute });
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export let getAttribute = async (req, res) => {
try {
      let attributes = await Attribute.find({});
      attributes = attributes.map((a, i) => {
        return a.attribute;
      });
      res.json({
        success: true,
        message: "Attributes read successful",
        result: attributes,
      });
} catch (error) {
    res.json({
        success: false,
        message: error.message
    })
}
};
