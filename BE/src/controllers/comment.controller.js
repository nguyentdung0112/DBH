const { Comment, User } = require("../database/sequelize");
const { getUserFromToken } = require("../middlewares/check-login.middleware");

const createNewComment = async (req, res, next) => {
  try {
    const { content, RoomId } = req.body;
    const currentUser = await getUserFromToken(req, res, next);
    console.log(
      "🚀 ~ file: comment.controller.js:48 ~ createNewComment ~ currentUser:",
      currentUser
    );

    const newComment = await Comment.create({
      content,
      UserId: currentUser.id,
      parentId: null,
      RoomId,
    });

    return res.json({
      data: {
        newComment,
      },
      message: "Create comment success",
    });
  } catch (error) {
    next(error);
  }
};

const replyComment = async (req, res, next) => {
  try {
    console.log("here");
    const { content, RoomId } = req.body;
    const { parentCommentId } = req.params;
    const currentUser = await getUserFromToken(req, res, next);

    const newReply = await Comment.create({
      content,
      UserId: currentUser.id,
      parentId: parentCommentId,
      RoomId,
    });

    return res.json({
      data: {
        newReply,
      },
      message: "Reply comment success",
    });
  } catch (error) {
    next(error);
  }
};

const getAllCommentsOnPost = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const allCommentsOnPost = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["avatar", "email", "fullName", "userName"],
        },
        {
          model: Comment,
          as: "replies",
          include: {
            model: User,
            attributes: ["avatar", "email", "fullName", "userName"],
          },
        },
      ],
      where: {
        RoomId: roomId,
        parentId: null,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      data: {
        allCommentsOnPost,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getAllComments = async (req, res, next) => {
  try {
    const allComments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["avatar", "email", "fullName", "userName"],
        },
        {
          model: Comment,
          as: "replies",
          include: {
            model: User,
            attributes: ["avatar", "email", "fullName", "userName"],
          },
        },
      ],
      where: {
        parentId: null,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      data: {
        allComments,
      },
    });
  } catch (error) {
    next(error);
  }
};
const deleteAllComment = async (req, res, next) => {
  try {
    await Comment.destroy({
      where: {},
    });

    return res.json({
      message: "Delete all Comment success",
    });
  } catch (error) {
    return next(error);
  }
};
const deleteOneComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCmt = await Comment.destroy({
      where: {
        id,
      },
    });

    return res.json({
      data: {
        deletedCmt,
      },
      message: "Delete Cmt success",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  replyComment,
  getAllCommentsOnPost,
  createNewComment,
  deleteAllComment,
  deleteOneComment,
  getAllComments,
};
