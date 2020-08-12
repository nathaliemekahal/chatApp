const { Schema, model } = require("mongoose");

const msgSchema = new Schema(
  {
    to: {
      type: String,
    },
    from: {
      type: String,
    },
    text: String,
  },
  { timestamps: true }
);

const msgModel = model("msg", msgSchema);
module.exports = msgModel;
