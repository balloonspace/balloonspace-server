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
        type: DataTypes.STRING(100),
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

  user.associate = models => {
    user.hasMany(models.Following, {
      foreignKey: "target_id",
      sourceKey: "user_id",
      onDelete: "cascade"
    });

    user.hasMany(models.Following, {
      foreignKey: "follower_id",
      sourceKey: "user_id",
      onDelete: "cascade"
    });

    user.hasMany(models.Blocking, {
      foreignKey: "target_id",
      sourceKey: "user_id",
      onDelete: "cascade"
    });

    user.hasMany(models.Blocking, {
      foreignKey: "user_id",
      sourceKey: "user_id",
      onDelete: "cascade"
    });
  };

  return user;
};
