import React, { useEffect, useState } from "react";
import {
  deleteUserService,
  getAllUserPagination,
  updateStatusUserService,
} from "../../services/auth/auth.service";
import { toast } from "react-toastify";
import PaginationUser from "../user/PaginationUser";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

function ListUser(props) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(null);
  const paginationButtons = [];
  const [allUser, setAllUser] = useState([]);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getAllUserPagination(page, perPage);

        const { totalPage, allUser } = response.data.data;

        setAllUser(allUser);
        setStatus(allUser.status);

        setTotalPage(totalPage);
      } catch (error) {
        const message = error.response.data.message;
        toast.error(message);
      }
    };
    fetchUser();
  }, [page, perPage, status]);
  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUserService(userId);
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

  const handleupdateStatusDisableUser = async (userId) => {
    try {
      const response = await updateStatusUserService(userId, {
        status: "disable",
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
  const handleupdateStatusActivateUser = async (userId) => {
    try {
      const response = await updateStatusUserService(userId, {
        status: "activate",
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
      <MDBTable small align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">User Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Number Phone</th>
            <th scope="col">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {allUser.length > 0 &&
            allUser.map((user) => {
              return (
                <>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={user.avatar}
                          alt="..."
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                        <div className="ms-3">
                          <p className="fw-bold mb-1">{user.userName}</p>
                          <p className="text-muted mb-0">{user.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{user.email}</p>
                    </td>
                    <td>
                      <MDBBadge
                        className="text-capitalize"
                        color={
                          user.role === "admin"
                            ? "danger"
                            : user.role === "owner"
                            ? "info"
                            : "success"
                        }
                        pill
                      >
                        {user.role}
                      </MDBBadge>
                    </td>
                    <td>
                      <MDBBadge
                        className="text-capitalize"
                        color={
                          user.status === "activate" ? "success" : "danger"
                        }
                        pill
                      >
                        {user.status}
                      </MDBBadge>
                    </td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <MDBBtn
                          onClick={() => handleDeleteUser(user.id)}
                          color="danger"
                          rounded
                          size="sm"
                          disabled={user.role === "admin" ? true : false}
                        >
                          Delete
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => {
                            handleupdateStatusDisableUser(user.id);
                          }}
                          color="warning"
                          rounded
                          size="sm"
                          disabled={
                            user.role === "admin" || user.status === "disable"
                              ? true
                              : false
                          }
                        >
                          disable
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => {
                            handleupdateStatusActivateUser(user.id);
                          }}
                          color="success"
                          rounded
                          size="sm"
                          disabled={
                            user.role === "admin" || user.status === "activate"
                              ? true
                              : false
                          }
                        >
                          Activate
                        </MDBBtn>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
        </MDBTableBody>
      </MDBTable>
      <PaginationUser
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        totalPage={totalPage}
        paginationButtons={paginationButtons}
      />
    </div>
  );
}

export default ListUser;
