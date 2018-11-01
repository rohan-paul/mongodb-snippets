This is an exercise to show how mongodb references another model with `mongoose.Schema.Types.ObjectId,`

Just launch the project by doing `npm install` and then `npm start`

It will not show anything significant in the browser or Postman as I am inputting all the necessary data to feed mongodb in the `./routes/users.js` file with `posts.save`. Also there is no `router.post` as I am not saving to mongo after a post request but directly as soon as the server starts and `./routes/users.js`file gets executed.

So as soon as the server starts these data will be saved to mongodb and the output will be shown in the terminal.

```
mongo
show dbs
use mongo-reference
show collections
db.posts.find().pretty()
```

And it will show the below result

```
{
	"_id" : ObjectId("5bd9d560ce113b4a49d1530e"),
	"title" : "Hello World",
	"postedBy" : ObjectId("5bd9d560ce113b4a49d1530c"),
	"comments" : [
		{
			"_id" : ObjectId("5bd9d560ce113b4a49d15310"),
			"text" : "Nice post!",
			"postedBy" : ObjectId("5bd9d560ce113b4a49d1530d")
		},
		{
			"_id" : ObjectId("5bd9d560ce113b4a49d1530f"),
			"text" : "Thanks mate",
			"postedBy" : ObjectId("5bd9d560ce113b4a49d1530c")
		}
	],
	"__v" : 0
}
```

But to see the full query result which is the full document containing all Post references - it will be shown in the Terminal window where the server is running - because I am doing a `console.log()` here

```js
[
  {
    _id: "5bd9d560ce113b4a49d1530e",
    title: "Hello World",
    postedBy: {
      _id: "5bd9d560ce113b4a49d1530c",
      name: "Rohan",
      __v: 0
    },
    comments: [
      {
        _id: "5bd9d560ce113b4a49d15310",
        text: "Nice post!",
        postedBy: {
          _id: "5bd9d560ce113b4a49d1530d",
          name: "Paul",
          __v: 0
        }
      },
      {
        _id: "5bd9d560ce113b4a49d1530f",
        text: "Thanks mate",
        postedBy: {
          _id: "5bd9d560ce113b4a49d1530c",
          name: "Rohan",
          __v: 0
        }
      }
    ],
    __v: 0
  }
];
```

## If I wanted to get the data from Postman

#### A> Keep the 2 users (rohan and paul variables) in app.js - so they can be saved in mongo as soon as the app.js executes with server launching.

#### B> Comment out `let post` declaration and `post.save` in app.js.

#### C> Instead write the router.post function.

```js
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
```

#### D> Go to Postman > Body Tab > select radio button ‘raw’ > and from the drop-down list select JSON (application / json ) and paste the following json data.

### NOTE - For getting the 2 users \_id I have to get it from mongo shell in Terminam by running `db.users.find().pretty()`

```
  {
    "title": "Hello World",
    "postedBy": {
      "_id": "5bda95442983d541a9a2ea7e",
      "name": "Rohan"
    },
    "comments": [
      {
        "text": "Nice post!",
        "postedBy": {
          "_id": "5bda95442983d541a9a2ea7f",
          "name": "Paul"
        }
      },
      {
        "text": "Thanks mate",
        "postedBy": {
          "_id": "5bda95442983d541a9a2ea7e",
          "name": "Rohan"
        }
      }
    ]
  }
```

#### E> And I will get back the following inside Postman's response panel, which is the result of the line `res.status(200).send(newPosts)` from the router.post and is the complete post document that was saved. And will match if I run `db.posts.find().pretty()`

```js
{
    "_id": "5bda993d3bbec6452132e991",
    "title": "Hello World",
    "postedBy": "5bda99023bbec6452132e98f",
    "comments": [
        {
            "_id": "5bda993d3bbec6452132e993",
            "text": "Nice post!",
            "postedBy": "5bda99023bbec6452132e990"
        },
        {
            "_id": "5bda993d3bbec6452132e992",
            "text": "Thanks mate",
            "postedBy": "5bda99023bbec6452132e98f"
        }
    ],
    "__v": 0
}
```
