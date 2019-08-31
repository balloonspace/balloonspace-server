export default (sequelize, DataTypes) => {
  const user = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      user_pw: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  return user;
};
