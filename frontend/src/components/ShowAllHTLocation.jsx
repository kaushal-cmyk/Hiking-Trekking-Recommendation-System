import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayError, displaySuccess } from "../utils/toast";
import { ToastContainer } from "react-toastify";
import '../styles/Heading.css'

const ShowAllHTLocation = () => {
  let [wishList, setWishList] = useState([]);
  // let [rating, setRating] = useState(0);
  let [hTLocations, setHTLocations] = useState([]);
  let [edit, setEdit] = useState([]);
  let navigate = useNavigate();

  let getAllHTLocation = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/hTLocations`,
        method: `get`,
      });
      setHTLocations(result.data.result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  let isCreated = async () => {
    try {
      let hTLocationsOfUser = await axios({
        url: `http://localhost:8000/hTLocations/user`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      hTLocationsOfUser = hTLocationsOfUser.data.result;
      hTLocationsOfUser = hTLocationsOfUser.map((item, i) => {
        return item._id;
      });
      setEdit(hTLocationsOfUser);
    } catch (error) {
      console.log(error);
    }
  };
  let isInWishList = async () => {
    try {
      let result = await axios({
        url: `http://localhost:8000/wishlists/`,
        method: `get`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(result.data.result);
      let hTLocId = result.data.result.map((item, i) => {
        return item.hTLocationId;
      });
      console.log(hTLocId);
      setWishList(hTLocId);
    } catch (error) {

    }
  };
  useEffect(() => {
    getAllHTLocation();
    isInWishList();
    isCreated();
  }, []);

  let canIedit = async (hTLocation) => {
    let token = localStorage.getItem("token");
    if (!token) setEdit(false);
    else {
      try {
        let result = await axios({
          url: `http://locahost:8000/hTLocations/${hTLocation._id}`,
          method: `patch`,
          data: {},
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(result);
        setEdit(true);
      } catch (error) {
        console.log(error);
        setEdit(false);
      }
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <h1>All Locations</h1>
      {hTLocations.map((hTLocation, i) => {
        // canIedit(hTLocation);
        return (
          <div
            key={i}
            style={
              i % 2 === 0
                ? { backgroundColor: "lightblue" }
                : { backgroundColor: "lightgoldenrodyellow" }
            }
          >
            <h2>{hTLocation.hTName}</h2>
            <p>Location: {hTLocation.location}</p>
            <p>Difficult: {hTLocation.difficulty}</p>
            <p>
              Length: {hTLocation.length.value}
              {hTLocation.length.unit}
            </p>
            <button
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(`${hTLocation._id}`);
              }}
            >
              Details
            </button>
            {edit.includes(hTLocation._id) ? (
              <button
                style={{ marginRight: "10px" }}
                onClick={() => {
                  navigate(`update/${hTLocation._id}`);
                }}
              >
                Edit
              </button>
            ) : null}
            {wishList.includes(hTLocation._id) ? (
              <button
                style={{ backgroundColor: "#FF7F7F", marginRight: "10px" }}
                onClick={() => {
                  let removeFromWishList = async () => {
                    try {
                      let result = await axios({
                        url: `http://localhost:8000/wishLists/${hTLocation._id}`,
                        method: `delete`,
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      });
                      console.log(result.data.message);
                      displaySuccess(result.data.message);
                      isInWishList();
                    } catch (error) {
                      console.log(error);
                      displayError(error.response.data.message);
                    }
                  };
                  removeFromWishList();
                }}
              >
                Remove from Wishlist
              </button>
            ) : (
              <button
                style={{ backgroundColor: "lightgreen" }}
                onClick={() => {
                  let addToWishList = async () => {
                    try {
                      let result = await axios({
                        url: `http://localhost:8000/wishLists/${hTLocation._id}`,
                        method: `post`,
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      });
                      console.log(result.data.message);
                      displaySuccess(result.data.message);
                      isInWishList();
                    } catch (error) {
                      console.log(error);
                      displayError(error.response.data.message);
                    }
                  };
                  addToWishList();
                }}
              >
                Add to Wishlist
              </button>
            )}

            {/* <form onSubmit={() => {}}>
              <label htmlFor="rating">Rating: </label>
              <input
                type="number"
                min="0"
                max="5"
                id="rating"
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                }}
              ></input>
              <button type="submit">submit rating</button>
            </form> */}
          </div>
        );
      })}
    </>
  );
};

export default ShowAllHTLocation;
