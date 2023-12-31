import axios from "axios";

export const createCommentsService = async (commentPayload) => {
  const token = localStorage.getItem("token");
  return await axios.post("http://localhost:3000/comment", commentPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getCommentsListService = async (roomId) => {
  const token = localStorage.getItem("token");
  return await axios.get(`http://localhost:3000/comments/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getAllCommentsListService = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`http://localhost:3000/comments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createReplyCommentsService = async (commentId, replyPayload) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    `http://localhost:3000/comment/${commentId}`,
    replyPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const deleteOneCommentService = async (commentId) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`http://localhost:3000/comment/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
