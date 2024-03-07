import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  let navigate = useNavigate();
  let [user, setUser] = useState("");
  let getMyProfile = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/users/my-profile`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(result.data.result);
      console.log(result.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMyProfile();
  }, []);
  return (
    <>
      <p>
        Name: {user.firstName} {user.lastName}{" "}
      </p>
      <p>Email: {user.email}</p>
      <p>Date of Birth: {user.dob?.split("T")[0]}</p>
      <p>Address: {user.address}</p>
      <p>Gender: {user.gender}</p>
      <p>Role: {user.role}</p>
      <button
        onClick={() => {
          navigate("update");
        }}
      >
        Edit
      </button>
    </>
  );
};

export default MyProfile;
