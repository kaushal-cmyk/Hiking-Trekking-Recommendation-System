import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import FormikInput from "./Formik/FormikInput";
import FormikRadio from "./Formik/FormikRadio";
import genders from "../data/gender";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateMyProfile = () => {
    let navigate = useNavigate();
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [address, setAddress] = useState("");
  let [gender, setGender] = useState("male");
  let [dob, setDob] = useState("");
  let initialValues = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    gender: gender,
    dob: dob,
  };

  let getUserData = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/users/my-profile`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let userInfo = result.data.result;
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setAddress(userInfo.address);
      setGender(userInfo.gender);
      setDob(userInfo.dob.split("T")[0]);
    //   console.log(result.data.result);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  let onSubmit = async (data) => {
    try {
      let result = await axios({
        url: `http://localhost:8000/users/my-profile`,
        method: `patch`,
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(result);
      navigate(`/users/my-profile`)
    } catch (error) {
        console.log(error.response.data.message);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formik) => {
        return (
          <Form>
            <FormikInput
              label="First Name"
              id="firstName"
              name="firstName"
              type="text"
              onChange={(e) => {
                formik.setFieldValue("firstName", e.target.value);
              }}
            ></FormikInput>
            <br></br>
            <FormikInput
              label="Last Name"
              id="lastName"
              name="lastName"
              type="text"
              onChange={(e) => {
                formik.setFieldValue("lastName", e.target.value);
              }}
            ></FormikInput>
            <br></br>
            <FormikInput
              label="Address"
              id="address"
              name="address"
              type="text"
              onChange={(e) => {
                formik.setFieldValue("address", e.target.value);
              }}
            ></FormikInput>
            <br></br>
            <FormikRadio
              options={genders}
              name="gender"
              onChange={(e) => {
                formik.setFieldValue("gender", e.target.value);
              }}
            ></FormikRadio>
            <FormikInput
              label="Date of Birth"
              id="dob"
              name="dob"
              type="date"
              onChange={(e) => {
                formik.setFieldValue("date", e.target.value);
              }}
            ></FormikInput>
            <br></br>
            <button type="submit">update</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UpdateMyProfile;
