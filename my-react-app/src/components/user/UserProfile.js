import React, { useEffect, useState } from "react";
import {
  forgotPassword,
  getUserProfile,
  updateUserService,
} from "../../services/auth/auth.service";
import { ToastContainer, toast } from "react-toastify";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import "./userProfile.css";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBInput,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCheckbox,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
} from "mdb-react-ui-kit";
import AppHeader from "../header/AppHeader";
import AppFooter from "../footer/Footer";
import ForgotPasswordPage from "./ForgotPasswordPage";
import { getAllBookingsUserService } from "../../services/booking/booking.service";
import { convertNumberToVND } from "../../urils/convert-number-to-VND";
import moment from "moment";
import { getAllRoomsUserService } from "../../services/room/room.service";
import { handleUploadFile } from "../common/upload-images/upload-image.util";

function UserProfile() {
  const [isCheckedRole, setIsCheckedRole] = useState(false);
  const handleRoleChange = () => {
    setIsCheckedRole(!isCheckedRole);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [allBooking, setAllBooking] = useState([]);
  const [user, setUser] = useState(null);
  const [basicModal, setBasicModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isOpenVerifyOtpModal, setIsOpenVerifyOtpModal] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [updatePayload, setUpdatePayload] = useState({
    fullName: user ? user.fullName : "",
    phoneNumber: user ? user.phoneNumber : "",
  });
  const handleChangeUpdateValue = (event) => {
    setUpdatePayload({
      ...updatePayload,
      [event.target.name]: event.target.value,
    });
  };

  const toggleOpen = () => {
    setBasicModal(!basicModal);
    setEmail("");
  };
  const handleChangeEmailValue = (e) => {
    setEmail(e.target.value);
  };
  const [basicActive, setBasicActive] = useState("tab1");

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
    if (basicActive === "tab3") {
    }
  };
  const handleSubmitEmail = async () => {
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);

      const message = response.data.message;
      const EMAIL_URL = response.data.EMAIL_URL;

      toast.success(message);
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          window.open(EMAIL_URL, "_blank", "noreferrer");
          setIsOpenVerifyOtpModal(true);
        }, [500]);
      }, [500]);
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
      setTimeout(() => {
        window.alert("Email is not esxit");
        window.location.reload(true);
      }, 1000);
    }
  };
  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      let avatarURL;
      if (image) {
        avatarURL = await handleUploadFile(image);
      }
      const response = await updateUserService({
        ...updatePayload,
        isOwner: isCheckedRole,
        avatar: avatarURL,
      });
      const message = response.data.message;

      toast.success(message);
      setTimeout(() => {
        window.location.reload(false);
        setIsLoading(false);
      }, [500]);
    } catch (error) {
      const errResponse =
        (error && error.response && error.response.data) ||
        (error && error.message);

      errorHandleUtil(errResponse, toast);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();

        const { currUser } = response.data.data;

        setUser(currUser);
      } catch (error) {
        const message = error.response.data.message;
        errorHandleUtil(message, toast);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchBookingUser = async () => {
      try {
        const response2 = await getUserProfile();

        const { currUser } = response2.data.data;

        const response = await getAllBookingsUserService(currUser.id);

        const { allBookings } = response.data.data;

        setAllBooking(allBookings);
      } catch (error) {
        // const message = error.response.data.message;
        // errorHandleUtil(message, toast);
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);

        errorHandleUtil(errResponse, toast);
      }
    };
    fetchBookingUser();
  }, []);

  useEffect(() => {
    const fetchRoomsUser = async () => {
      try {
        const response2 = await getUserProfile();

        const { currUser } = response2.data.data;

        const response = await getAllRoomsUserService(currUser.id);

        const { allRooms } = response.data.data;
        setAllRooms(allRooms);
      } catch (error) {
        const errResponse =
          (error && error.response && error.response.data) ||
          (error && error.message);

        errorHandleUtil(errResponse, toast);
      }
    };
    fetchRoomsUser();
  }, []);

  const handleAvatarChange = (e) => {
    const images = e.target.files[0];
    if (e.target.files[0]) setImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(images));
  };

  return (
    <>
      <header id="header">
        <AppHeader />
      </header>
      {user ? (
        <section
          style={{
            backgroundColor: "#eee",
            minHeight: "100vh",
          }}
        >
          <MDBContainer className="py-5 mt-3">
            <MDBRow>
              <MDBCol>
                <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                  <MDBBreadcrumbItem>
                    <a
                      style={{
                        color: "red",
                      }}
                      href="/"
                    >
                      Home
                    </a>
                  </MDBBreadcrumbItem>
                  <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
                </MDBBreadcrumb>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol
                className={
                  basicActive === "tab3" || basicActive === "tab4"
                    ? "d-none"
                    : ""
                }
                lg="4"
              >
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center">
                    <div className="personal-image">
                      <label className="label">
                        <figure
                          className={
                            basicActive === "tab1"
                              ? " personal-figure"
                              : "d-none personal-figure"
                          }
                        >
                          <input
                            type="file"
                            accept="/image/*"
                            onChange={handleAvatarChange}
                          />

                          <MDBCardImage
                            src={user.avatar}
                            className="personal-avatar"
                            alt="avatar"
                          />
                        </figure>
                        <div className={basicActive === "tab1" ? "d-none" : ""}>
                          <figure className="personal-figure">
                            <MDBCardImage
                              src={user.avatar}
                              className="personal-avatar"
                              alt="avatar"
                            />
                          </figure>
                        </div>
                      </label>
                    </div>
                    <p className="text-muted mb-1">{user.fullName}</p>
                    <p className="text-muted mb-4">{user.phoneNumber}</p>
                    {previewImage && (
                      <img
                        className="w-75"
                        src={previewImage}
                        alt="Selected"
                        // onClick={() => handleRemoveImage(image)}
                      />
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol
                lg={
                  basicActive === "tab3" || basicActive === "tab4" ? "12" : "8"
                }
              >
                <MDBCard className="mb-4">
                  <MDBTabs className="mb-3">
                    <MDBTabsItem>
                      <MDBTabsLink
                        onClick={() => handleBasicClick("tab1")}
                        active={basicActive === "tab1"}
                      >
                        Profile
                      </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                      <MDBTabsLink
                        onClick={() => handleBasicClick("tab2")}
                        active={basicActive === "tab2"}
                      >
                        Account
                      </MDBTabsLink>
                    </MDBTabsItem>
                    <MDBTabsItem>
                      <MDBTabsLink
                        onClick={() => handleBasicClick("tab3")}
                        active={basicActive === "tab3"}
                      >
                        Booking
                      </MDBTabsLink>
                    </MDBTabsItem>
                    {user.role === "owner" ? (
                      <MDBTabsItem>
                        <MDBTabsLink
                          onClick={() => handleBasicClick("tab4")}
                          active={basicActive === "tab4"}
                        >
                          Room
                        </MDBTabsLink>
                      </MDBTabsItem>
                    ) : (
                      <p></p>
                    )}
                  </MDBTabs>
                  <MDBTabsContent>
                    <MDBTabsPane open={basicActive === "tab1"}>
                      <MDBCardBody>
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Full Name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText>{user.fullName}</MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>User Name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText>{user.userName}</MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Email</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText>{user.email}</MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Phone</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText>{user.phoneNumber}</MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Role</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText>{user.role}</MDBCardText>
                          </MDBCol>
                        </MDBRow>
                      </MDBCardBody>
                    </MDBTabsPane>
                    <MDBTabsPane open={basicActive === "tab2"}>
                      <MDBCardBody>
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Full Name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBInput
                              value={updatePayload.fullName}
                              onChange={handleChangeUpdateValue}
                              type="text"
                              name="fullName"
                              className="text-muted"
                            ></MDBInput>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Phone Number</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBInput
                              value={updatePayload.phoneNumber}
                              onChange={handleChangeUpdateValue}
                              type="text"
                              name="phoneNumber"
                              className="text-muted"
                            ></MDBInput>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Password</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBBtn onClick={toggleOpen}>
                              Change Password
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Role</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCheckbox
                              name="flexCheck"
                              value=""
                              id="flexCheckDefault"
                              label="Have role Owner-house"
                              checked={isCheckedRole}
                              onChange={handleRoleChange}
                            />
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3"></MDBCol>
                          <MDBCol sm="9">
                            <MDBBtn
                              onClick={handleUpdate}
                              className="me-3"
                              color="success"
                            >
                              Update
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </MDBCardBody>
                    </MDBTabsPane>
                    <MDBTabsPane open={basicActive === "tab3"}>
                      {allBooking ? (
                        <MDBCardBody>
                          <MDBTable small align="middle">
                            <MDBTableHead>
                              <tr>
                                <th scope="col">Owner</th>
                                <th scope="col">Price</th>
                                <th scope="col">Status</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Created At</th>
                              </tr>
                            </MDBTableHead>

                            <MDBTableBody>
                              {allBooking.length > 0 &&
                                allBooking.map((booking) => {
                                  return (
                                    <tr>
                                      <td>
                                        <div>
                                          <p className="fw-bold mb-1">
                                            {user.userName}
                                          </p>
                                        </div>
                                      </td>

                                      <td>
                                        <p className="fw-bold mb-1 ">
                                          {convertNumberToVND(booking.price)}
                                        </p>
                                      </td>
                                      <td>
                                        <MDBBadge
                                          className="text-capitalize"
                                          color="success"
                                          pill
                                        >
                                          {booking.status}
                                        </MDBBadge>
                                      </td>
                                      <td>
                                        {moment(booking.startDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </td>
                                      <td>
                                        {moment(booking.endDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </td>
                                      <td>
                                        {moment(booking.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </MDBTableBody>
                          </MDBTable>
                        </MDBCardBody>
                      ) : (
                        <div>Loading API</div>
                      )}
                    </MDBTabsPane>
                    <MDBTabsPane open={basicActive === "tab4"}>
                      {allRooms ? (
                        <MDBCardBody>
                          <MDBTable small align="middle">
                            <MDBTableHead>
                              <tr>
                                <th scope="col">Owner</th>
                                <th scope="col">Price</th>
                                <th scope="col">Status</th>
                                <th scope="col">Acreage</th>
                                <th scope="col">Address</th>
                                <th scope="col">Description</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Action</th>
                              </tr>
                            </MDBTableHead>

                            <MDBTableBody>
                              {allRooms.length > 0 &&
                                allRooms.map((room) => {
                                  return (
                                    <tr>
                                      <td>
                                        <div className="d-flex flex-column align-items-center">
                                          <p className="fw-bold mb-1">
                                            {user.userName}
                                          </p>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex flex-column align-items-center">
                                          <p className="">
                                            {convertNumberToVND(room.price)}
                                          </p>
                                        </div>
                                      </td>
                                      <td>
                                        <p className="fw-normal ">
                                          <MDBBadge
                                            className="text-capitalize"
                                            color={
                                              room.status === "active"
                                                ? "success"
                                                : "danger"
                                            }
                                            pill
                                          >
                                            {room.status}
                                          </MDBBadge>
                                        </p>
                                      </td>
                                      <td>
                                        {room.acreage} m<sup>2</sup>
                                      </td>
                                      <td>{room.address}</td>
                                      <td>{room.description}</td>
                                      <td>
                                        {moment(room.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </td>
                                      <td>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            flexDirection: "column",
                                          }}
                                        >
                                          {/* <MDBBtn
                                            onClick={() =>
                                              handleDeleteRoom(room.id)
                                            }
                                            color="danger"
                                            rounded
                                            size="sm"
                                          >
                                            {isLoading ? "Loading…" : "Delete"}
                                          </MDBBtn> */}
                                          <MDBBtn
                                            color="warning"
                                            rounded
                                            size="sm"
                                            href={`/updateRoom/${room.id}`}
                                          >
                                            {isLoading ? "Loading…" : "Edit"}
                                          </MDBBtn>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </MDBTableBody>
                          </MDBTable>
                        </MDBCardBody>
                      ) : (
                        <div>Loading API</div>
                      )}
                    </MDBTabsPane>
                  </MDBTabsContent>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          {/* modal input email */}
          <MDBModal
            className="mt-5"
            open={basicModal}
            setopen={setBasicModal}
            tabIndex="-1"
          >
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Forgot Password</MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={toggleOpen}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email address"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    name="emailCheck"
                    value={email}
                    onChange={handleChangeEmailValue}
                  />
                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={toggleOpen}>
                    Close
                  </MDBBtn>
                  <MDBBtn onClick={handleSubmitEmail}>
                    {isLoading ? "Loading…" : "Send"}
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <ForgotPasswordPage
            email={email}
            isOpenVerifyOtpModal={isOpenVerifyOtpModal}
            setIsOpenVerifyOtpModal={setIsOpenVerifyOtpModal}
            closeForgotPasswordModal={toggleOpen}
          />
        </section>
      ) : (
        <div>Loading api</div>
      )}
      <footer id="footer">
        <AppFooter />
      </footer>
      <ToastContainer />
    </>
  );
}

export default UserProfile;
