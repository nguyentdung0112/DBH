import React, { useEffect, useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import {
  deleteOneCommentService,
  getAllCommentsListService,
} from "../../services/comment/comment.service";
import moment from "moment";
import { toast } from "react-toastify";

function ListComment() {
  const [commentsList, setCommentsList] = useState([]);

  useEffect(() => {
    const fetchCommentsList = async () => {
      try {
        const response = await getAllCommentsListService();
       
        setCommentsList(response.data.data.allComments);
      } catch (error) {
        const message = error.response.data.message;
        toast.error(message);
      }
    };

    fetchCommentsList();
  }, []);
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteOneCommentService(commentId);
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
            <th scope="col">User</th>
            <th scope="col">Room Id</th>
            <th scope="col">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {commentsList.length > 0 &&
            commentsList.map((comment) => {
              return (
                <tr>
                  <td>
                    <div className="d-flex ">
                      <div>
                        <MDBCardImage
                          className="rounded-circle shadow-1-strong me-3"
                          src={comment.User.avatar}
                          alt="avatar"
                          style={{
                            width: "65px",
                            height: "65px",
                          }}
                        />
                      </div>
                      <div className="flex-grow-1 ">
                        <div>
                          <div className="d-flex justify-content-between align-items-center  text-warning">
                            <p className="mb-1">
                              {comment.User.userName} {"  -  "}
                              <span className="small">
                                {moment(comment.createdAt).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                              </span>
                            </p>
                          </div>
                          <p className="small mb-0">{comment.content}</p>
                        </div>

                        {comment.replies.length > 0 &&
                          comment.replies.map((reply) => {
                            return (
                              <div className="d-flex flex-start mt-4">
                                <a className="me-3" href="#!">
                                  <MDBCardImage
                                    className="rounded-circle shadow-1-strong me-3"
                                    src={comment.User.avatar}
                                    alt="avatar"
                                    style={{
                                      width: "65px",
                                      height: "65px",
                                    }}
                                  />
                                </a>

                                <div className="flex-grow-1 flex-shrink-1">
                                  <div>
                                    <div className="d-flex justify-content-between align-items-center text-info">
                                      <p className="mb-1 ">
                                        {reply.User.userName} {"  -  "}
                                        <span className="small">
                                          {moment(reply.createdAt).format(
                                            "DD/MM/YYYY HH:mm"
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                    <p className="small mb-0">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </td>
                  <td> {comment.RoomId}</td>
                  <td>
                    <MDBBtn
                      onClick={() => handleDeleteComment(comment.id)}
                      color="danger"
                      rounded
                      size="sm"
                    >
                      Delete
                    </MDBBtn>
                  </td>
                </tr>
              );
            })}
          {/* {comment.replies.length > 0 &&
            comment.replies.map((reply) => {
              return (
               <>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <p className="fw-bold mb-1">{reply.User.userName}</p>
                      </div>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">
                        <p className="text-muted mb-0">
                          {moment(reply.createdAt).format("DD/MM/YYYY HH:mm")}
                        </p>
                      </p>
                    </td>
                    <td>{reply.content}</td>
                    <td> {reply.RoomId}</td>
                    <td>
                      <MDBBtn
                        onClick={() => handleDeleteComment(reply.id)}
                        color="danger"
                        rounded
                        size="sm"
                      >
                        Delete
                      </MDBBtn>
                    </td>
                  </tr>
                </>
            ) } */}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default ListComment;
