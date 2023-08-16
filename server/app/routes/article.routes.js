const { authJwt } = require("../middlewares");
const controller = require("../controllers/article.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/articles/", controller.getAllArticle);

  app.get("/api/articles/:id", [authJwt.verifyToken], controller.getArticleById);

  app.post("/api/articles", [authJwt.verifyToken], controller.createArticle);

  app.put("/api/articles/:id", [authJwt.verifyToken], controller.updateArticleById);

  app.delete("/api/articles/:id", [authJwt.verifyToken], controller.deleteArticleById);
 
 

};