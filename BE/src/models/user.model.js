const userModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      avatar: {
        type: DataTypes.STRING,
        defaultValue:
          "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg",
      },

      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        status: ["activate", "disabled"],
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        role: ["owner", "user", "admin"],
      },

      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          // validate phoneNumber: 10, firstNum = 84 or 0
          // 0986 478 427
          is: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        },
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = {
  userModel,
};
