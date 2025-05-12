import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
  // in this i fetch one error is i forgot to import jwt but before this i create the user in db but inactual i got an error is user already exists in last i fetch an error so in this scenario what you do and how you can handle it

  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // CHECK THOSE PARAMETER HOW YOU CAN DEFINE THIS AND THE REASON BEHIND THIS

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "DEVELOPMENT",
      MAXaGE: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.log("Error while registration : ", error);
    res.status(400).json({
      message: "User has not been created successfully",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // change the varialbe name
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "DEVELOPMENT",
      MAXaGE: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      message: "User login successfully",
    });
  } catch (error) {
    console.log("Error while login : ", error);
    res.status(500).json({
      message: "User has not been login successfully",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(204).json({
      message: "User Logged out successfully",
    });
  } catch (error) {
    console.log("Error while logout : ", error);
    res.status(500).json({
      message: "User has not been logout successfully",
    });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User authenticated success",
      usser: req.user,
    });
  } catch (error) {
    console.log("Error while checking : ", error);
    res.status(500).json({
      message: "User has not authenticated successfully",
    });
  }
};
