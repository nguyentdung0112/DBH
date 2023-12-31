import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { getUserProfile } from "../../services/auth/auth.service";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import { toast } from "react-toastify";

function AppHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLogined, setIsLogined] = useState(false);
  const [user, setUser] = useState(null);
  const [isRole, setIsRole] = useState(false);
  const handleOpenUserProfile = () => {
    navigate("/user-profile");
  };
  const handleLogout = () => {
    navigate("/sign-in");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < new Date().getTime()) {
        setIsLogined(false);
        navigate("/sign-in");
        localStorage.removeItem("token");
      }
      setIsLogined(true);
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
  }, []);

  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="/">Dream Boarding House</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className=" d-flex justify-content-center align-items-center">
            {isRole === "owner" ? (
              <Nav.Link href="/create-room">Create Room</Nav.Link>
            ) : (
              <p></p>
            )}
            {isRole === "admin" ? (
              <Nav.Link href="/admin">Admin</Nav.Link>
            ) : (
              <p></p>
            )}
            {isLogined ? (
              <Dropdown autoClose>
                <Dropdown.Toggle size="sm" variant="success"></Dropdown.Toggle>
                <Dropdown.Menu className="me-5">
                  <Dropdown.Item onClick={handleOpenUserProfile}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link href="/sign-in">Sign In</Nav.Link>
                <Nav.Link href="/sign-up">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppHeader;
