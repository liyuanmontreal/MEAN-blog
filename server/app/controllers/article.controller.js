const db = require("../models");
const Article = db.article;
const objectId = require('mongodb').ObjectId;

exports.getAllArticle = (req, res) => {
  const title = req.query.title;
 
  Article.find().then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving articles."
      });
    });
};

// exports.getArticleByName = (req, res) => {
//   const title = req.query.title;
//   var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

//   Article.find().then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving articles."
//       });
//     });
// };
  

  exports.getArticleById = (req, res) => {
    const id = req.params.id;

    Article.findById(new objectId(id)).then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Article with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Article with id=" + id });
      });
  };


  exports.createArticle = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Article
  const article = new Article({   
    title: req.body.title,
    content: req.body.content  ,
    userid:req.body.userid
  });

  // Save Article in the database
  article.save(article)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Article."
      });
    });

};

  exports.updateArticleById = (req, res) => {
  
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;

    const newdata = {
      title: req.body.title,
      content: req.body.content,
      
    };
    console.log(newdata);
  
    Article.findByIdAndUpdate(new objectId(id), newdata, { useFindAndModify: false })
      .then(function(data) {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Article with id=${id}. Maybe Article was not found!`
          });
        } else res.send({ message: "Article was updated successfully." });
      })
      .catch(function(err){
        res.status(500).send({
          message: "Error updating Article with id=" + id
        });
      });
  };

  exports.deleteArticleById = (req, res) => {
     const id = req.params.id;

    Article.findByIdAndRemove(new objectId(id), { useFindAndModify: false })
      .then(function(data) {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Article with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
          res.send({
            message: "Article was deleted successfully!"
          });
        }
      })
      .catch(function(err) {
        res.status(500).send({
          message: "Could not delete Article with id=" + id
        });
      });
};

// // Delete all Articles from the database.
// exports.deleteAll = (req, res) => {
//   Tutorial.deleteMany({})
//     .then(data => {
//       res.send({
//         message: `${data.deletedCount} Articles were deleted successfully!`
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all articles."
//       });
//     });
// };

