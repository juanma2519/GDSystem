module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("supplys", {
      client: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      rate: {
        type: Sequelize.STRING
      },
      power: {
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING
      },
      surname:{
        type: Sequelize.STRING
      }
    });
    return Role;
  };