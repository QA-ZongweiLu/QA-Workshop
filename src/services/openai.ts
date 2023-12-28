import { OpenAI } from 'openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant'
import type { ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import type { MessageContentText } from 'openai/resources/beta/threads/messages/messages'

import {
  classifyTestPrompt,
  generateApiTestInstructions,
  generateWebTestInstructions,
  generateTestNamePrompt,
} from './prompts/generate-test-prompts'

let openAI: OpenAI
let chatOpenAI: ChatOpenAI

export const initOpenAI = (apiKey: string) => {
  openAI = new OpenAI({ apiKey })
  chatOpenAI = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: process.env.OPENAI_MODEL_NAME,
  })
}

export const classifyTest = async (
  question: string
): Promise<'api' | 'web'> => {
  const jsonMode = chatOpenAI.bind({
    response_format: {
      type: 'json_object',
    },
  })
  const { content } = await classifyTestPrompt
    .pipe(jsonMode)
    .invoke({ question })
  const result = JSON.parse(content.toString())

  return result.testType
}

export const generateTest = async (
  question: string,
  threadId?: string
): Promise<AIResponse> => {
  const testType = await classifyTest(question)
  const instructions =
    testType === 'api'
      ? generateApiTestInstructions
      : generateWebTestInstructions

  const assistant = await OpenAIAssistantRunnable.createAssistant({
    client: openAI,
    instructions,
    model: process.env.OPENAI_MODEL_NAME,
  })
  const invokeOptions = threadId
    ? { content: question, threadId }
    : { content: question }
  const assistantResponse = (await assistant.invoke(
    invokeOptions
  )) as ThreadMessage[]

  const response = assistantResponse[0]
  const { content, thread_id } = response
  const answer = (content[0] as MessageContentText).text.value

  return { result: answer, threadId: thread_id }
}

export const generateTestName = async (testSuite: string): Promise<string> => {
  const { content: testName } = await generateTestNamePrompt
    .pipe(chatOpenAI)
    .invoke({ testSuite })

  return testName.toString()
}
