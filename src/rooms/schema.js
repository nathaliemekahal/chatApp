const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    busy: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const roomModel = model("user", roomSchema);
module.exports = roomModel;
