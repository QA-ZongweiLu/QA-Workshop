interface AIResponse {
  result: string
  threadId: string
}

interface TestCase {
  name: string
  code: string
}

interface VerifyResult {
  status: string
  message: string
}
