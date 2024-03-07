import connectToMongoDB from "./src/connectToDB/connectToMongoDB.js";

import { Attribute, HTLocation } from "./src/schema/model.js";

await connectToMongoDB();

let hTLocations = await HTLocation.find({});
let attributes = await Attribute.find({});

// console.log(hTLocation);
// console.log(attributes);

let attArray = attributes.map((a, i) => {
  return a.attribute;
});
// console.log(attArray);

let itemMatrix = [];

itemMatrix[0] = [
  "length <= 20km",
  "length <= 50km",
  "length > 50km",
  "elevationGain <= 500m",
  "elevationGain <= 2000m",
  "elevationGain > 2000m",
  "easy",
  "moderate",
  "hard",
  "Loop",
  "Out & Back",
  "Point to Point",
  ...attArray,
];
// console.log(itemMatrix[0]);

for (let i = 0; i < hTLocations.length; i++) {
  // console.log(hTLocations[i]);
  //length
  itemMatrix[i + 1] = [];
  if (hTLocations[i].length.value < 20) {
    itemMatrix[i + 1][0] = 1;
    itemMatrix[i + 1][1] = 0;
    itemMatrix[i + 1][2] = 0;
  } else if (hTLocations[i].length.value < 50) {
    itemMatrix[i + 1][0] = 0;
    itemMatrix[i + 1][1] = 1;
    itemMatrix[i + 1][2] = 0;
  } else {
    itemMatrix[i + 1][0] = 0;
    itemMatrix[i + 1][1] = 0;
    itemMatrix[i + 1][2] = 1;
  }
  //elevationGain
  if (hTLocations[i].elevationGain.value <= 500) {
    itemMatrix[i + 1][3] = 1;
    itemMatrix[i + 1][4] = 0;
    itemMatrix[i + 1][5] = 0;
  } else if (hTLocations[i].elevationGain.value <= 2000) {
    itemMatrix[i + 1][3] = 0;
    itemMatrix[i + 1][4] = 1;
    itemMatrix[i + 1][5] = 0;
  } else {
    itemMatrix[i + 1][3] = 0;
    itemMatrix[i + 1][4] = 0;
    itemMatrix[i + 1][5] = 1;
  }
  // delete hTLocations[i].hTName;
  // delete hTLocations[i].location;
  // delete hTLocations[i].description;
  // delete hTLocations[i].length;
  // delete hTLocations[i].elevationGain;
  // delete hTLocations[i].userId;
  // delete hTLocations[i].start;
  // delete hTLocations[i].end;
  // delete hTLocations[i].pictures;
  // delete hTLocations[i].nWishList;
  // delete hTLocations[i]._id;
  // delete hTLocations[i].createdAt;
  // delete hTLocations[i].updatedAt;
  // delete hTLocations[i].__v;
  if (hTLocations[i].difficulty === "easy") {
    itemMatrix[i + 1][6] = 1;
    itemMatrix[i + 1][7] = 0;
    itemMatrix[i + 1][8] = 0;
  } else if (hTLocations[i].difficulty === "moderate") {
    itemMatrix[i + 1][6] = 0;
    itemMatrix[i + 1][7] = 1;
    itemMatrix[i + 1][8] = 0;
  } else {
    itemMatrix[i + 1][6] = 0;
    itemMatrix[i + 1][7] = 0;
    itemMatrix[i + 1][8] = 1;
  }

  if (hTLocations[i].routeType === "Loop")
  {
    itemMatrix[i + 1][9] = 1;
    itemMatrix[i + 1][10] = 0;
    itemMatrix[i + 1][11] = 0;

  }
  else if (hTLocations[i].routeType === "Out & Back")
  {
    itemMatrix[i+1][9] = 0;
    itemMatrix[i+1][10] = 1;
    itemMatrix[i+1][11] = 0;
  }  
  else
  {
    itemMatrix[i+1][9] = 0;
    itemMatrix[i+1][10] = 0;
    itemMatrix[i+1][11] = 1;
  }  
  hTLocations[i].attributes.forEach((attribute, index) => {
    // console.log(attribute);
    for (let j = 12; j < itemMatrix[0].length; j++) {
      if (attribute === itemMatrix[0][j]) {
        // console.log(j);
        // console.log(itemMatrix[0][j])
        itemMatrix[i + 1][j] = 1;
        break;
      }
    }
  });
  for (let j = 9; j < itemMatrix[0].length; j++) {
    if (itemMatrix[i + 1][j] !== 1) {
      itemMatrix[i + 1][j] = 0;
    }
  }
  // console.log(itemMatrix[1]);
}

let similarityMatrix = [];
for (let i = 1; i < itemMatrix.length; i++) {
  similarityMatrix[i] = [];
  for (let j = 1; j < itemMatrix.length; j++) {
    similarityMatrix[i].push(cosineSimilarity(itemMatrix[i], itemMatrix[j]));
  }
}

// console.log(similarityMatrix[1]);
// console.log(similarityMatrix[3].length);
let similarityObjectMatrix = [];
for (let i = 1; i < similarityMatrix.length; i++) {
  similarityObjectMatrix[i-1] = [];
  for (let j = 0; j < similarityMatrix[i].length; j++) {
    similarityObjectMatrix[i-1].push({
      value: similarityMatrix[i][j],
      similarToIndex: j,
    });
  }
//   console.log(similarityObjectMatrix[i-1].length);
  similarityObjectMatrix[i-1].sort((a, b) => b.value - a.value);
}
console.log(similarityObjectMatrix[0]);
function cosineSimilarity(ar1, ar2) {
  if (ar1.length !== ar2.length) {
    throw new Error("length of both array needs to be equal");
  }
  let sumProduct = 0;
  let denomAr1 = 0;
  let denomAr2 = 0;
  ar1.forEach((value, i) => {
    sumProduct += value * ar2[i];
    denomAr1 += value * value;
    denomAr2 += ar2[i] * ar2[i];
  });
  let denom = Math.sqrt(denomAr1) * Math.sqrt(denomAr2);
  if (denom === 0) return 0;
  else return sumProduct / denom;
}
