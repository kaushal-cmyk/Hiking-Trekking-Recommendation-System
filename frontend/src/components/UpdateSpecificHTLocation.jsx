import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import difficultyArray from "../data/difficulty";
import routeTypeArray from "../data/routeType";
import { displayError } from "../utils/toast";
import FormikInput from "./Formik/FormikInput";
import FormikRadio from "./Formik/FormikRadio";
import FormikSelect from "./Formik/FormikSelect";
import FormikTextArea from "./Formik/FormikTextArea";

const UpdateSpecificHTLocation = () => {
  let params = useParams();
  console.log(params);
  let navigate = useNavigate();
  let [hTName, setHTName] = useState("");
  let [location, setLocation] = useState("");
  let [length, setLength] = useState(0);
  let [lengthUnit, setLengthUnit] = useState("km");
  let [elevationGain, setElevationGain] = useState(0);
  let [elevationGainUnit, setElevationGainUnit] = useState("m");
  let [startLatitude, setStartLatitude] = useState("");
  let [startLongitude, setStartLongitude] = useState("");
  let [endLatitude, setEndLatitude] = useState("");
  let [endLongitude, setEndLongitude] = useState("");
  let [attributes, setAttributes] = useState("");
  let [routeType, setRouteType] = useState("Loop");
  let [difficulty, setDifficulty] = useState("easy");
  let [description, setDescription] = useState("");

  let getHTLocationInfo = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/hTLocations/${params.hTLocId}`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(result.data.result);
      result = result.data.result;
      setHTName(result.hTName);
      setLocation(result.location);
      setLength(result.length.value);
      setLengthUnit(result.length.unit);
      setElevationGain(result.elevationGain.value);
      setElevationGainUnit(result.elevationGain.unit);
      setDescription(result.description);
      setStartLatitude(result.start.latitude);
      setStartLongitude(result.start.longitude);
      setEndLatitude(result.end.latitude);
      setEndLongitude(result.end.longitude);
      setAttributes(result.attributes.join(","));
      setRouteType(result.routeType);
      setDifficulty(result.difficulty);
    } catch (error) {
      console.log(error);
    }
  };

  let checkingAuthorization = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/hTLocations/${params.hTLocId}`,
        method: `patch`,
        data: {},
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(result);
    } catch (error) {
      console.log(error.response.data.message);
      // console.log("You do not have authorization")
      navigate('/*');
      
    }
  };
  useEffect(() => {
    getHTLocationInfo();
    checkingAuthorization();
  }, []);

  let initialValues = {
    hTName: hTName,
    location: location,
    length: length,
    lengthUnit: lengthUnit,
    elevationGain: elevationGain,
    elevationGainUnit: elevationGainUnit,
    description: description,
    startLatitude: startLatitude,
    startLongitude: startLongitude,
    endLatitude: endLatitude,
    endLongitude: endLongitude,
    attributes: attributes,
    routeType: routeType,
    difficulty: difficulty,
  };
  let onSubmit = async (data) => {
    console.log("data", data);
    let attributes = data.attributes.split(",").map((item, i) => item.trim());
    data = {
      hTName: data.hTName,
      location: data.location,
      length: {
        value: data.length,
        unit: data.lengthUnit,
      },
      elevationGain: {
        value: data.elevationGain,
        unit: data.elevationGainUnit,
      },
      start: {
        latitude: data.startLatitude,
        longitude: data.startLongitude,
      },
      end: {
        latitude: data.endLatitude,
        longitude: data.endLongitude,
      },
      attributes: attributes,
      routeType: data.routeType,
      difficulty: data.difficulty,
      description: data.description
    };
    try {
      let result = await axios({
        url: `http://localhost:8000/hTLocations/${params.hTLocId}`,
        method: `patch`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(result);
      navigate(`/hTLocations/${result.data.result._id}`);
    } catch (error) {
      console.log(error.response.data.message);
      displayError(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer></ToastContainer>
      <Formik
        initialValues={initialValues}
        // validationSchema={}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formik) => {
          return (
            <Form>
              <FormikInput
                id="hTName"
                label="Hike/Trek name"
                type="text"
                name="hTName"
                onChange={(e) => {
                  formik.setFieldValue("hTName", e.target.value);
                }}
                required={true}
              ></FormikInput>
              <br></br>
              <FormikInput
                id="location"
                label="Location"
                type="text"
                name="location"
                onChange={(e) => {
                  formik.setFieldValue("location", e.target.value);
                }}
                required={true}
              ></FormikInput>
              <br></br>
              <span>Starting Point</span>
              <FormikInput
                id="startLatitude"
                type="text"
                name="startLatitude"
                placeholder="Latitude"
                onChange={(e) => {
                  formik.setFieldValue("startLatitude", e.target.value);
                }}
                required={true}
              ></FormikInput>
              <FormikInput
                id="startLongitude"
                type="text"
                name="startLongitude"
                placeholder="Longitude"
                onChange={(e) => {
                  formik.setFieldValue("startLongitude", e.target.value);
                }}
                required={false}
              ></FormikInput>
              <br></br>
              <span>Ending Point</span>
              <FormikInput
                id="endLatitude"
                type="text"
                name="endLatitude"
                placeholder="Latitude"
                onChange={(e) => {
                  formik.setFieldValue("endLatitude", e.target.value);
                }}
                required={true}
              ></FormikInput>
              <FormikInput
                id="endLongitude"
                type="text"
                name="endLongitude"
                placeholder="Longitude"
                onChange={(e) => {
                  formik.setFieldValue("endLongitude", e.target.value);
                }}
                required={false}
              ></FormikInput>
              <br></br>
              <FormikInput
                label="Length"
                id="length"
                type="text"
                name="length"
                placeholder="length"
                onChange={(e) => {
                  formik.setFieldValue("length", e.target.value);
                }}
                required={false}
              ></FormikInput>
              <FormikSelect
                options={[
                  { value: "m", label: "Metre" },
                  { value: "km", label: "Kilometre" },
                ]}
                name="lengthUnit"
                label="Length Unit: "
                id="lengthUnit"
              ></FormikSelect>
              <br></br>
              <FormikInput
                label="Elevation Gain"
                id="elevationGain"
                type="text"
                name="elevationGain"
                placeholder="elevationGain"
                onChange={(e) => {
                  formik.setFieldValue("elevationGain", e.target.value);
                }}
                required={false}
              ></FormikInput>
              <FormikSelect
                options={[
                  { value: "m", label: "Metre" },
                  { value: "km", label: "Kilometre" },
                ]}
                name="elevationUnit"
                label="Elevation Unit: "
                id="elevationUnit"
              ></FormikSelect>
              <br></br>
              <FormikInput
                label="Attributes"
                id="attributes"
                type="text"
                name="attributes"
                placeholder="Attributes separated by comma(,)"
                onChange={(e) => {
                  formik.setFieldValue("attributes", e.target.value);
                }}
                required={false}
              ></FormikInput>
              <br></br>
              <FormikTextArea
                name="description"
                id="description"
                onChange={(e) => {
                  formik.setFieldValue("description", e.target.value);
                }}
                label="Description: "
                placeholder="Write about the location here"
              ></FormikTextArea>
              <FormikRadio
                options={difficultyArray}
                label="Difficulty"
                name="difficulty"
                required={true}
              ></FormikRadio>
              <br></br>
              <FormikRadio
                label="Route Type"
                options={routeTypeArray}
                name="routeType"
                required={true}
              ></FormikRadio>
              <br></br>
              <button type="submit" style={{cursor: "pointer"}}>Edit</button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default UpdateSpecificHTLocation;
