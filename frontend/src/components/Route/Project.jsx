import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import Login from "../Login";
import Register from "../Register";
import ShowAllHTLocation from "../ShowAllHTLocation";
import VerifyEmail from "../VerifyEmail";
import MyProfile from "../MyProfile";
import UpdateMyProfile from "../UpdateMyProfile";
import ShowSpecificHTLocation from "../ShowSpecificHTLocation";
import UpdateSpecificHTLocation from "../UpdateSpecificHTLocation";
import CreateHTLocation from "../CreateHTLocation";
import ForgotPassword from "../ForgotPassword";
import Auto from "../Auto";
import ShowWishlist from "../ShowWishlist";

const Project = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <> 
              <NavBar></NavBar>
              <Outlet></Outlet>
              <Footer></Footer>
            </>
          }
        >
          <Route
            path="verify-email"
            element={<VerifyEmail></VerifyEmail>}
          ></Route>
          <Route index element={<div>Home Page</div>}></Route>
          <Route path="auto" element={<Auto></Auto>}></Route>
          <Route path="*" element={<div>Page Not Found</div>}></Route>
          <Route
            path="login"
            element={
              <>
                <Outlet></Outlet>
              </>
            }
          >
            <Route index element={<Login></Login>}></Route>
            <Route path="forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
          </Route>
          <Route path="register" element={<Register></Register>}></Route>
          <Route path="hTLocations" element={<Outlet></Outlet>}>
            <Route
              index
              element={<ShowAllHTLocation></ShowAllHTLocation>}
            ></Route>
            <Route
              path="create"
              element={<CreateHTLocation></CreateHTLocation>}
            ></Route>
            <Route
              path=":hTLocId"
              element={<ShowSpecificHTLocation></ShowSpecificHTLocation>}
            ></Route>
            <Route path="update" element={<Outlet></Outlet>}>
              <Route
                path=":hTLocId"
                element={<UpdateSpecificHTLocation></UpdateSpecificHTLocation>}
              ></Route>
            </Route>
          </Route>
          <Route path="users" element={<Outlet></Outlet>}>
            <Route path="my-profile" element={<Outlet></Outlet>}>
              <Route
                index
                element={
                  <>
                    <MyProfile></MyProfile>
                  </>
                }
              ></Route>

              <Route
                path="update"
                element={<UpdateMyProfile></UpdateMyProfile>}
              ></Route>
            </Route>
            <Route path="wishlist" element={<ShowWishlist></ShowWishlist>}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default Project;
