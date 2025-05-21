import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const exectionRoute = express.Router();

exectionRoute.post("/", authMiddleware, executeCode);

export default exectionRoute;
