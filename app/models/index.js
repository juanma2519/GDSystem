const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.supply = require("../models/supply.model.js")(sequelize, Sequelize);
db.typeSupply = require("../models/typeSupply.model.js")(sequelize, Sequelize);



//tabla referencia tipo de suministro
db.typeSupply.belongsToMany(db.supply, {
  through: "supply_typeSupplys",
  foreignKey: "typeSupplyId",
  otherKey: "supplyId"
});

db.supply.belongsToMany(db.typeSupply, {
  through: "supply_typeSupplys",
  foreignKey: "supplyId",
  otherKey: "typeSupplyId"
});


//tabla referencia suministro-usuario
db.supply.belongsToMany(db.user, {
  through: "user_supplys",
  foreignKey: "supplyId",
  otherKey: "userId"
});


db.user.belongsToMany(db.supply, {
  through: "user_supplys",
  foreignKey: "userId",
  otherKey: "supplyId"
});

db.user.belongsTo(db.supply, { as: 'typename' });

//tabla referencia rol-usuario
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.user.belongsTo(db.role, { as: 'rolename' });

db.ROLES = ["user", "admin", "moderator"];
db.TYPESUPPLYS = ["luz", "agua", "gas"];

module.exports = db;

