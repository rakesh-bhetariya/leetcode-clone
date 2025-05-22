export const getAllSubmmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    req.status(200).json({
      success: true,
      message: "Submission fetch successfuly",
      submission,
    });
  } catch (error) {
    // write down the error
  }
};

export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    req.status(200).json({
      success: true,
      message: "Submission fetch successfuly",
      submission,
    });
  } catch (error) {}
};

export const getAllTheSubmmissionForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.findMany({
      where: {
        problemId: problemId,
      },
    });

    req.status(200).json({
      success: true,
      message: "Submission fetch successfuly",
      submission,
    });
  } catch (error) {
    // write down the error
  }
};
