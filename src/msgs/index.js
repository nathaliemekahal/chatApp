const express = require("express");
const msgModel = require("./schema.js");

const router = express.Router();

router.get("/", async (req, res) => {
  let msgs = await msgModel.find();
  res.send(msgs);
});
router.get("/:opponent", async (req, res) => {
  let msgs = await msgModel.find({ opponent: req.params.opponent });
  res.send(msgs);
});
router.post("/", async (req, res) => {
  console.log(req.body);
  let newMsg = new msgModel(req.body);
  await newMsg.save();
  res.send("added msg");
});

module.exports = router;
