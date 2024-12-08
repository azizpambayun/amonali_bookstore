"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file.indexOf(".test.js") === -1;
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

function associate(models) {
  models.User.hasMany(models.Transaction, {
    foreignKey: "user_id",
    as: "transactions",
  });

  models.Transaction.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  models.Transaction.hasMany(models.TransactionDetail, {
    foreignKey: "transaction_id",
    as: "transaction_details",
  });

  models.TransactionDetail.belongsTo(models.Transaction, {
    foreignKey: "transaction_id",
    as: "transaction",
  });

  models.Book.hasMany(models.TransactionDetail, {
    foreignKey: "book_id",
    as: "book_details",
  });

  models.TransactionDetail.belongsTo(models.Book, {
    foreignKey: "book_id",
    as: "book",
  });

  models.User.hasMany(models.CartItem, {
    foreignKey: "user_id",
    as: "cart_items",
  });

  models.CartItem.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  models.Book.hasMany(models.CartItem, {
    foreignKey: "book_id",
    as: "book_cart_items",
  });

  models.CartItem.belongsTo(models.Book, {
    foreignKey: "book_id",
    as: "book",
  });
}
