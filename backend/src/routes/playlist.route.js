import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails } from "../controller/playlist.controller";

const playlistRoute = express.Router();

playlistRoute.get("/", authMiddleware, getAllListDetails);
playlistRoute.get("/:playlistId", authMiddleware, getPlayListDetails);
playlistRoute.post("/create-playlist", authMiddleware, createPlaylist);
playlistRoute.post(
  "/:playlistId/add-problem",
  authMiddleware,
  addProblemToPlaylist
);
playlistRoute.delete("/:playlistId", authMiddleware, deletePlaylist);

// remove problem from the playlist so write for this and also an endpoint

export default playlistRoute;
