import React, { useEffect, useState } from "react";
import {
  deleteRoomService,
  getAllRoomPagination,
  updateRoomService,
} from "../../services/room/room.service";
import { toast } from "react-toastify";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import PaginationRoom from "../room/PaginationRoom";
import { convertNumberToVND } from "../../urils/convert-number-to-VND";
function ListRoom(props) {
  const [allRoom, setAllRoom] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(null);
  const paginationButtons = [];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await getAllRoomPagination(page, perPage);

        const { totalPage, allRoom } = response.data.data;
        setAllRoom(allRoom);

        setTotalPage(totalPage);
      } catch (error) {
        const message = error.response.data.message;
        toast.error(message);
      }
    };
    fetchRoom();
  }, [page, perPage]);
  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await deleteRoomService(roomId);
      const message = response.data.message;
      toast.success(message);

      setTimeout(() => {
        window.location.reload();
      }, [1000]);
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
    }
  };

  const handleUpdateDeactivateDisableRoom = async (roomId) => {
    try {
      const response = await updateRoomService(roomId, {
        status: "deactivate",
      });
      const message = response.data.message;

      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, [1000]);
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
    }
  };
  const handleUpdateDeactivateActiveRoom = async (roomId) => {
    try {
      const response = await updateRoomService(roomId, {
        status: "active",
      });
      const message = response.data.message;

      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, [1000]);
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
    }
  };
  return (
    <div>
      <PaginationRoom
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        totalPage={totalPage}
        paginationButtons={paginationButtons}
      />
      <MDBTable small align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Owner</th>
            {/* <th scope="col">Image</th> */}
            <th scope="col">Price</th>
            <th scope="col">Status</th>
            <th scope="col">Acreage</th>
            <th scope="col">Address</th>
            <th scope="col">Action</th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {allRoom.length > 0 &&
            allRoom.map((room) => {
              return (
                <>
                  <tr>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          src={room.User.avatar}
                          alt="..."
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                        <p className="fw-bold mb-1">{room.User.userName}</p>
                      </div>
                    </td>
                    <td>
                      <p className="fw-normal ">
                        {convertNumberToVND(room.price)}/day
                      </p>
                    </td>
                    <td>
                      <MDBBadge
                        className="text-capitalize"
                        color={room.status === "active" ? "success" : "danger"}
                        pill
                      >
                        {room.status}
                      </MDBBadge>
                    </td>
                    <td>
                      {room.acreage} m<sup>2</sup>
                    </td>
                    <td>{room.address}</td>

                    <td>
                      <div className="d-flex flex-column">
                        <MDBBtn
                          onClick={() => handleDeleteRoom(room.id)}
                          color="danger"
                          rounded
                          size="sm"
                          disabled={room.status === "active" ? true : false}
                        >
                          Delete
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => {
                            handleUpdateDeactivateDisableRoom(room.id);
                          }}
                          color="warning"
                          rounded
                          size="sm"
                          disabled={room.status === "deactivate" ? true : false}
                        >
                          disable
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => {
                            handleUpdateDeactivateActiveRoom(room.id);
                          }}
                          color="success"
                          rounded
                          size="sm"
                          disabled={room.status === "deactivate" ? false : true}
                        >
                          Active
                        </MDBBtn>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default ListRoom;
