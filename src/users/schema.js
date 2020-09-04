const { Schema, model } = require("mongoose");
const msgModel = require("../msgs/schema");
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
    // messages: [{ msgModel }],
  },
  { timestamps: true }
);

const userModel = model("users", userSchema);
module.exports = userModel;
