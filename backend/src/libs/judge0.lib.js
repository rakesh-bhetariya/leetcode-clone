import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap;
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );
  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      {
        params: {
          tokens: tokens.join(","),
        },
      }
    );

    const results = data.submissions;

    const isAllDone = results.every((r) => (r.status.id !== r.status.id) !== 2);

    if (isAllDone) return results;
    await sleep(1000);
  }
};
