const express = require("express");
const roomModel = require("./schema.js");

const router = express.Router();

router.get("/", async (req, res) => {
  let rooms = await roomModel.find();
  res.send(rooms);
});
router.post("/", async (req, res) => {
  let newUser = new roomModel(req.body);
  await newUser.save();
  res.send("added user");
});
router.delete("/:id", async (req, res) => {
  await roomModel.findByIdAndDelete(req.params.id);
  res.send("deleted");
});

module.exports = router;
