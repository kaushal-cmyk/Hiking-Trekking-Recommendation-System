import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import FormikInput from "./Formik/FormikInput";
import FormikTextArea from "./Formik/FormikTextArea";
import FormikSelect from "./Formik/FormikSelect";
import FormikRadio from "./Formik/FormikRadio";
import difficulty from "../data/difficulty";
import routeType from "../data/routeType";
import { displayError } from "../utils/toast";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const CreateHTLocation = () => {
  let navigate = useNavigate();
  let [attributes, setAttributes] = useState([]);
  let getAttributes = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/attributes`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAttributes(result.data.result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  //   useEffect(() => {
  //     getAttributes();
  //   }, []);
  let initialValues = {
    hTName: "",
    location: "",
    length: 0,
    lengthUnit: "km",
    elevationGain: 0,
    elevationGainUnit: "m",
    description: "",
    startLatitude: "",
    startLongitude: "",
    endLatitude: "",
    endLongitude: "",
    attributes: "",
    routeType: "",
    difficulty: "",
  };
  let validationSchema = yup.object({
    hTName: yup.string().required("Hike/Trek name is required"),
    location: yup.string().required("Location is required"),
    length: yup.number().required("Length of the trail is required"),
    lengthUnit: yup.string(),
    elevationGain: yup
      .number()
      .required("Elevation Gain of the trail is required"),
    elevationGainUnit: yup.string(),
    description: yup.string().max(300, "Too Long"),
    startLatitude: yup
      .string()
      .required("Latitude is required")
    //   .matches(
    //     /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
    //     "Should have format of xx.xxxx "
    //   ),
    ,
    startLongitude: yup
      .string()
      .required("Longitude is required")
    //   .matches(
    //     /^[+-]? ( [0-9]+ ( [.] [0-9]*)?| [.] [0-9]+)$/,
    //     "Should have format of xx.xxxx "
    //   ),
    // .matches(/^[0-9]+$/, "no match"
    // )
    ,
    endLatitude: yup
      .string()
      .required("Latitude is required")
    //   .matches(
    //     /^[+-]? ( [0-9]+ ( [.] [0-9]*)?| [.] [0-9]+)$/,
    //     "Should have format of xx.xxxx "
    //   ),
    ,
    endLongitude: yup
      .string()
      .required("Longitude is required")
    //   .matches(
    //     /^[+-]? ( [0-9]+ ( [.] [0-9]*)?| [.] [0-9]+)$/,
    //     "Should have format of xx.xxxx "
    //   ),
    ,
    attributes: yup
      .string()
      .required("Attributes are requried")
    //   .matches(
    //     /^[a-zA-Z0-9]+ (, [a-zA-Z0-9]+)*$/,
    //     "Attributes must be separated by comma"
    //   ),
    ,
    routeType: yup.string(),
    difficulty: yup.string(),
  });
  let onSubmit = async (data) => {
    console.log(data);
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
    };
    try {
      let result = await axios({
        url: `http://localhost:8000/hTLocations/`,
        method: `post`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(result);
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
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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
                options={difficulty}
                label="Difficulty"
                name="difficulty"
                required={true}
              ></FormikRadio>
              <br></br>
              <FormikRadio
                label="Route Type"
                options={routeType}
                name="routeType"
                required={true}
              ></FormikRadio>
              <br></br>
              <button type="submit">Create</button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default CreateHTLocation;
