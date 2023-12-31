const { Booking } = require("../database/sequelize");
const { getUserFromToken } = require("../middlewares/check-login.middleware");

const createBooking = async (req, res, next) => {
  try {
    const { startDate, endDate, price, roomId } = req.body;
    const currUser = await getUserFromToken(req, res, next);
    const newBooking = await Booking.create({
      roomId,
      userId: currUser.id,
      startDate,
      endDate,
      price,
      status: "paid",
    });
    return res.json({
      data: {
        newBooking,
      },
      message: "Create booking success",
    });
  } catch (error) {
    return next(error);
  }
};
const getAllBookingsUser = async (req, res, next) => {
  try {
    const currUser = await getUserFromToken(req, res, next);
    const allBookings = await Booking.findAll({
      where: {
        userId: currUser.id,
      },
      order: [["createdAt", "ASC"]],
    });
    return res.json({
      data: {
        allBookings,
      },
      message: "Get booking of User success",
    });
  } catch (error) {
    return next(error);
  }
};
const getAllBookingsRoom = async (req, res, next) => {
  try {
    const currUser = await getUserFromToken(req, res, next);
    const currRoom = currUser.room;

    const allBookings = await Booking.findAll({
      where: {
        id: currRoom.id,
      },
    });
    return res.json({
      data: {
        allBookings,
      },
      message: "get booking of Room success",
    });
  } catch (error) {
    return next(error);
  }
};
const getAllBookingsRoomOwner = async (req, res, next) => {
  try {
    const currUser = await getUserFromToken(req, res, next);
    console.log("🚀 ~ file: booking.controller.js:68 ~ getAllBookingsRoomOwner ~ currUser:", currUser)
    const currRoom = currUser.room;
    console.log("🚀 ~ file: booking.controller.js:69 ~ getAllBookingsRoomOwner ~ currRoom:", currRoom)

    const allBookings = await Booking.findAll({
      where: {
        roomId: currRoom.id,
      },
    });
    return res.json({
      data: {
        allBookings,
      },
      message: "get booking of Room success",
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  createBooking,
  getAllBookingsRoom,
  getAllBookingsUser,
  getAllBookingsRoomOwner,
};
