import { Form, Formik } from "formik";
import React from "react";
import FormikInput from "./Formik/FormikInput";
import axios from "axios";
import { displayError } from "../utils/toast";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Login = () => {
  let navigate = useNavigate();
  let initialValues = {
    email: "",
    password: "",
  };

  let onSubmit = async (data) => {
    console.log(data);
    try {
      let result = await axios({
        url: `http://localhost:8000/users/login`,
        method: `post`,
        data: data,
      });
      // console.log(result.data.token);
      localStorage.setItem("token", result.data.token);
      navigate("/");
    } catch (error) {
      // console.log(error.response.data.message);
      displayError(error.response.data.message);
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
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
              <button type="submit">Log in</button>
            </Form>
          );
        }}
      </Formik>
      <Link to="/login/forgot-password">Forgot Password?</Link>
      {/* <div style={{cursor:"pointer"}} onClick={() => {
        navigate(`/login/forgot-password`);

      }}>Forgot password?</div> */}
    </>
  );
};

export default Login;
