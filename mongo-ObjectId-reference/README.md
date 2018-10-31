This is an exercise to show how mongodb references another model with `mongoose.Schema.Types.ObjectId,`

Just launch the project by doing `npm install` and then `npm start`

It will not show anything significant in the browser or Postman as I am inputting all the necessary data to feed mongodb in the `./routes/users.js` file. So as soon as the server starts these data will be fed to mongodb and the output will be shown in the terminal.

Also to see the full query result which is the full document containing all User references for the Posts run the below

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
	"_id" : ObjectId("5bd9bbe6a97f642b568cba08"),
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
```
