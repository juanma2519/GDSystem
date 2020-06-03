  
    const db = require("../models");
    const config = require("../config/auth.config");
    const Supply = db.supply;
    const TypeSupplys = db.typeSupplys
    const TypeSupply = db.typeSupply;
    const Op = db.Sequelize.Op;
    const User = db.user;
    var Sequelize = require('sequelize');
    var jwt = require("jsonwebtoken");
    var bcrypt = require("bcryptjs");
    const express = require('express');  
    const cors = require('cors');
    var app = express();
    var fs = require("fs");
    var multer  = require('multer')
    var upload = multer({ dest: 'uploads/' })

    

  exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };


  exports.allSupplys = (req, res) => {

    //get all data users
    Supply.findAll({ attributes: ['client', 'address', 'rate', 'power', 'name', 'surname'], include:{model:TypeSupply, attributes:['typename']} }).then(supplys => {
      res.status(200).send(supplys);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  }

  exports.allTypeSupplys = (req, res) => {

    //get all data users
    TypeSupply.findAll({ attributes: ['id', 'typename']}).then(typeSupplys => {
      res.status(200).send(typeSupplys);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  }

  exports.newSupply = (req, res) => {
    Supply.create({
        client: req.body.client,
        address: req.body.address,
        rate: req.body.rate,
        power: req.body.power,
        name: req.body.name,
        surname: req.body.surname
      }).then(supply => {
          if (req.body.tipo) {
            TypeSupply.findAll({
              where: {
                typename: req.body.tipo
              }
            }).then(typeSupplys => {
              supply.setTypeSupplys(typeSupplys).then(() => {
                  User.findAll({
                    where: {
                      dni: req.body.client
                    }
                  }).then(users => {
                    supply.setUsers(users).then(() => {
                      this.allSupplys(req, res);
                    });
                  })
                  .catch(err => {
                      res.status(500).send({ messager: err.message });
                  });
              });
            })
            .catch(err => {
                res.status(500).send({ messager: err.message });
              });
          } else {
            // user role = 1
            supply.setTypeSupplys([1]).then(() => {
              this.allSupplys(req, res);
            }).catch(err => {
                res.status(500).send({ message: err.message });
            });
          }
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
  }

  exports.allSupplysDNI = (req, res) => {
    db.sequelize.query('select supplys.client, supplys.address, supplys.rate, supplys.power, supplys.name, supplys.surname, typeSupplys.typename from supplys, supply_typeSupplys, typesupplys where supplys.client = "'+req.query.params+'" and supplys.id = supply_typeSupplys.supplyId and supply_typeSupplys.typeSupplyId = typesupplys.id;',
        { bind: ['active'], type: db.sequelize.QueryTypes.SELECT }
      ).then(function(supplys) {
        res.status(200).send(supplys);
      }).catch(err => {
          res.status(500).json({ message: err.message });
      });
  }

  exports.uploadImage = (req, res) => {
    app.use(multer({ 
      dest: './uploads/',
      rename: function (fieldname, filename) {
          return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
      },
      onFileUploadStart: function (file) {
          console.log(file.fieldname + ' is starting ...')
      },
      onFileUploadData: function (file, data) {
          console.log(data.length + ' of ' + file.fieldname + ' arrived')
      },
      onFileUploadComplete: function (file) {
          console.log(file.fieldname + ' uploaded to  ' + file.path)
      }
  }));
}

  



    






