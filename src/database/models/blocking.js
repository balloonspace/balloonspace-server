export default (sequelize, DataTypes) => {
  const blocking = sequelize.define(
    "Blocking",
    {
      target_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        references: {
          model: "User",
          key: "user_id"
        }
      },
      user_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        references: {
          model: "User",
          key: "user_id"
        }
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  return blocking;
};
