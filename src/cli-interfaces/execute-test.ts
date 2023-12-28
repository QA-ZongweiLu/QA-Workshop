import editor from '@inquirer/editor'
import select from '@inquirer/select'

import { getFeatureFiles, readFeatureFile } from '../libs/fs-tools'
import { runTestAsync } from '../libs/test-run-tools'
import { initOpenAI, classifyTest } from '../services/openai'

export const runTestExecutor = async () => {
  initOpenAI(process.env.OPENAI_API_KEY)

  const lineLength = process.stdout.columns
  const separatorLine = '-'.repeat(lineLength)
  const featureFiles = getFeatureFiles('./features')
  let prefix = ''

  const featureFile = await select({
    message:
      'Hi, I can help you run a test feature with AI, please tell me which feature file to run.',
    choices: featureFiles.map((file) => ({ name: file, value: file })),
  })

  const isPrefix = await select({
    message: 'Do you want to add a prefix to the test case?',
    choices: [
      {
        name: 'Yes, add a prefix',
        value: true,
      },
      {
        name: 'No, run the test case directly',
        value: false,
      },
    ],
  })

  if (isPrefix) {
    prefix = await editor({
      message: 'Please tell me the prefix',
      waitForUseInput: false,
    })
  }

  const featureContent = readFeatureFile('./features', featureFile)

  console.log('Start running the test suite...')
  const type = await classifyTest(featureContent)
  console.log(separatorLine)
  await runTestAsync(type, {
    ...process.env,
    FEATURE_CONTENT: featureContent,
    FEATURE_FILE: featureFile,
    PREFIX: prefix,
  })
  console.log(separatorLine)
}
