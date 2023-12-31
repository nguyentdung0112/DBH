const express = require("express");
const {
  checkLoginMiddleware,
} = require("../middlewares/check-login.middleware");
const {
  getDetailRoom,
  getDetailAllRooms,
  search,
  createRoom,
  updateRoom,
  deleteAllRoom,
  deleteOneRoom,
  fakeRoomsData,
  pagination,
  getRoomLastest,
  getlAllRoomsOfUser,
  getlAllRoomsRentedOfUser,
  getDetailRoomBooking,
  getAllBookingOfRoom,
} = require("../controllers/room.controller");

const roomRouter = express.Router();

roomRouter.route("/room/get-detail-room/:roomId").get(getDetailRoom);
roomRouter
  .route("/room/get-detail-room-booking/:roomId")
  .get(getDetailRoomBooking);

roomRouter.route("/room/get-detail-all-rooms").get(getDetailAllRooms);

roomRouter.route("/room/search").get(search);

roomRouter.route("/room/createRoom").post(createRoom);


// update Room
roomRouter.route("/room/updateRoom/:id").put(updateRoom);


roomRouter.route("/room/getAllBookingRoom/:roomId").get(getAllBookingOfRoom)

roomRouter.route("/room/:id").delete(deleteOneRoom);

roomRouter.route("/room").delete(deleteAllRoom);

roomRouter.route("/room/fake-data/create-rooms").get(fakeRoomsData);
roomRouter.route("/room/pagination").get(pagination);
roomRouter.route("/room/getRoomLastest").get(getRoomLastest);

roomRouter.route("/room/getRoomOfUser/:userId").get(getlAllRoomsOfUser);
roomRouter.route("/room/getRoomRentedOfUser/:userId").get(getlAllRoomsRentedOfUser);

module.exports = {
  roomRouter,
};
