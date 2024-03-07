import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SimilarLocations from "./SimilarLocations";

const ShowSpecificHTLocation = () => {
  let [edit, setEdit] = useState([]);
  let navigate = useNavigate();
  let params = useParams();
  let [hTLocation, setHTLocation] = useState({});
  // console.log(params);
  let isCreated = async () => {
    try {
      let hTLocationsOfUser = await axios({
        url: `http://localhost:8000/hTLocations/user`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      hTLocationsOfUser = hTLocationsOfUser.data.result;
      hTLocationsOfUser = hTLocationsOfUser.map((item, i) => {
        return item._id;
      });
      setEdit(hTLocationsOfUser);
    } catch (error) {
      console.log(error);
    }
  };
  let getSpecificHTLocation = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/hTLocations/${params.hTLocId}`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(result.data.result);
      setHTLocation(result.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSpecificHTLocation();
    isCreated();
  }, []);
  //   console.log(hTLocation);
  return (
    <>
      <h1>Name: {hTLocation.hTName}</h1>
      <p>Location: {hTLocation.location}</p>
      <p>Difficult: {hTLocation.difficulty}</p>
      <p>Description: {hTLocation.description}</p>
      <p>
        Length: {hTLocation.length?.value}
        {hTLocation.length?.unit}
      </p>
      <p>
        Elevation Gain: {hTLocation.elevationGain?.value}
        {hTLocation.elevationGain?.unit}
      </p>
      <p>Route Type: {hTLocation.routeType}</p>
      <div>
        <p>Starting Point</p>
        <ul>
          <li>latitude: {hTLocation.start?.latitude}</li>
          <li>longitude: {hTLocation.start?.longitude}</li>
        </ul>
      </div>
      <div>
        <p>Ending Point</p>
        <ul>
          <li>latitude: {hTLocation.end?.latitude}</li>
          <li>longitude: {hTLocation.end?.longitude}</li>
        </ul>
      </div>
      <p>Attributes</p>
      {hTLocation.attributes?.map((attribute, i) => {
        return (
          <span style={{ marginInline: "5px", backgroundColor: "lightgreen" }} key={i}>
            {attribute}
          </span>
        );
      })}
      <br></br>
      {edit.includes(hTLocation._id) ? (
        <button
          onClick={() => {
            navigate(`/hTLocations/update/${params.hTLocId}`);
          }}
        >
          Edit
        </button>
      ) : null}
      <SimilarLocations hTLocId = {params.hTLocId}></SimilarLocations>
    </>
  );
};

export default ShowSpecificHTLocation;
