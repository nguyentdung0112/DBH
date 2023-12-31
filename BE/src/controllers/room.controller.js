const { Room, User, Booking } = require("../database/sequelize");
const { getUserFromToken } = require("../middlewares/check-login.middleware");
const { Op } = require("sequelize");
const { faker } = require("@faker-js/faker");

const pagination = async (req, res, next) => {
  try {
    const { page, perPage, sortValue } = req.query;
    const offset = (Number(page) - 1) * Number(perPage);
    const limit = +perPage;
    const orderValue = sortValue ? JSON.parse(sortValue) : ["price", "DESC"];
    const allRoom = await Room.findAndCountAll({
      where: {},
      offset,
      limit,
      order: [orderValue],
      include: {
        model: User,
      },
    });

    const { count } = allRoom;

    const totalPage = Math.ceil(count / perPage);

    return res.json({
      data: {
        totalPage,
        page,
        perPage,
        total: count,
        allRoom: allRoom.rows,
      },
    });
  } catch (error) {
    return next(error);
  }
};
const getDetailRoom = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const currRoom = await Room.findOne({
      where: {
        id: roomId,
      },
      include: {
        model: User,
      },
    });
    if (!currRoom) {
      throw Error("This room is not found");
    }
    return res.json({
      data: {
        currRoom,
      },
    });
  } catch (error) {
    return next(error);
  }
};
const getDetailRoomBooking = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const currRoom = await Room.findOne({
      where: {
        id: roomId,
      },
      include: [
        {
          model: Booking,
        },
        {
          model: User,
        },
      ],
    });
    if (!currRoom) {
      throw Error("This room is not found");
    }
    return res.json({
      data: {
        currRoom,
      },
    });
  } catch (error) {
    return next(error);
  }
};
const getRoomLastest = async (req, res, next) => {
  try {
    const currRoom = await Room.findAll({
      limit: 1,
      where: {},
      order: [["createdAt", "DESC"]],
      // raw: true,
    });
    if (!currRoom) {
      throw Error("This room is not found");
    }

    return res.json({
      data: {
        currRoom: currRoom[0],
      },
    });
  } catch (error) {
    return next(error);
  }
};
const getDetailAllRooms = async (req, res, next) => {
  try {
    const allRooms = await Room.findAll({
      // include: {
      //   model: User,
      //   as: "User",
      //   attributes: ["userName", "fullName", "email", "avatar"],
      // },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      data: {
        allRooms,
      },
    });
  } catch (error) {
    return next(error);
  }
};
// help
const getlAllRoomsOfUser = async (req, res, next) => {
  try {
    const currUser = await getUserFromToken(req, res, next);

    const allRooms = await Room.findAll({
      where: {
        userId: currUser.id,
      },
      include: {
        model: Booking,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      data: {
        allRooms,
      },
      message: "Get room of User success",
    });
  } catch (error) {
    return next(error);
  }
};
const getlAllRoomsRentedOfUser = async (req, res, next) => {
  try {
    const { status } = req.body;
    const currUser = await getUserFromToken(req, res, next);

    const allRoomsRented = await Room.findAll({
      where: {
        userId: currUser.id,
        status: status,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      data: {
        allRoomsRented,
      },
      message: "Get room rented of User success",
    });
  } catch (error) {
    return next(error);
  }
};
const search = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const offset = (Number(page) - 1) * Number(perPage);
    const limit = +perPage;
    const search = req.query.search;
    if (search === "") {
      throw Error("Pls enter value");
    }
    const allRoom = await Room.findAndCountAll({
      where: {
        // address: { [Op.like]: `%${search}%` },

        [Op.or]: [
          {
            address: { [Op.like]: `%${search}%` },
          },
          {
            price: { [Op.like]: `%${search}%` },
          },
          {
            acreage: { [Op.like]: `%${search}%` },
          },
        ],
      },
      offset,
      limit,
    });

    const { count } = allRoom;

    const totalPage = Math.ceil(count / perPage);

    return res.json({
      data: {
        totalPage,
        page,
        perPage,
        total: count,
        allRoom: allRoom.rows,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const { price, acreage, address, description, roomImages, isStatus } =
      req.body;
    const currUser = await getUserFromToken(req, res, next);
    const status = isStatus ? "deactivate" : "active";
    const newRoom = await Room.create({
      price,
      acreage,
      address,
      description,
      status,
      roomImages: roomImages.join(";"),
      userId: currUser.id,
    });
    return res.json({
      data: {
        newRoom,
      },
      message: "Create room success",
    });
  } catch (error) {
    return next(error);
  }
};
const updateRoom = async (req, res, next) => {
  try {
    const { price, acreage, address, description, status } = req.body;
    const { id } = req.params;

    const updateRoom = await Room.update(
      {
        price,
        acreage,
        address,
        description,
        status,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return res.json({
      data: {
        updateRoom,
      },
      message: "Update Room success",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOneRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRoom = await Room.destroy({
      where: { id },
    });

    return res.json({
      data: {
        deletedRoom,
      },
      message: "Delete room success",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAllRoom = async (req, res, next) => {
  try {
    await Room.destroy({
      where: {},
    });

    return res.json({
      message: "Delete all Room success",
    });
  } catch (error) {
    return next(error);
  }
};
const createRandomRoom = () => {
  return {
    price: faker.commerce.price({
      min: 100000,
      max: 1000000,
      dec: 0,
    }),
    acreage: faker.number.int({ min: 10, max: 100 }),
    address:
      faker.location.streetAddress(false) +
      "-" +
      faker.location.city() +
      "-" +
      faker.location.county(),
    description: faker.commerce.productName(),
    status: "active",
    roomImages: `${faker.image.urlLoremFlickr({
      category: "business",
    })};${faker.image.urlLoremFlickr({
      category: "business",
    })};${faker.image.urlLoremFlickr({ category: "business" })}`,
    userId: 3,
  };
};

const fakeRoomsData = async (req, res, next) => {
  try {
    for (let index = 0; index < 5; index++) {
      await Room.create({
        ...createRandomRoom(),
      });
    }

    return res.json({
      message: "Create fake Room data success",
    });
  } catch (error) {
    return next(error);
  }
};
const getAllBookingOfRoom = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const currRoom = await Room.findOne({
      where: {
        id: roomId,
      },
    });
    if (!currRoom) {
      throw Error("This room is not found");
    }
    const allBookings = await Booking.findAll({
      where: {
        id: currRoom.id,
      },
    });
    return res.json({
      data: {
        allBookings,
      },
      message: "Get all booking of room success",
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
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
};
