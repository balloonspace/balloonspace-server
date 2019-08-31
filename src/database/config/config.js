module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "balloonspace_dev",
    host: "127.0.0.1",
    port: "3307",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-9"
    }
  },
  test: {
    username: "root",
    password: "root",
    database: "balloonspace_dev",
    host: "127.0.0.1",
    port: "3307",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-9"
    }
  },
  production: {
    username: "root",
    password: "root",
    database: "balloonspace",
    host: "127.0.0.1",
    port: "3307",
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-9"
    }
  }
};
