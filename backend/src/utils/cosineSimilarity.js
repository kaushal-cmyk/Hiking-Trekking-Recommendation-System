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

export default cosineSimilarity;