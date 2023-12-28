export const apiTestInstructions = `As a test engineer:
1. You will be given a api test case in Gherkin format, you need to execute the test case and verify if it meets the outcome requirements.
2. After sending the request, you will receive a response, you need to find the HTTP request that was just sent from the context.
3. After finishing the verification, "status" and "message" should be in the output.
  - If the test is passed: Output "status": "success" and a success message to shortly explain why it passed.
  - If the test is failed: Output "status": "failure" and a failure message to explain why it failed as detailed as possible.`

export const webTestInstructions = `You are a test engineer, and I will provide you with a step for web automation testing. You need to determine which tool to use to execute this step.`
