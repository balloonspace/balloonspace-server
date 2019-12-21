module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "balloonspace_dev",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-9"
    },
    logging: false
  },
  test: {
    username: "root",
    password: "root",
    database: "balloonspace_dev",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-9"
    },
    logging: false
  },
  production: {
    username: "root",
    password: "root",
    database: "balloonspace",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-9"
    },
    logging: false
  }
};
