var express = require("express");
var router = express.Router();
// const mongoose = require('mongoose');
const User = require("../models/User");
const Post = require("../models/Post");

// Manually creating two new users from the User model who will create and comment on posts
let rohan = new User({
  name: "Rohan"
});

let paul = new User({
  name: "Paul"
});

// Now create a post along with comments by the above two users
let posts = new Post({
  title: "Hello World",
  postedBy: rohan._id,
  comments: [
    {
      text: "Nice post!",
      postedBy: paul._id
    },
    {
      text: "Awesome post",
      postedBy: paul._id
    }
  ]
});

// route to get all the existing Tidal data
// router.get("/", (req, res, next) => {
//   User.find({}, (err, docs) => {
//     if (err) {
//       return next(err);
//     }
//     res.status(200).send(docs);
//   });
// });

router.post("/", (req, res, next) => {
  posts.save(err => {
    if (err) return next(err);
    Post.find({})
      .populate("postedBy")
      .populate("comments.postedBy")
      .exec((error, post) => {
        console.log(JSON.stringify(posts, null, "\t"));
      });
  });
});

module.exports = router;
