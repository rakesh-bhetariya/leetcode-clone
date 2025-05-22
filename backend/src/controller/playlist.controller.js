import { db } from "../libs/db";

export const getAllListDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlist = await db.playlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    // if we did not get the playlist then send an another resposne
    if (!playlist) {
      res.status(400).json({
        success: true,
        message: "No Playlist create by this user",
      });
    } else {
      res.status(200).json({
        success: true,
        data: playlist,
      });
    }
  } catch (error) {
    // handle this catch error
  }
};

export const getPlayListDetails = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: userId,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      res.status(400).json({
        success: true,
        message: "Playlist Not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: playlist,
      });
    }
  } catch (error) {
    // handle this catch error
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playlist = await db.playlist.create({
      name,
      description,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Playlistcreate successfully",
    });
  } catch (error) {
    // handle this catch error
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const problemId = req.body;

    if (!Array.isArray(problemId) || problemId.length === 0) {
      // handle this error
    }

    const problemsInPlayist = await db.problemInPlayist.createMany({
      data: problemId.map((problemId) => {
        playlistId, problemId;
      }),
    });

    res.status(200).json({
      success: true,
      message: "problemsInPlayist created successfully",
    });
  } catch (error) {
    // handle this catch error
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const userId = req.user.id;
    const playlist = await db.playlist.Delete({
      where: {
        id: playlistId,
        userId: userId,
      },
    });

    if (!playlist) {
      res.status(400).json({
        success: true,
        message: "Playlist Not Deleted",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Playlist Deleted Sucessfully",
      });
    }
  } catch (error) {
    // handle this catch error
  }
};

// export const = async () => {

// }
