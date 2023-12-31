const bookingModal = (sequelize, DataTypes) => {
  return sequelize.define(
    "Booking",
    {
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        status: ["paid", "created"],
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
module.exports = { bookingModal };
