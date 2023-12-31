const express = require("express");
const {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  getUserProfileAPI,
  getUsersListAPI,
  updateUser,
  paginationUser,
  deleteOne,
  createAdminAccount,

  updateStatus,
} = require("../controllers/user.controller");
const {
  checkLoginMiddleware,
} = require("../middlewares/check-login.middleware");

const userRouter = express.Router();
userRouter.route("/user/accountAdmin").post(createAdminAccount);

userRouter.route("/user/sign-in").post(signIn);
userRouter.route("/user/sign-up").post(signUp);
userRouter.route("/user/forgot-password").post(forgotPassword);
userRouter.route("/user/reset-password").post(resetPassword);
userRouter
  .route("/user/get-profile")
  .get([checkLoginMiddleware], getUserProfileAPI);
userRouter
  .route("/user/users-list")
  .get([checkLoginMiddleware], getUsersListAPI);

userRouter.route("/user/update").put([checkLoginMiddleware], updateUser);

userRouter.route("/user/pagination").get(paginationUser);
userRouter.route("/user/delete/:id").delete(deleteOne);

userRouter.route("/user/updateStatus/:id").put(updateStatus);
module.exports = {
  userRouter,
};
