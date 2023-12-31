import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBListGroup,
  MDBListGroupItem,
  MDBCarousel,
  MDBCarouselItem,
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
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { SiCashapp } from "react-icons/si";
import "../user/userProfile.css";
import AppHeader from "../header/AppHeader";
import AppFooter from "../footer/Footer";
import { getRoomBookingService } from "../../services/room/room.service";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import { useParams } from "react-router-dom";
import moment from "moment";
import CommentsList from "../Comment/CommentsList";
import { convertNumberToVND } from "../../urils/convert-number-to-VND";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPaymentURL } from "../../services/payment/Payment.auth";
import { calDate } from "../../urils/cal-date";
import { enumeateDaysBetweenDates } from "../../urils/enumerate";
function RoomDetail() {
  const [room, setRoom] = useState(null);

  let { roomId } = useParams();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);
  const [totalRentDate, setTotalRentDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [rentedDate, setRentedDate] = useState(null);

  useEffect(() => {
    const fetchRoomProfile = async () => {
      try {
        const response = await getRoomBookingService(roomId);
        const { currRoom } = response.data.data;

        setRoom(currRoom);
        setRentedDate(currRoom.Bookings);

        // danh sach cac ngay thue phong
        const rented = currRoom.Bookings.reduce((result, currentValue) => {
          const { startDate, endDate } = currentValue;
          const temp = enumeateDaysBetweenDates(startDate, endDate);

          return [...result, ...temp];
        }, []);

        const rentedDaysFormat = new Set(
          rented.map((item) => moment(item).format("DD/MM/YYYY"))
        );

        setRentedDate(
          [...rentedDaysFormat].map((item) =>
            moment(item, "DD/MM/YYYY").toDate()
          )
        );
      } catch (error) {
        const message = error.response.data.message;
        errorHandleUtil(message, toast);
      }
    };
    fetchRoomProfile();
  }, [roomId]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const createBookingPayload = {
        price: totalPrice,
        startDate,
        endDate,
        roomId,
      };
      localStorage.setItem(
        "createBookingPayload",
        JSON.stringify(createBookingPayload)
      );

      const response = await createPaymentURL(roomId, {
        amount: totalPrice,
        bankCode: "VNBANK",
        language: "vn",
      });
      const vnpURL = response.data.data.vnpUrl;

      setTimeout(() => {
        window.open(vnpURL, "__blank");
        setTimeout(() => {
          window.location.reload(false);
        }, 20000);
      }, 5000);
    } catch (error) {
      const message = error.response.data.message;
      errorHandleUtil(message, toast);
      setIsLoading(false);
    }
  };

  const [contactModal, setContactModal] = useState(false);

  const handleContact = () => {
    setContactModal(!contactModal);
  };
  return (
    <>
      <header id="header">
        <AppHeader />
      </header>
      {room ? (
        <section
          style={{
            backgroundColor: "#eee",
            paddingTop: 70,
          }}
        >
          <MDBContainer>
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
                  <MDBBreadcrumbItem active>Room Detail</MDBBreadcrumbItem>
                </MDBBreadcrumb>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol lg="6">
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center">
                    <MDBCarousel showIndicators showControls fade>
                      {room.roomImages.length > 0 &&
                        room.roomImages.map((image, index) => {
                          return (
                            <MDBCarouselItem itemId={index + 1}>
                              <img
                                src={image}
                                className="d-block w-100"
                                alt="..."
                              />
                            </MDBCarouselItem>
                          );
                        })}
                    </MDBCarousel>
                  </MDBCardBody>
                </MDBCard>
                <CommentsList roomId={room.id} />
              </MDBCol>
              <MDBCol lg="6">
                <MDBListGroup style={{ minWidth: "22rem" }} light>
                  <MDBListGroupItem className="px-3">
                    <h3
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="badge bg-danger px-2 py-1  mb-3 d-1">
                        <SiCashapp /> {convertNumberToVND(room.price)}/day
                      </span>
                      <span className="badge bg-danger px-2 py-1 shadow-1-strong mb-3">
                        {room.status}
                      </span>
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p className="text-muted mb-2">
                        <MdOutlineAccessTimeFilled /> Post date:{" "}
                        {moment(room.createdAt).format("DD/MM/YYYY")}
                      </p>
                      <p className="text-muted mb-0">
                        Owner: {room.User.userName}
                      </p>
                    </div>
                    <p>
                      <IoHome /> Acreage: {room.acreage} m<sup>2</sup>
                    </p>
                    <p className="text-muted mb-0">
                      <MdDescription /> {room.description}
                    </p>
                    <p className="text-muted mt-3 mb-0">
                      <FaMapLocationDot /> {room.address}
                    </p>
                  </MDBListGroupItem>
                </MDBListGroup>
                <MDBListGroup
                  className="mt-3"
                  style={{ minWidth: "22rem" }}
                  light
                >
                  <MDBListGroupItem className="px-3">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        excludeDates={rentedDate}
                        onChange={(update) => {
                          setDateRange(update);
                          const [startDate, endDate] = update;
                          const exp = calDate(startDate, endDate);
                          setTotalRentDate(exp);
                          setTotalPrice(exp * room.price);
                        }}
                        name="date"
                        withPortal
                        placeholderText="Check in - check out"
                        className="me-5"
                        dateFormat="dd/MM/yyyy"
                        minDate={moment().toDate()}
                      />

                      <div className=" ms-5 text-muted  d-flex justify-content-center align-items-center ">
                        Total:
                        <input
                          value={
                            convertNumberToVND(totalPrice)
                              ? convertNumberToVND(totalPrice)
                              : " "
                          }
                          name="total"
                          className="lead fw-normal  form-control-plaintext ms-2"
                          disabled
                        />
                      </div>
                    </div>
                    {totalRentDate && (
                      <p className="text-muted mb-0 mt-3">
                        Number of days rented: {totalRentDate}
                      </p>
                    )}
                  </MDBListGroupItem>
                </MDBListGroup>
                <MDBListGroup
                  className="mt-4"
                  style={{ minWidth: "22rem" }}
                  light
                >
                  <MDBListGroupItem className="px-3 d-flex justify-content-between">
                    <MDBBtn className="text-capitalize" onClick={handleContact}>
                      Contact the HomeOwner
                    </MDBBtn>
                    <MDBBtn className="text-capitalize" onClick={handlePayment}>
                      {isLoading ? "Loading…" : "Rent"}
                    </MDBBtn>
                  </MDBListGroupItem>
                </MDBListGroup>
                <MDBListGroup
                  className="mt-4"
                  style={{ minWidth: "22rem" }}
                  light
                >
                  <MDBListGroupItem className="px-3 d-flex justify-content-between">
                    <MDBTable small align="middle">
                      <MDBTableHead>
                        <tr>
                          <th scope="col">Id</th>
                          <th scope="col">Created At</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Price</th>
                          <th scope="col">Status</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {room.Bookings.length > 0 &&
                          room.Bookings.map((booking) => {
                            return (
                              <>
                                <tr>
                                  <td>{booking.id}</td>
                                  <td>
                                    {moment(booking.createdAt).format(
                                      "DD/MM/YYYY"
                                    )}
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
                                  <td>{convertNumberToVND(booking.price)}</td>
                                  <td>{booking.status}</td>
                                </tr>
                              </>
                            );
                          })}
                      </MDBTableBody>
                    </MDBTable>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBModal
            className="pt-5"
            open={contactModal}
            setopen={setContactModal}
            tabIndex="-1"
          >
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Phone Number</MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={handleContact}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  {room.User.phoneNumber
                    ? room.User.phoneNumber
                    : "The owner has not updated his phone number"}
                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={handleContact}>
                    Close
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </section>
      ) : (
        <div>Loading Api</div>
      )}
      <footer id="footer">
        <AppFooter />
      </footer>
      <ToastContainer />
    </>
  );
}

export default RoomDetail;
