import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SimilarLocations = ({hTLocId}) => {
    // console.log(hTLocId);
    let [locations, setLocations] = useState([]);
    let navigate = useNavigate();
    let getRecommendation = async () => {
        try {
            let result  = await axios({
                url: `http://localhost:8000/hTLocations/recommendation/content/${hTLocId}`,
                method: `get`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            // console.log(result.data.result);
            setLocations(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getRecommendation();
    }, [])
  return (
    <>
        <h2>Similar Locations</h2>
    {/* <p>{locations[0]?.hTName}</p> */}
        {locations.map((location, i) => {
            // return (location.hTLocation?.hTName)
            return (<div key={i} style={{backgroundColor:"turquoise"}}>
                <h3>{location?.hTLocation.hTName}</h3>
                <p>Location: {location?.hTLocation.location}</p>
                <p>Length: {location.hTLocation.length?.value}{location.hTLocation.length?.unit}</p>
                <p>Elevation Gain: {location.hTLocation.elevationGain?.value}{location.hTLocation.elevationGain?.unit}</p>
                <p style={{fontSize: "20px", fontWeight:"bold"}}>Match: {Math.round(location.match*100)}%</p>
                {/* <button onClick={(e) => {
                    navigate(`/hTLocations/${location.hTLocation._id}`, {replace: true});
                    
                }}>view</button> */}
            </div>)
        })}
    </>
  )
}

export default SimilarLocations