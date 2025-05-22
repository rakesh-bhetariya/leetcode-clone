import { all } from "axios";
import { getLanguageName } from "../libs/judge0.lib";
import db from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib";

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

    // analye test cases result
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.strerr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} S` : undefined,
      };

      console.log(`Testcases #${i + 1}`);
      console.log(`Input for testcase ${stdin[i]}`);
      console.log(`Expected Output for testcase ${expected_output}`);
      console.log(`Actual output ${stdout}`);

      console.log(`Matched : ${passed}`);
    });

    console.log(detailedResults);

    // store submission summary
    const submissions = await db.submission.create({
      data: {
        userId: userId,
        problemId: problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.strerr)
          ? JSON.stringify(detailedResults.some((r) => r.strerr))
          : null,
        compileOutout: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.some((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.some((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.some((r) => r.time))
          : null,
      },
    });

    // if all passed then mark this problem solved for that user
    // what is upsert and this is possible in another db
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // save individual test case results using detailResults
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submissions.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      title: result.title,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissiononWithTestCase = await db.submission.findUnique({
      where: {
        id: submissions.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      sucess: true,
      message: "Code Executed! Sucessfully!",
    });

    res.status(200).json({ message: "Code executed" });
  } catch (error) {
    // write you error
  }
};
