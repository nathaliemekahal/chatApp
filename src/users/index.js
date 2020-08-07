const express = require("express");
const userModel = require("./schema.js");

const router = express.Router();

router.get("/", async (req, res) => {
  let users = await userModel.find();
  res.send(users);
});
router.post("/", async (req, res) => {
  let newUser = new userModel(req.body);
  await newUser.save();
  res.send("added user");
});
router.delete("/:id", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.send("deleted");
});

module.exports = router;
