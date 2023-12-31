const roomModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Room",
    {
      price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        status: ["active", "deactivate"],
      },
      acreage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      roomImages: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const temp = this.getDataValue("roomImages");
          return temp ? temp.split(";") : null;p
        },
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = {
  roomModel,
};
