import { AgentExecutor } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant'
import { OpenAI } from 'openai'
import { apiTestInstructions } from './prompts/test-run-prompts'
import { verifyResultPrompt } from './prompts/assertion-prompts'
import * as apiTestingToolkit from './tools/api-test-toolkit'

let openAI: OpenAI
let chatOpenAI: ChatOpenAI

export const initOpenAI = (apiKey: string) => {
  openAI = new OpenAI({ apiKey })
  chatOpenAI = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: process.env.OPENAI_MODEL_NAME,
    temperature: 0,
  })
}

export const invokeAssistantAPI = async (question: string) => {
  const tools = Object.values(apiTestingToolkit)
  const agent = await OpenAIAssistantRunnable.createAssistant({
    client: openAI,
    model: process.env.OPENAI_MODEL_NAME,
    instructions: apiTestInstructions,
    tools,
    asAgent: true,
  })

  const executor = new AgentExecutor({ agent, tools })
  const { output } = await executor.invoke({ content: question })

  return output
}

export const verifyResult = async (result: string): Promise<string> => {
  const jsonMode = chatOpenAI.bind({
    response_format: { type: 'json_object' },
  })

  const { content } = await verifyResultPrompt.pipe(jsonMode).invoke({ result })

  return content.toString()
}
