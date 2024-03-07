//Calculating Distance between two points using latitude and longitude 

function haversine(loc1, loc2) {
  let diffLat = ((loc1.latitude - loc2.latitude) * Math.PI) / 180;
  let diffLong = ((loc1.longitude - loc2.longitude) * Math.PI) / 180;
  const R = 6371; //radius of earth = 6371 km
  //   console.log(diffLat);
  let a =
    Math.pow(Math.sin(diffLat / 2), 2) +
    Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.pow(Math.sin(diffLong / 2), 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
}
export default haversine;
