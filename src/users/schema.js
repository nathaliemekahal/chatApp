const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const userModel = model("chatusers", userSchema);
module.exports = userModel;
