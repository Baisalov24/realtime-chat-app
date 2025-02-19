import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email уже используется" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
