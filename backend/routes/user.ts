import { Router } from "express";
import prisma from "../db/prisma";
const app = Router();
const dotenv = require("dotenv");
dotenv.config();

app.post("/", async (req, res) => {
  try {
    const { uid, name, email } = req.body;
    //  TODO: MAKE EMAIL UNIQUE
    const userExists = await prisma.user.findFirst({
      where: { email: email },
    });
    if (userExists) {
      return res.status(201).json({
        message: "User already exists",
        user: {
          uid: userExists.uid,
          email: userExists.email,
          name: userExists.name,
        },
      });
    }
    const newUser = await prisma.user.create({
      data: { uid: uid, name, email: email },
    });
    return res.status(201).json({
      message: "User created successfully",
      user: { uid: newUser.uid, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
