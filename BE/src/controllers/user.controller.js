const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User, Otp } = require("../database/sequelize");
const jwt = require("jsonwebtoken");
const { transport } = require("../mail/mail.config");
const nodemailer = require("nodemailer");
const { getUserFromToken } = require("../middlewares/check-login.middleware");

require("dotenv").config();
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateStatus = await User.update(
      {
        status: status,
      },
      {
        where: { id },
      }
    );

    return res.json({
      data: {
        updateStatus,
      },
      message: "update status User success",
    });
  } catch (error) {
    return next(error);
  }
};
const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.destroy({
      where: { id },
    });

    return res.json({
      data: {
        deletedUser,
      },
      message: "Delete User success",
    });
  } catch (error) {
    return next(error);
  }
};

const paginationUser = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;

    const offset = (Number(page) - 1) * Number(perPage);
    const limit = +perPage;

    const allUser = await User.findAndCountAll({
      where: {},
      offset,
      limit,
      order: [["createdAt", "ASC"]],
    });

    const { count } = allUser;

    const totalPage = Math.ceil(count / perPage);

    return res.json({
      data: {
        totalPage,
        page,
        perPage,
        total: count,
        allUser: allUser.rows,
      },
    });
  } catch (error) {
    return next(error);
  }
};
const createAdminAccount = async (req, res, next) => {
  try {
    const password = "admin";
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    await User.create({
      userName: "admin",
      fullName: "adminDBH",
      email: "admin@gmail.com",
      password: hash,
      role: "admin",
      status: "activate",
    });
    return res.json({
      message: "Create admin account success",
    });
  } catch (error) {
    return next(error);
  }
};
const signUp = async (req, res, next) => {
  try {
    const { userName, fullName, email, password, isOwner, isStatus } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const role = isOwner ? "owner" : "user";
    const status = isStatus ? "disable" : "activate";

    const newUser = await User.create({
      userName,
      fullName,
      email,
      password: hash,
      role: role,
      status: status,
    });

    const { password: anotherPassword, ...result } = newUser.get({
      plain: true,
    });

    return res.json({
      data: {
        result,
      },
      message: "Create user success",
    });
  } catch (error) {
    return next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const currUser = await User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (!currUser) {
      throw Error("User with email not exist");
    }
    if (currUser.status === "disable") {
      throw Error("Your account has been disabled !");
    }
    const isValidPassword = bcrypt.compareSync(password, currUser.password);

    if (!isValidPassword) {
      throw Error("Password is not match");
    }

    const accessToken = jwt.sign(
      {
        id: currUser.id,
        email: currUser.email,
      },
      "secret_key",
      { expiresIn: "300m" }
    );

    return res.json({
      accessToken,
      avatar: currUser.avatar,
      role: currUser.role,
      status: currUser.status,
      message: "Login Successfully",
    });
  } catch (error) {
    return next(error);
  }
};
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const forgotPasswordUser = await User.findOne({
      where: {
        email,
      },
      raw: true,
    });
    if (!forgotPasswordUser) {
      throw Error("This email is not existed on system");
    }
    const currOtp = await Otp.findOne({
      where: {
        UserId: forgotPasswordUser.id,
      },
      raw: true,
    });
    if (currOtp) {
      await Otp.destroy({
        where: {
          id: currOtp.id,
        },
      });
    }

    const otp = getRndInteger(1000, 9999);

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(otp.toString(), salt);

    const expriredAt = Date.now() + 120000;

    const newOtp = await Otp.create({
      otpCode: hash,
      expriredAt,
      UserId: forgotPasswordUser.id,
    });

    const info = await transport.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "OTP Code",
      html: `${otp}`,
    });
    return res.json({
      message: "OTP code is created successfully",
      EMAIL_URL: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    const currUser = await User.findOne({
      where: {
        email,
      },
      raw: true,
    });
    if (!currUser) {
      throw Error("Account is not found with this email");
    }
    const currOtp = await Otp.findOne({
      where: {
        UserId: currUser.id,
      },
    });
    if (!currOtp) {
      throw Error("sth went wrong with otp");
    }
    const { otpCode, expriredAt } = currOtp;
    if (expriredAt < Date.now()) {
      throw Error("OTP is exprired");
    }
    const isValidOtp = bcrypt.compareSync(otp, otpCode);
    if (!isValidOtp) {
      throw Error("OTP is not valid");
    }
    await Otp.destroy({
      where: {
        id: currOtp.id,
      },
    });
    const { updatePassword } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(updatePassword, salt);
    await User.update(
      {
        password: hash,
      },
      {
        where: {
          id: currUser.id,
        },
      }
    );
    return res.json({
      message: "Update password success",
    });
  } catch (error) {
    return next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const isLoginedUser = await getUserFromToken(req, res, next);

    if (!isLoginedUser) {
      throw new Error("User not found");
    }
    const { fullName, phoneNumber, isOwner, avatar } = req.body;

    const role = isOwner ? "owner" : "user";
    const updateUser = await isLoginedUser.update(
      {
        fullName,
        phoneNumber,
        role,
        avatar
      },
      {
        where: {
          id: isLoginedUser.id,
        },
      }
    );

    return res.json({
      data: {
        updateUser,
      },
      message: "Update user success",
    });
  } catch (error) {
    return next(error);
  }
};
const getUserProfileAPI = async (req, res, next) => {
  try {
    const isLoginedUser = await getUserFromToken(req, res, next);

    if (!isLoginedUser) {
      throw new Error("User not found");
    }

    const currUser = await User.findOne({
      where: {
        email: isLoginedUser.email,
      },
    });

    return res.json({
      data: {
        currUser,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getUsersListAPI = async (req, res, next) => {
  try {
    const isLoginedUser = await getUserFromToken(req, res, next);

    if (!isLoginedUser) {
      throw new Error("User not found");
    }

    const allUsers = await User.findAll({
      where: {
        role: "user",
      },
    });

    return res.json({
      data: {
        allUsers,
      },
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
  getUserProfileAPI,
  getUsersListAPI,
  updateStatus,
  updateUser,
  deleteOne,
  paginationUser,
  createAdminAccount,
};
