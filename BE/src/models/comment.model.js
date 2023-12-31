const commentModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
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
module.exports = { commentModel };
