export const executeCode = async () => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // prepre each test cases for judge0 batch submission
    const submission = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      // based64_encoded: false,
      // wait: false,
    }));

    // send batch of submission to judge0
    const submitResponse = await submitBatch(submission);

    const tokens = submitResponse.map((res) => res.token);

    const results = await pollBatchResuts(tokens);
    // poll judge0 for results of all submitted test cases
    console.log("Resutl ----", results);

    res.status(200).json({ message: "Code executed" });
  } catch (error) {}
};
