const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2");
const { userModel } = require("../models/user.model");
const { otpModel } = require("../models/otp.model");
const { roomModel } = require("../models/room.model");
const { commentModel } = require("../models/comment.model");
const { bookingModal } = require("../models/booking.model");

const host = "localhost";
const port = 3306;
const user = "root";
const password = "123456";
const databaseName = "dbh";

const pool = mysql.createPool({ host, port, user, password });
pool.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);

const sequelize = new Sequelize(databaseName, user, password, {
  host,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    raw: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database");
  });

const User = userModel(sequelize, DataTypes);
const Otp = otpModel(sequelize, DataTypes);
const Room = roomModel(sequelize, DataTypes);
const Comment = commentModel(sequelize, DataTypes);
const Booking = bookingModal(sequelize, DataTypes);

User.hasOne(Otp);

User.hasMany(Comment);

Comment.belongsTo(User);

Comment.belongsTo(Comment, { foreignKey: "parentId" });
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });

Room.hasMany(Comment);
Comment.belongsTo(Room);
// qhe 1-n  User va Room
User.hasMany(Room, { foreignKey: "userId" });
Room.belongsTo(User, { foreignKey: "userId" });

// qhe 1-n  User va Booking
User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

// qhe 1-n  Room va Booking
Room.hasMany(Booking, { foreignKey: "roomId" });
Booking.belongsTo(Room, { foreignKey: "roomId" });

//  - Kiểm tra bảng trong cơ sở dữ liệu (có những trường nào, kiểu dữ liệu là gì ...) sau đó sẽ thay đổi phù hợp với model
sequelize.sync({
  // alter: true,
  // force: true,
});

module.exports = {
  sequelize,
  User,
  Otp,
  Room,
  Comment,
  Booking,
};
