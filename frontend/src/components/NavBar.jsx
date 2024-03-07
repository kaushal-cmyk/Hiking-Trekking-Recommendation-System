import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/NavBar.css'

const NavBar = () => {
  return (
    <div id="NavBar">
      <NavLink to="/" style={{marginRight: "20px"}}>Home</NavLink>
      <NavLink to="/login" style={{marginRight: "20px"}}>Login</NavLink>
      <NavLink to="/register" style={{marginRight: "20px"}}>Register</NavLink>
      <NavLink to="/hTLocations/create" style={{marginRight: "20px"}}>Create New Location</NavLink>
      <NavLink to="/hTLocations" style={{marginRight: "20px"}}>All Locations</NavLink>
      <NavLink to="/users/my-profile" style={{marginRight: "20px"}}>My Profile</NavLink>
      {/* <span onClick={() => {console.log("Hello")}} style={{cursor: "pointer"}}>Log Out</span> */}
      {/* <NavLink ></NavLink> */}
    </div>
  )
}

export default NavBar