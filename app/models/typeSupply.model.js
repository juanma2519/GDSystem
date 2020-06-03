module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("typeSupplys", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      typename: {
        type: Sequelize.STRING
      }
    });
    return Role;
  };