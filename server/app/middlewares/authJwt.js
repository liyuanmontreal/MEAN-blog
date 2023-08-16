const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};

   


isAdmin = (req, res, next) => {
    User.findById(req.userId).exec().then(function(user)  {     
        Role.find({_id: { $in: user.roles }, }).then (function(roles){  
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                  next();
                  return;
                }
              }
      
              res.status(403).send({ message: "Require Admin Role!" });
              return;
        })
        .catch(function(err) {
            res.status(500).send({ message: err });
            return;
        });
    })
    .catch(function(err) {
        res.status(500).send({ message: err });
        return;
    });
}





const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;