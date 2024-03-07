import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import axios, { Axios } from "axios";
import { ToastContainer } from "react-toastify";
import { displayError, displaySuccess } from "../utils/toast";
import FormikInput from "./Formik/FormikInput";
import FormikRadio from "./Formik/FormikRadio";
import genders from "../data/gender";
import * as yup from "yup";

const Register = () => {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [dob, setDob] = useState("");
  let [address, setAddress] = useState("");
  let [gender, setGender] = useState("female");
  let [location, setLocation] = useState({});

  let success = (pos) => {
    console.log(pos);
    setLocation(pos);
  };
  let error = (e) => {
    console.log(e);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);
  // console.log(location);
  localStorage.setItem("latitude", location.coords?.latitude);
  localStorage.setItem("longitude", location.coords?.longitude);

  let initialValues = {
    firstName: "",
    lastName: "",
    gender: "male",
    dob: "",
    address: "",
    password: "",
    email: "",
  };

  let onSubmit = async (data) => {
    data.role = "user";
    try {
      let result = await axios({
        url: "http://localhost:8000/users",
        method: "post",
        data: data,
      });
      displaySuccess(result.data.message);
      console.log(result);
    } catch (error) {
      console.log(error.response.data.message);
      displayError(error.response.data.message);
    }
  };

  let validationSchema = yup.object({
    firstName: yup.string().required("First name is required").min(2,"should be atleast 2 characters"),
    lastName: yup.string().required("Last name is required").min(2, "should be atleast 2 characters"),
    gender: yup.string(),
    dob: yup.date().required("Date of birth is required"),
    address: yup.string().required("Address is required"),
    password: yup
      .string()
      .required("Password is required"),
      // .matches(
      //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      //   "Password is not Strong"
      // ),
    email: yup
      .string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is invalid"
      ),
  });
  return (
    <>
      <ToastContainer></ToastContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {(formik) => {
          return (
            <Form>
              <FormikInput
                label="First Name"
                id="firstName"
                type="text"
                name="firstName"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("firstName", e.target.value);
                }}
              ></FormikInput>
              <br></br>
              <FormikInput
                label="Last Name"
                id="lastName"
                type="text"
                name="lastName"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("lastName", e.target.value);
                }}
              ></FormikInput>
              <br></br>
              <FormikInput
                label="Email"
                id="email"
                type="email"
                name="email"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("email", e.target.value);
                }}
              ></FormikInput>
              <br></br>
              <FormikInput
                label="Password"
                id="password"
                type="password"
                name="password"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value);
                }}
              ></FormikInput>
              <br></br>
              <FormikInput
                label="Address"
                id="address"
                type="text"
                name="address"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("address", e.target.value);
                }}
              ></FormikInput>
              <br></br>
              <FormikInput
                label="Date of Birth"
                id="dob"
                type="date"
                name="dob"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("dob", e.target.value);
                }}
              ></FormikInput>
              <br></br>
              <FormikRadio
                label="Gender"
                options={genders}
                name="gender"
                required={true}
                onChange={(e) => {
                  formik.setFieldValue("gender", e.target.value);
                  console.log(e.target.value);
                }}
              ></FormikRadio>
              <br></br>
              <button type="submit">Register</button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Register;
