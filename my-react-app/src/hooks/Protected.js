import React from "react";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import "../App.css";
import AppHeader from "../components/header/AppHeader";
import { MDBBtn, MDBCardImage } from "mdb-react-ui-kit";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/sign-in");
  };

  if (token) {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < new Date().getTime()) {
      localStorage.removeItem("token");
      return (
        <div className="hero404">
          <div className="page-container">
            <AppHeader />
            <section className="page-body">
              <div className="message404">
                <h4 className="h1 font-weight-bold">Oops</h4>
                <h4 className="h3 my-4">Something went wrong</h4>
                <p>
                  Sorry about that, Your login session has expired, please log
                  in again
                </p>
                <MDBBtn flat color="dark" className="py-2 btn-block">
                  Back To Sign In
                </MDBBtn>
              </div>
              <MDBCardImage
                className="image404"
                alt="404"
                src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg"
              />
            </section>
          </div>
        </div>
      );
    }

    return children;
  }
  return (
    <div className="hero404">
      <div className="page-container">
        <AppHeader />
        <section className="page-body">
          <div className="message404">
            <h4 className="h1 font-weight-bold">Oops</h4>
            <h4 className="h3 my-4">Something went wrong</h4>
            <p>
              Sorry about that,Your login session has expired, please log in
              again
            </p>
            <MDBBtn
              onClick={handleClickLogin}
              flat
              color="dark"
              className="py-2 btn-block"
            >
              Back To Sign In
            </MDBBtn>
          </div>
          <MDBCardImage
            className="image404"
            alt="404"
            src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg"
          />
        </section>
      </div>
    </div>
  );
}

export default Protected;
