import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "wrong email or password" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "wrong email or password" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "server error"});
    }
  });

export default router;
