import express from "express";
import { createproblem } from "../controller/auth.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware, isAdmin, createproblem);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblem);

problemRoutes.get("get-problem/:id", authMiddleware, getProblemById);

problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  isAdmin,
  updateProblemById
);

problemRoutes.delete(
  "delete-problem/:id",
  authMiddleware,
  isAdmin,
  deleteProblemById
);

problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemSolvedByUser
);

export default problemRoutes;
