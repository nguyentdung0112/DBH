const express = require("express");
const {
  createBooking,
  getAllBookingsUser,
  getAllBookingsRoom,
  getAllBookingsRoomOwner,
} = require("../controllers/booking.controller");

const bookingRouter = express.Router();

bookingRouter.route("/create-booking").post(createBooking);
bookingRouter.route("/bookings/:userId").get(getAllBookingsUser);
bookingRouter.route("/bookings/room/:roomId").get(getAllBookingsRoom);
bookingRouter.route("/bookings/rooms/:roomId").get(getAllBookingsRoomOwner);

module.exports = {
  bookingRouter,
};
