This is an exercise to show how mongodb references another model with `mongoose.Schema.Types.ObjectId,`

Just launch the project by doing `npm install` and then `npm start`

It will not show anything significant in the browser or Postman as I am inputting all the necessary data to feed mongodb in the `./routes/users.js` file with `posts.save`. Also there is no `router.post` as I am not saving to mongo after a post request but directly as soon as the server starts and `./routes/users.js`file gets executed.

If I wanted to get the data from Postman I have to have `req.body` within the `router.post`.

So as soon as the server starts these data will be saved to mongodb and the output will be shown in the terminal.

```
mongo
show dbs
use mongo-reference
show collections
db.posts.find().pretty()
```

And it will show the below result

```js
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
