import {
  MDBBtn,
  MDBCarousel,
  MDBCarouselItem,
  MDBCol,
  MDBContainer,
  MDBRipple,
  MDBCardText,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { getRoomlastestService } from "../../services/room/room.service";
import { toast } from "react-toastify";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import moment from "moment";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { MdOutlineAccessTimeFilled } from "react-icons/md";


function RoomLastest(props) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoomLastest = async () => {
      try {
        const response = await getRoomlastestService();
        const { currRoom } = response.data.data;
        setRoom(currRoom);
      } catch (error) {
        const message = error.response.data.message;
        errorHandleUtil(message, toast);
      }
    };
    fetchRoomLastest();
  }, []);
  return (
    <>
      {room ? (
        <MDBContainer>
          <MDBRow className="gx-5">
            <MDBCol md="8" className="mb-4">
              <MDBRipple
                className="bg-image hover-overlay ripple shadow-2-strong rounded-5 "
                rippleTag="div"
                rippleColor="light"
              >
                <MDBCarousel showControls>
                  {room.roomImages.length > 0 &&
                    room.roomImages.map((image, index) => {
                      return (
                        <MDBCarouselItem itemId={index + 1}>
                          <img src={image} alt="..." />
                        </MDBCarouselItem>
                      );
                    })}
                  <a href={`/room-detail/${room.id}`}>
                    <div
                      className="mask"
                      style={{
                        backgroundColor: "rgba(251, 251, 251, 0.15)",
                      }}
                    ></div>
                  </a>
                </MDBCarousel>
              </MDBRipple>
            </MDBCol>
            <MDBCol md="4" className="mb-4">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span className="badge bg-danger px-2 py-1 shadow-1-strong mb-3">
                  News of the day
                </span>
                <span className="badge bg-danger px-2 py-1 shadow-1-strong mb-3">
                  {room.status}
                </span>
              </div>
              <p className="text-muted mb-2 fw-bold">
                <MdOutlineAccessTimeFilled /> Post date:{" "}
                {moment(room.createdAt).format("DD/MM/YYYY")}
              </p>
              <MDBCardText>
                <IoHome /> Acreage: {room.acreage} m<sup>2</sup>
              </MDBCardText>
              <h4>
                <strong>
                  <FaMapLocationDot /> {room.address}
                </strong>
              </h4>
              <p className="text-muted">
                <MdDescription /> {room.description}
              </p>

              <MDBBtn href={`/room-detail/${room.id}`}>View More</MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      ) : (
        <div>Loading Api</div>
      )}
    </>
  );
}

export default RoomLastest;
