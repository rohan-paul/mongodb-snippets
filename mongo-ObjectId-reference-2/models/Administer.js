const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./User')
  

let administerSchema = new Schema(
  {
    name: { type: String, required: true },   
    key_contact: { type: Schema.Types.ObjectId, ref: "User" }    
  },
  {
    // createdAt,updatedAt fields are automatically added into records
    timestamps: true
  }
);


module.exports = mongoose.model("Administer", administerSchema);