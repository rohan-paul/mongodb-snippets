Here the case is as below

1> The requirement of the app is that only users who has an administrative right should be able to Login to the app.


2> So the 2 mongodb models have a reference to each other through an ObjectId

3> And I can implemented this by sending the user.administer (which is an unique id i.e. the ObjectId ) with the token in the Login route.

(The route for the login is not yet implemented in this app, but I am showing below the code which needs to be implemented in the auth route)



```js
router.post("/login", function(req, res) {
  User.findOne(
    {
      username: req.body.username
    },
    function(err, user) {
      if (err) {
        throw err;
      } else if (!user) {
        // console.log("Authentication failed. User not found.");
        // the case when the user does not exists at all in the database
        res.status(404).send({
          success: false,
          msg: "Authentication failed. User not found."
        });
      } else if (user) {
        // user exists but password does not match
        var validPassword = user.comparePassword(req.body.password);

        if (!validPassword) {
          //   console.log("Authentication failed. Wrong Password");
          res.status(401).send({
            success: false,
            msg: "Authentication failed. Wrong Password"
          });
        } else {
          // case when the user exists and password also matches
          // so now create a token
          var token = jwt.sign(
            {
              user: user.toJSON(),
              administer: user.administer
            },
            settings.secret,
            {
              expiresIn: "4h"
            }
          );

          // return the information including token as JSON
          res.json({
            success: true,
            token: "JWT " + token
          });
        }
      }
    }
  );
});

module.exports = router;
```

## If I wanted to check the above mechanism of the auth route in a working Postman POST requst.

A> First create a new user. So insert a new mongodb record for users, by running the below command (the below password is the hashed version of 123)

```js
db.users.insert(
    {
        "username" : "p@gmail.com",
        "password" : "$2a$10$HyXCD5.4U/0CvZHq9SDQ0uxD12BQ46yVAHu18lRRVEQZB3uyHXgy."        
    }
)
```

This will automatically assign an \_id field to the data by mongodb. Assume that to be "5bd983e4a18ceecf4bba3c48"

So now running the `db.users.find().pretty()` command I will see the below.

```
{
	"_id" : ObjectId("5bd983e4a18ceecf4bba3c48"),
	"username" : "p@gmail.com",
	"password" : "$2a$10$HyXCD5.4U/0CvZHq9SDQ0uxD12BQ46yVAHu18lRRVEQZB3uyHXgy.",
	"__v" : 0
}
```

B> Then with that \_id create a dummy-administer as this Adminster credentials should be validated during the sign-in process. Else should throw "Authentication failed. User does not have Administer Authority."

```js
db.administer.insert({
	"name": "test-administer-name",	
	"key_contact": "5bd983e4a18ceecf4bba3c48"
})

```

So now running the `db.administer.find().pretty()` command I will see the below.

```js
{
	"_id" : ObjectId("5bdaadc9ebae106aaa8ca247"),
	"name" : "test-administer-name",	
	"key_contact" : "5bd983e4a18ceecf4bba3c48"
}

```

C> And now I also need to associate this ObjectId of the Administer to the previously creaed user (whose \_id field is - "5bd983e4a18ceecf4bba3c48") - i.e. running command for inserting new attribute to an existing document in MongoDB


Now I want to add another attribute or property to this 'user' document named 'administer' and given this attribute is of `Schema.Types.ObjectId` type in `user` collection, I have to add the corresponding `administer's \_id field to it as its value. So lets say that field is - "5bd983e4a18ceecf4bba3c48"



So the command to add `administer` value is

```
db.users.update({'_id' : ObjectId("5bd983e4a18ceecf4bba3c48")},
                      {'$set' : {'administer' : "5bdaadc9ebae106aaa8ca247" }})
```

So now, both the models (collections) will be linked to each other and running the `db.users.find().pretty()` command I will see the below with the "administer's" id properly populated.

```js
{
	"_id" : ObjectId("5bd983e4a18ceecf4bba3c48"),
	"username" : "p@gmail.com",
	"password" : "$2a$10$HyXCD5.4U/0CvZHq9SDQ0uxD12BQ46yVAHu18lRRVEQZB3uyHXgy.",
	"__v" : 0,
	"administer" : "5bdaadc9ebae106aaa8ca247"
}

```