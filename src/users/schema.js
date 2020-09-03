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
    Sid: { type: String },
  },
  { timestamps: true }
);

const userModel = model("users", userSchema);
module.exports = userModel;
