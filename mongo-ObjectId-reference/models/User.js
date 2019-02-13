const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autopopulate = require("mongoose-autopopulate");

var UserSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model("User", UserSchema);

/* I can use `db.users.insert` to add a new document (i.e. record ) into this users collection run the below in terminal like below

db.users.insert(
    {
        "username" : "test-user-2"
    }
)

*/