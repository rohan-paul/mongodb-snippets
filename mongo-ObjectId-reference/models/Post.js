const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
  title: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      text: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]
});

module.exports = mongoose.model("Post", PostSchema);
