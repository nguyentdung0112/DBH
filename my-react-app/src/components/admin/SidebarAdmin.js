import React, { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCol,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

import ListRoom from "./ListRoom";
import ListUser from "./ListUser";
import ListComment from "./ListComment";

export default function SidebarAdmin(props) {
  const navigate = useNavigate();
  const [iconsActive, setIconsActive] = useState("tab1");
  const [openNavExternal, setOpenNavExternal] = useState(false);

  const handleIconsClick = (value) => {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);
  };

  const toggleShow = () => setOpenNavExternal(!openNavExternal);
  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
  };

  return (
    <>
      <link
        href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
        rel="stylesheet"
      />
      <MDBCollapse
        open={openNavExternal}
        tag="nav"
        className="d-lg-block bg-white sidebar"
      >
        <MDBTabs className="mb-3 flex-column justify-content-center mt-3">
          <MDBTabsItem className="p-3">
            <MDBTabsLink
              onClick={() => handleIconsClick("tab1")}
              active={iconsActive === "tab1"}
            >
              <MDBIcon fas icon="user-cog" className="me-2" />
              User
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem className="p-3">
            <MDBTabsLink
              onClick={() => handleIconsClick("tab2")}
              active={iconsActive === "tab2"}
            >
              <MDBIcon fas icon="hospital" className="me-2" /> Room
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem className="p-3">
            <MDBTabsLink
              onClick={() => handleIconsClick("tab3")}
              active={iconsActive === "tab3"}
            >
              <MDBIcon fas icon="comment-alt" className="me-2" /> Comment
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBCol placement="right">
          <MDBTabsContent
            className="bg-white"
            style={{
              bottom: "261px",
              left: "245px",
              position: "relative",
              width: "100vw",
              height: "auto",
              paddingRight: "250px",
            }}
          >
            <MDBTabsPane open={iconsActive === "tab1"}>
              <ListUser />
            </MDBTabsPane>
            <MDBTabsPane open={iconsActive === "tab2"}>
              <ListRoom />
            </MDBTabsPane>
            <MDBTabsPane open={iconsActive === "tab3"}>
              <ListComment />
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBCollapse>

      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarNav className="d-flex flex-row align-items-center w-auto">
            <MDBNavbarToggler
              type="button"
              aria-label="Toggle navigation"
              onClick={toggleShow}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>
            <MDBNavbarBrand href="/">
              <h5>DBH</h5>
            </MDBNavbarBrand>
          </MDBNavbarNav>
          <MDBNavbarNav className="d-flex flex-row justify-content-end w-auto">
            <MDBNavbarItem className="me-3 me-lg-0 d-flex align-items-center">
              <div
                onClick={handleLogout}
                style={{
                  cursor: "pointer",
                }}
              >
                Log Out
              </div>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
