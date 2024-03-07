import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  let [query] = useSearchParams();
  // console.log(query.get("token"));
  let token = query.get("token");
  let navigate = useNavigate();

  let sendToken = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/users/verify-email`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result);
      navigate(`/login`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    sendToken();
  }, []);
  return <div>VerifyEmail</div>;
};

export default VerifyEmail;
