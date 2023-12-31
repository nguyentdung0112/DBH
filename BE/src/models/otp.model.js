const otpModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Otp",
    {
      otpCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expriredAt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};
module.exports = { otpModel };
