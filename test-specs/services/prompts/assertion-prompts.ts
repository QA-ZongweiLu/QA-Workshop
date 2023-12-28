import { PromptTemplate } from 'langchain/prompts'

export const verifyResultPrompt = new PromptTemplate({
  template: `json
  You will be given a message of the test result, you need to analyze if the test is passed or failed.
  The output should contains "status" and "message".
  - "status" should be either "success" or "failure".
  - "message" should be a string that explains why the test is passed or failed.

  The test result is:
  {result}

  Output:`
    .trim()
    .replace(/^ +/gm, ''),
  inputVariables: ['result'],
})
