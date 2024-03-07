import axios from "axios";
import React, { useEffect, useState } from "react";

const ShowWishlist = () => {
    console.log("first")
    let [wishlist, setWishlist] = useState([]);
    let getWishlist = async() => {
        try {
            let result = await axios({
                url: `http://localhost:8000/wishlists`,
                method: `get`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            // console.log(result);
            let _wishlist = result.data.result;
            // console.log("wishlist", wishlist);
            _wishlist = _wishlist.map((fav, i) => {
                let getLoc = async () => {
                    try {
                        let result = await axios({
                            url: `http://localhost:8000/hTLocations/${fav.hTLocationId}`,
                            method: `get`,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        wishlist.push(result.data.result);
                        setWishlist(wishlist);
                    } catch (error) {
                        console.log(error);
                    }
                };
                getLoc();

            });
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getWishlist();
    }, []);
    return (
        <>
            <h1>Wishlist</h1>
            {wishlist.map((fav, i) => {
                return (
                    <div key={i} style={{backgroundColor: "lightsteelblue"}}>
                        <h2>{fav.hTName}</h2>
                        <p>Location: {fav.location}</p>
                        <p>Difficulty: {fav.difficulty}</p>
                        <p>Route Type: {fav.routeType}</p>
                        <p>Length: {fav.length.value}{fav.length.unit}</p>
                        </div>
                )
            })}
        </>
    )
}

export default ShowWishlist;