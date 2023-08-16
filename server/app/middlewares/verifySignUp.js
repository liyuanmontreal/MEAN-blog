const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res,next) => {
    console.log("check user name");
    // Username
    User.findOne({username: req.body.username}).exec().then(function(user) {          
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });   
            return;
        }  
        else{
            // check email
            User.findOne({ email: req.body.email}).exec().then(function(user) {   
                if (user) {
                    res.status(400).send({ message: "Failed! Email is already in use!" });    
                    return;        
                }   
                next();          
            })
            .catch(function(err) {
                //email error
                res.status(500).send({ message: err });
                return;    
            });  
        }         
       
    })
    .catch(function(err) {
         //user error
        res.status(500).send({ message: err });
        return;    
    });    

   console.log("check user name finish");
   
};

checkRolesExisted = (req, res, next) => {  
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {   
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }  
  console.log("check role end1");
  next();
  console.log("check role end2");
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;