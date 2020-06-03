  
    const db = require("../models");
    const config = require("../config/auth.config");
    const User = db.user;
    const Role = db.role;
    const Op = db.Sequelize.Op;

    var jwt = require("jsonwebtoken");
    var bcrypt = require("bcryptjs");
    
  
  
  exports.allAccess = (req, res, next) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res, next) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res, next) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res, next) => {
    res.status(200).send("Moderator Content.");
  };


  exports.allUsers = (req, res) => {

    //get all data users
    User.findAll({ attributes: ['username', 'email', 'phone', 'name', 'surname', 'dni'], include:{model:Role, attributes:['rolename']} }).then(users => {
      res.status(200).send(users);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  }

  exports.autocompleteUsers = (req, res) => {
   User.findAll({
      limit: 5,
      where: { [Op.or]: [
        { dni: { [Op.like]: `%${req.query.params}%`}}
      ]},
      attributes: ['id', 'dni', 'name', 'surname'],
    }).then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
  }