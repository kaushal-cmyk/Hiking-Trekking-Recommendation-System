import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const UserResetPassword = () => {
  let [password, setPassword] = useState("");
  let [oldPassword, setOldPassword] = useState("");
  let navigate = useNavigate();
  let [params] = useSearchParams()
  let token = params.get("token")

  let onSubmit = async (e) => {
    e.preventDefault();

    let data = {
      password: password,
    };
    // console.log(data)
    try {
      let result = await axios({
        url: "http://localhost:8000/web-users1/reset-password",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });


      navigate("/admin/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={onSubmit}>
        <div>
          {/* name */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="your password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>

        <button type="submit" style={{ cursor: "pointer" }}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default UserResetPassword;
