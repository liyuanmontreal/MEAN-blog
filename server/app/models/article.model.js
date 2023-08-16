const mongoose = require("mongoose");

const Article= mongoose.model(
  "Article",
  new mongoose.Schema(
    {
    
    title: String,
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },   
    //comment:[],
    //upvotes:0
  },
  { timestamps: true }
  )
);

module.exports = Article;
