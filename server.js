const express = require("express");
const multipart = require('connect-multiparty');
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require('path');
const app = express();

// routes
var auth_routes = require('./app/routes/auth.routes')(app);
var user_routes = require('./app/routes/user.routes')(app);
var supply_routes = require('./app/routes/supply.routes')(app);

const fs = require('fs');
const { createWorker } = require('tesseract.js');
var Tesseract = require('tesseract.js');


const db = require("./app/models");
const Role = db.role;
const TypeSupply = db.typeSupply;
// set port, listen for requests
const PORT = process.env.PORT || 3000;
var corsOptions = {
  origin: "*"
};

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

const multipartMiddleware = multipart({
  uploadDir: './uploads'
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, 'client')));
app.use(auth_routes);
app.use(user_routes);
app.use(supply_routes);


app.get('*', function (req, res){
  res.sendFile('index.html', {root: __dirname + '/dist/GOB'})
})

app.post('/api/upload', multipartMiddleware, (req, res) => {

  for(i=0; i < req.files.uploads.length; i++){
    var fileContents;
    try {
      var image = fs.readFileSync(
        __dirname + "\\" + req.files.uploads[i].path,
        {
          encoding: null
        }
      );
    } catch (err) {
      res.status(500).json({ message: err.message });
    }




    if(req.files.uploads[i].type != "application/pdf" && req.files.uploads[i].type.includes('image/')){
      Tesseract.recognize(image, 'spa')
      .then(text => {
        res.json({ message: text.data.text });
      })
      .catch(error => {
        console.log(error.message);
      })
    }else{
      res.status(500).json({ message: "Formato desconocido" });
    }
  }

});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    rolename: "user"
  });
 
  Role.create({
    id: 2,
    rolename: "moderator"
  });
 
  Role.create({
    id: 3,
    rolename: "admin"
  });

  TypeSupply.create({
    id: 1,
    typename: "agua"
  });
 
  TypeSupply.create({
    id: 2,
    typename: "luz"
  });
 
  TypeSupply.create({
    id: 3,
    typename: "gas"
  });
}



