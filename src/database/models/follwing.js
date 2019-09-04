export default (sequelize, DataTypes) => {
  const following = sequelize.define(
    "Following",
    {
      target_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        references: {
          model: "User",
          key: "user_id"
        }
      },
      follower_id: {
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

  return following;
};
