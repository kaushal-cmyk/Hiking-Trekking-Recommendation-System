import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const UserUpdatePassword = () => {
  let [newPassword, setNewPassword] = useState("");
  let [oldPassword, setOldPassword] = useState("");
  let navigate = useNavigate();
  let token = localStorage.getItem("token");

  let onSubmit = async (e) => {
    e.preventDefault();

    let data = {
      newPassword: newPassword,
      oldPassword: oldPassword,
    };
    // console.log(data)
    try {
      let result = await axios({
        url: "http://localhost:8000/web-users1/update-password",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={onSubmit}>
        {/* Date Of Birth */}
        <div>
          <label htmlFor="oldPassword">Old Password: </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          ></input>
        </div>

        <div>
          {/* name */}
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            placeholder="your password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          ></input>
        </div>

        <button type="submit" style={{ cursor: "pointer" }}>
          Update
        </button>
      </form>
    </div>
  );
};

export default UserUpdatePassword;
