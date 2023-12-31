import "./Dashboard.css";
import SidebarAdmin from "./SidebarAdmin";
import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { getUserProfile } from "../../services/auth/auth.service";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AppHeader from "../header/AppHeader";
import { MDBBtn, MDBCardImage } from "mdb-react-ui-kit";

function Dashboard(props) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isRole, setIsRole] = useState(false);

  useEffect(() => {
    
    if (token) {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < new Date().getTime()) {
        navigate("/");
        localStorage.removeItem("token");
      }
    }

    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();

        const { currUser } = response.data.data;

        setUser(currUser);
        setIsRole(currUser.role);
      } catch (error) {
        const message = error.response.data.message;
        errorHandleUtil(message, toast);
      }
    };

    fetchUserProfile();
  }, [token,navigate]);
  return (
    <div>
      {isRole === "admin" ? (
        <SidebarAdmin />
      ) : (
        <>
          <div className="hero404">
            <div className="page-container">
              <AppHeader />
              <section className="page-body">
                <div className="message404">
                  <h4 className="h1 font-weight-bold">Oops</h4>
                  <h4 className="h3 my-4">Something went wrong</h4>
                  <p>
                    Sorry about that,You are not authorized to view this page,
                    Please move to another page
                  </p>
                  <MDBBtn href="/" flat color="dark" className="py-2 btn-block">
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
        </>
      )}
    </div>
  );
}

export default Dashboard;
