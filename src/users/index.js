const express = require("express");
const userModel = require("./schema.js");
const bcrypt = require("bcrypt")

const router = express.Router();

router.get("/", async (req, res) => {
  let users = await userModel.find();
  res.send(users);
});
router.post("/register", async (req, res) => {
  const username = req.body.username;
  const profile = await userModel.findOne({
    username: username
  });
  const plainPassword = req.body.password;
  req.body.password = await bcrypt.hash(plainPassword, 8);
  console.log(req.body)
  if (profile) {
    res.status(400).send("username exists");
  }else{
    const newProfile = new userModel(req.body);
    await newProfile.save();
    res.send("ok");
  }
});
router.post("/login", async (req, res) => {
  const profile = await userModel.findOne({
   username: req.body.username 
  });
  if (profile) {
    const isAuthorized = await bcrypt.compare(
      req.body.password,
      profile.password
    );
    if (isAuthorized) {
      const secretkey = process.env.SECRET_KEY;
      const payload = { id: profile._id };
      const token = await jwt.sign(payload, secretkey, { expiresIn: "1 week" });

      res.cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
      });
      res.send("ok");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } else {
    res.status(401).send("Invalid credentials");
  }
});
router.delete("/:id", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.send("deleted");
});

module.exports = router;
