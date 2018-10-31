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
let post = new Post({
  title: "Hello World",
  postedBy: rohan._id,
  comments: [
    {
      text: "Nice post!",
      postedBy: paul._id
    },
    {
      text: "Thanks mate",
      postedBy: rohan._id
    }
  ]
});

post.save(err => {
  if (err) return next(err);
  Post.find({})
    .populate("postedBy")
    .populate("comments.postedBy")
    .exec((error, posts) => {
      console.log(JSON.stringify(posts, null, "\t"));
    });
});

// router.post("/", (req, res, next) => {
//   var posts = new Post(req.body);
//   posts.save(err => {
//     if (err) return next(err);
//     Post.find({})
//       .populate("postedBy")
//       .populate("comments.postedBy")
//       .exec((error, post) => {
//         console.log(JSON.stringify(posts, null, "\t"));
//       });
//   });
// });

module.exports = router;

/*

{
	"title" : "Hello World",
	"postedBy" : ObjectId("5bd9bbe6a97f642b568cba06"),
	"comments" : [
		{
			"_id" : ObjectId("5bd9bbe6a97f642b568cba0a"),
			"text" : "Nice post!",
			"postedBy" : ObjectId("5bd9bbe6a97f642b568cba07")
		},
		{
			"_id" : ObjectId("5bd9bbe6a97f642b568cba09"),
			"text" : "Thanks :)",
			"postedBy" : ObjectId("5bd9bbe6a97f642b568cba07")
		}
	],
	"__v" : 0
}
{
	"_id" : ObjectId("5bd9be94540ea82e65649bde"),
	"title" : "Hello World",
	"postedBy" : ObjectId("5bd9be94540ea82e65649bdc"),
	"comments" : [
		{
			"_id" : ObjectId("5bd9be94540ea82e65649be0"),
			"text" : "Nice post!",
			"postedBy" : ObjectId("5bd9be94540ea82e65649bdd")
		},
		{
			"_id" : ObjectId("5bd9be94540ea82e65649bdf"),
			"text" : "Thanks :)",
			"postedBy" : ObjectId("5bd9be94540ea82e65649bdd")
		}
	],
	"__v" : 0
}

*/
