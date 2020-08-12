const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    user1: {
      type: String,
    },
    id: {
      type: Number,
    },
    occupied: {
      type: Boolean,
    },
    user2: Number,
  },
  { timestamps: true }
);

const roomModel = model("user", roomSchema);
module.exports = roomModel;
