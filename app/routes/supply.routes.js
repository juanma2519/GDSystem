const { authJwt } = require("../middleware");
const controller = require("../controllers/supply.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/allSupplys",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.allSupplys
  );

  app.get("/api/test/allTypeSupplys",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.allTypeSupplys
  );

  app.post("/api/test/newSupply",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.newSupply
  );

  app.get("/api/test/allSupplysDNI",
  [authJwt.verifyToken],
  controller.allSupplysDNI
  );

};