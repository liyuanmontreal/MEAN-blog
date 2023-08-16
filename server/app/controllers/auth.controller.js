const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// sign up new user
exports.signup = (req, res) => {

  //create user object
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });



  //save new user to user collection
  user.save().then(function(user)  {
    //sign up as specific role
    if (req.body.roles) {
      Role.find({name: { $in: req.body.roles },}).then(function(roles) {   
          user.roles = roles.map((role) => role._id);
          user.save().then(function(){
            res.send({ message: "User was registered successfully!" });
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
    else 
    // sign up as user
    {
      Role.findOne({ name: "user" }).then( function(role){
        user.roles = [role._id];        
        user.save().then(function() {
          res.send({ message: "User was registered successfully!" });
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
  })
  .catch(function(err) {
    res.status(500).send({ message: err });
    return; 
  }); 
  console.log("sign up user finish");
};

exports.signin = (req, res) => {
  User.findOne({username: req.body.username,})
    .populate("roles", "-__v")
    .exec().then(function(user) {     
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
      });
    })
    .catch(function(err) {
      console.log(err);       
    }); 
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};