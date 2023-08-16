const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  credentials: true,
  origin: "http://localhost:4200"
};
app.use(cors(corsOptions));

// app.use(
//     cors({
//       credentials: true,
//       origin: ["http://localhost:4200"],
//     })
//   );



// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "blog-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });




// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to mean blog application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/article.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



function initial() {
    Role.estimatedDocumentCount().then(function(count) {
        if (count === 0) {
            new Role({name: "user"}).save().then(function() {            
                console.log("added 'user' to roles collection");
                })
                .catch(function(err) {
                    console.log(err);   
                
            });
            new Role({name: "admin"}).save().then(function() {            
                console.log("added 'admin' to roles collection");
                })
                .catch(function(err) {
                    console.log(err);   
                
            });  
      }
    })
    .catch(function(err) {
        console.log(err);   
    
    });

  }
  