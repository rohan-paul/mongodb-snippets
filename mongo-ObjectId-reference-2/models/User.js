const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Administer = require('./Administer')

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  administer: {
    type: Schema.Types.ObjectId,
    ref: "Administer"
  }
});