const express = require("express");
const { findOne } = require("../msgs/schema.js");
const userModel = require("./schema.js");

const router = express.Router();

router.get("/", async (req, res) => {
  let users = await userModel.find();
  res.send(users);
});
router.post("/", async (req, res) => {
  let userExists = await userModel.findOne({ username: req.body.username });
  if (userExists) {
    res.status(403).send("User Exists try another username!");
  } else {
    let newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send("added user");
  }
});
// router.put("/:username", async (req, res) => {
//   let updatedUser = await userModel.findOneAndUpdate(
//     { username: req.params.username },
//     {
//       Sid: req.body.Sid,
//     }
//   );
//   res.send(updatedUser);
// });
// router.delete("/:id", async (req, res) => {
//   await userModel.findByIdAndDelete(req.params.id);
//   res.send("deleted");
// });

module.exports = router;
