import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "../src/routes/auth.routes.js";
import authRoutes from "../src/routes/problem.routes.js";
import submissionRoutes from "./routes/submission.route.js";

const app = express();
const PORT = 3000;
// const PORT = process.env.PORT || 3000; so when i used 8000 from .env file so that time does not work so so check this and find the problem where is the problem

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello guys welcomes Leetcode clone 🔥");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", exectionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
