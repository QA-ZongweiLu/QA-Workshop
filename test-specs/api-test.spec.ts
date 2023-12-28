import { v1 as uuidV1 } from 'uuid'
import {
  AstBuilder,
  GherkinClassicTokenMatcher,
  Parser,
  compile,
} from '@cucumber/gherkin'
import { test } from '@playwright/test'
import { APITestRunner } from './libs/runner'
import { initOpenAI } from './services/openai'

const prefix = process.env.PREFIX || ''
process.env.TEST_SUITE = process.env.TEST_SUITE || '[]'
const builder = new AstBuilder(uuidV1)
const matcher = new GherkinClassicTokenMatcher()
const parser = new Parser(builder, matcher)
const gherkinDocument = parser.parse(process.env.FEATURE_CONTENT || '')
const pickles = compile(gherkinDocument, process.env.FEATURE_FILE || '', uuidV1)
const testSuite: TestCase[] = []

for (const pickle of pickles) {
  const keywordMapping = {
    Context: 'Given',
    Action: 'When',
    Outcome: 'Then',
  }
  const testCase: TestCase = { name: '', code: '' }

  testCase.name = `Scenario: ${pickle.name}\n`
  testCase.code += pickle.steps
    .map((step) => {
      if (step.type in keywordMapping) {
        const keyword = keywordMapping[step.type]
        delete keywordMapping[step.type]
        return `  ${keyword} ${step.text}`
      }
      return `  And ${step.text}`
    })
    .join('\n')

  testSuite.push(testCase)
}

test.beforeAll(async () => {
  initOpenAI(process.env.OPENAI_API_KEY)
})

for (const testCase of testSuite) {
  const testRunner = new APITestRunner(testCase.code, prefix)
  test(testCase.name, async () => {
    await testRunner.run()
  })
}
