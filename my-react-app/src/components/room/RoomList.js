import { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBCardFooter,
  MDBRipple,
  MDBBtn,
  MDBContainer,
  MDBInputGroup,
  MDBInput,
  MDBCarousel,
  MDBCarouselItem,
} from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { MdDescription } from "react-icons/md";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { convertNumberToVND } from "../../urils/convert-number-to-VND";
import { SiCashapp } from "react-icons/si";

import {
  getAllRoomPagination,
  searchRoomService,
} from "../../services/room/room.service";
import moment from "moment";
import PaginationRoom from "./PaginationRoom";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import RoomLastest from "./RoomLastest";
import { Form } from "react-bootstrap";
function RoomList(props) {
  const [allRooms, setAllRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(null);
  const [sortValue, setSortValue] = useState(null);

  const paginationButtons = [];
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await getAllRoomPagination(page, perPage, sortValue);

        const { totalPage, allRoom } = response.data.data;
        setAllRooms(allRoom);

        setTotalPage(totalPage);
      } catch (error) {
        const message = error.response.data.message;
        toast.error(message);
      }
    };
    fetchRoom();
  }, [page, perPage, sortValue]);
  const handleSearchValue = (event) => {
    setSearch(event.target.value);
  };
  const [search, setSearch] = useState("");
  const handleClickSearch = async () => {
    try {
      const response = await searchRoomService(search, page, perPage);
      if (search === "") {
        errorHandleUtil("Please enter value", toast);
      }
      const message = response.data.message;

      const { totalPage } = response.data.data;
      toast.success(message);
      setAllRooms(response.data.data.allRoom);
      setTotalPage(totalPage);
    } catch (error) {
      const message = error.response.data.message;
      errorHandleUtil(message, toast);
    }
  };

  const handleChangeValueSort = (e) => {
    setSortValue(e.target.value);
  };
  return (
    <>
      {allRooms ? (
        <section id="blog" className="block blog-block">
          <MDBContainer className="mb-3 d-flex justify-content-center align-items-center  ">
            <MDBInputGroup className=" w-50 p-2 d-flex justify-content-center align-items-center ">
              <MDBInput onChange={handleSearchValue} label="Search" />
              <MDBBtn onClick={handleClickSearch}>Search</MDBBtn>
              {/* className="lead fw-normal form-control-plaintext ms-2" */}
            </MDBInputGroup>
            <Form.Select
              className="ms-3"
              style={{
                width: "125px",
                fontSize:"12px"
              }}
              value={sortValue}
              onChange={handleChangeValueSort}
            >
              <option value="" selected disabled hidden>
                Sort by Price
              </option>
              <option value={JSON.stringify(["price", "ASC"])}>
                Ascending
              </option>
              <option value={JSON.stringify(["price", "DESC"])}>
                Decrease
              </option>
            </Form.Select>
          </MDBContainer>
          <RoomLastest />
          <MDBRow className="row-cols-1 row-cols-md-3 g-4 m-5">
            {allRooms.map((room) => {
              const { roomImages } = room;
              return (
                <MDBCol key={room.id}>
                  <MDBCard>
                    <MDBRipple
                      className="bg-image hover-overlay ripple shadow-2-strong rounded-1 mb-1"
                      rippleTag="div"
                      rippleColor="light"
                    >
                      <MDBCarousel fade showIndicators showControls>
                        {roomImages.length > 0 &&
                          roomImages.map((image, index) => {
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
                    </MDBRipple>

                    <MDBCardBody className="p-2">
                      <MDBCardTitle>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <SiCashapp /> {convertNumberToVND(room.price)}/day
                          </div>
                          <span className="badge bg-danger px-2 py-1 shadow-1-strong mb-3">
                            {room.status}
                          </span>
                        </div>
                      </MDBCardTitle>

                      <MDBCardText>
                        <IoHome /> Acreage: {room.acreage} m<sup>2</sup>
                      </MDBCardText>
                      <MDBCardText>
                        <MdDescription /> {room.description}
                      </MDBCardText>
                      <MDBCardText>
                        <FaMapLocationDot /> {room.address}{" "}
                        <a href={`/room-detail/${room.id}`}>
                          <div
                            className="mask"
                            style={{
                              backgroundColor: "rgba(251, 251, 251, 0.15)",
                            }}
                          ></div>
                        </a>
                      </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <time
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        <MdOutlineAccessTimeFilled /> Room post on{" "}
                        {moment(room.createdAt).format("dddd, MMMM Do YYYY")}
                      </time>
                    </MDBCardFooter>
                  </MDBCard>
                </MDBCol>
              );
            })}
          </MDBRow>
          <PaginationRoom
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            totalPage={totalPage}
            paginationButtons={paginationButtons}
          />
        </section>
      ) : (
        <div>Loading API</div>
      )}
    </>
  );
}

export default RoomList;
