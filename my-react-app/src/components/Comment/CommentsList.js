import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

import { toast } from "react-toastify";
import moment from "moment";
import {
  createCommentsService,
  createReplyCommentsService,
  getCommentsListService,
} from "../../services/comment/comment.service";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";

function CommentsList({ roomId }) {
  const handleCreateComment = async () => {
    try {
      const response = await createCommentsService({
        content: commentContent,
        RoomId: roomId,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.reload(true);
      }, [500]);
    } catch (error) {
      errorHandleUtil(error, toast);
    }
  };

  const [commentContent, setCommentContent] = useState(null);
  const [disabledCreateComment, setDisabledCreateComment] = useState(true);
  const [commentsList, setCommentsList] = useState([]);
  const [replyCommentContent, setReplyCommentContent] = useState(null);
  const [disabledCreateReplyComment, setDisabledCreateReplyComment] =
    useState(true);

  const handleChangeReplyCommentContent = (e) => {
    const replyComment = e.target.value;
    if (replyComment !== null) {
      setDisabledCreateReplyComment(false);
    }
    setReplyCommentContent(e.target.value);
  };
  const handleCreateReplyComment = async (commentId) => {
    try {
      const response = await createReplyCommentsService(commentId, {
        content: replyCommentContent,
        RoomId: roomId,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.reload(true);
      }, [500]);
    } catch (error) {
      errorHandleUtil(error, toast);
    }
  };
  const handleChangeCommentContent = (e) => {
    const content = e.target.value;

    if (content !== null) {
      setDisabledCreateComment(false);
    }
    setCommentContent(e.target.value);
  };

  useEffect(() => {
    const fetchCommentsList = async () => {
      try {
        const response = await getCommentsListService(roomId);
        setCommentsList(response.data.data.allCommentsOnPost);
      } catch (error) {}
    };

    fetchCommentsList();
  }, []);

  return (
    <section className="gradient-custom">
      <MDBContainer style={{ maxWidth: "1500px" }}>
        <MDBRow className="justify-content-center">
          <MDBCol>
            <MDBCard className="shadow-none">
              <MDBCardBody className="p-2">
                <div className="d-flex flex-start">
                  <MDBTypography tag="h4" className="text-center mb-4 pb-2">
                    Comment
                  </MDBTypography>
                </div>

                <div className="d-flex flex-start">
                  <MDBInput
                    value={commentContent}
                    onChange={handleChangeCommentContent}
                    name="comment"
                  />
                  <MDBBtn
                    className="text-capitalize"
                    disabled={disabledCreateComment}
                    onClick={handleCreateComment}
                    style={{
                      width: "120px",
                      marginLeft: "10px",
                    }}
                  >
                    Create
                  </MDBBtn>
                </div>

                <MDBRow>
                  <MDBCol>
                    {commentsList.map((comment) => {
                      return (
                        <div className="d-flex flex-start my-3">
                          <div>
                            <MDBCardImage
                              className="rounded-circle shadow-1-strong me-3"
                              src={comment.User.avatar}
                              alt="avatar"
                              // width="65"
                              // height="65"
                              style={{
                                width: "65px",
                                height: "65px",
                              }}
                            />
                          </div>

                          <div className="flex-grow-1 flex-shrink-1">
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
                                        src={reply.User.avatar}
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingTop:"10px"
                              }}
                            >
                       
                              <MDBInput
                                wrapperClass="mt-2 mx-3"
                                placeholder="Type comment..."
                                label="Reply"
                                onChange={handleChangeReplyCommentContent}
                                size="sm"
                                name="replyComment"
                                id="replycmt"
                              />
                              <MDBIcon
                                icon="paper-plane"
                                className="cyan-text"
                                size="1x"
                                style={{ cursor: "pointer" }}
                                disabled={disabledCreateReplyComment}
                                onClick={() => {
                                  handleCreateReplyComment(comment.id);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}

export default CommentsList;
