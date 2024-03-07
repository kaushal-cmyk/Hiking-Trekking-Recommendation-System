import axios from 'axios';
import React, { useState } from 'react'
import { displayError, displaySuccess } from '../utils/toast';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword =  () => {
    let navigate = useNavigate();
    let [email, setEmail] = useState("");
    let onSubmit = async (e) => {
        e.preventDefault();
        try{
            let result = await axios({
                url: `http://localhost:8000/users/forgot-password`,
                method: `post`,
                data: {email: email}
            });
            console.log(result);
            // displaySuccess(result.data.message);
            navigate(`/auto?message=email%20has%20been%20sent%20to%20reset%20password`);
        }
        catch(error)
        {
            console.log(error);
            // displayError()
        }
    }
  return (
    <>
        <ToastContainer></ToastContainer>
        <form onSubmit={onSubmit}>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}}></input>
            <br></br>
            <button type="submit">send</button>
        </form>
    </>
  )
}

export default ForgotPassword