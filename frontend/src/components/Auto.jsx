import React from 'react'
import { useSearchParams } from 'react-router-dom'

const Auto = () => {
    let [query] = useSearchParams();
    // console.log(query.get("message"));
    let message = query.get("message");
  return (
    <>
        <div style={{fontSize:"40px", alignSelf:"center"}}>{message}</div>
    </>
  )
}

export default Auto