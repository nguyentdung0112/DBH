const express = require("express");
const { createNewComment, replyComment,getAllComments, getAllCommentsOnPost, deleteAllComment, deleteOneComment } = require("../controllers/comment.controller");

const commentRouter = express.Router();

// commentRouter.route("/post/:id").get(postComment);
// commentRouter.route("/post/:roomId/:id").delete(postComment);

commentRouter.route("/comment").post(createNewComment);
commentRouter.route("/comment/:parentCommentId").post(replyComment);
commentRouter.route("/comments/:roomId").get(getAllCommentsOnPost);
commentRouter.route("/comment/:id").delete(deleteOneComment);

commentRouter.route("/comments").delete(deleteAllComment);
commentRouter.route("/comments").get(getAllComments);


module.exports = {
  commentRouter,
};
