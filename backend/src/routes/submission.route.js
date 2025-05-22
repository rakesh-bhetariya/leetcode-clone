import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getAllSubmmission,
  getAllTheSubmmissionForProblem,
  getSubmissionForProblem,
} from "../controller/submission.controller.js";

const submissionRoutes = express.Router.Router();

submissionRoutes.get("/get-all-submission", authMiddleware, getAllSubmmission);
submissionRoutes.get(
  "/get-submission/:problem",
  authMiddleware,
  getSubmissionForProblem
);
submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getAllTheSubmmissionForProblem
);

export default submissionRoutes;
