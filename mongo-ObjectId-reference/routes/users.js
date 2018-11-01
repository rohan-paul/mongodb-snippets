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

rohan.save();
paul.save();

// Now create a post along with comments by the above two users
// let post = new Post({
//   title: "Hello World",
//   postedBy: rohan._id,
//   comments: [
//     {
//       text: "Nice post!",
//       postedBy: paul._id
//     },
//     {
//       text: "Thanks mate",
//       postedBy: rohan._id
//     }
//   ]
// });

// post.save(err => {
//   if (err) return next(err);
//   Post.find({})
//     .populate("postedBy")
//     .populate("comments.postedBy")
//     .exec((error, posts) => {
//       console.log(JSON.stringify(posts, null, "\t"));
//     });
// });

router.post("/", (req, res, next) => {
  var posts = new Post(req.body);
  posts.save((err, newPosts) => {
    if (err) return next(err);
    Post.find({})
      .populate("postedBy")
      .populate("comments.postedBy")
      .exec((error, post) => {
        res.status(200).send(newPosts);
      });
  });
});

module.exports = router;

/*



*/
