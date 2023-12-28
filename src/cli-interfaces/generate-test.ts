import editor from '@inquirer/editor'
import input from '@inquirer/input'
import select from '@inquirer/select'
import { writeFeatureFile } from '../libs/fs-tools'
import { parseGherkin } from '../libs/gherkin-parser'
import { initOpenAI, generateTest, generateTestName } from '../services/openai'

export const runTestGenerator = async () => {
  initOpenAI(process.env.OPENAI_API_KEY)

  const lineLength = process.stdout.columns
  const separatorLine = '-'.repeat(lineLength)
  let aiResponse: AIResponse
  let isFinalAnswer: string
  let testSuite: string
  let question: string

  while (isFinalAnswer !== 'yes') {
    if (!question && !aiResponse) {
      question = await editor({
        message:
          'Hi, I am the test case generator. Please tell me what you want to test.',
      })
      console.log('Got it!')
    } else if (!question && aiResponse) {
      question = await editor({
        message: 'OK! Please tell me what you want to test.',
        default: aiResponse.result,
      })
      console.log('Got it!')
    } else {
      question = await input({
        message: 'Sure! Please tell me how to adjust the test case',
      })
    }
    console.log('Start answering the question...')

    if (!aiResponse) {
      aiResponse = await generateTest(question)
    } else {
      console.log('Adjusting the test case...')
      aiResponse = await generateTest(question, aiResponse.threadId)
    }

    testSuite = parseGherkin(aiResponse.result)

    console.log('The test suite has been generated! Have a look at it:')
    console.log(separatorLine)
    console.log(testSuite)
    console.log(separatorLine)

    isFinalAnswer = await select({
      message: 'Do you want to save the test suite?',
      choices: [
        {
          name: 'Yes, save it',
          value: 'yes',
        },
        {
          name: 'No, I want to adjust the test case.',
          value: 'no',
        },
        {
          name: 'No, I want to create a new test case.',
          value: 'new',
        },
        {
          name: 'No, discard it.',
          value: 'discard',
        },
      ],
    })

    if (isFinalAnswer === 'new') {
      question = undefined
    } else if (isFinalAnswer === 'discard') {
      console.log('Close the test case generator.')
      break
    }
  }

  if (isFinalAnswer === 'yes') {
    console.log('Generating a suitable name for the test suite...')
    const testSuiteName = await generateTestName(testSuite)
    writeFeatureFile(testSuite, './features', testSuiteName)
  }
}
