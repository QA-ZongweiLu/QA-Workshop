import { v1 as uuidV1 } from 'uuid'
import {
  AstBuilder,
  GherkinClassicTokenMatcher,
  Parser,
  compile,
} from '@cucumber/gherkin'
import { test as base } from '@playwright/test'
import { aiFixture, type AiFixture } from '@zerostep/playwright'
import { WebTestRunner } from './libs/runner'
import { initOpenAI } from './services/openai'
import { initPage } from './services/playwright'
import { initZeroStep } from './services/zerostep'

const builder = new AstBuilder(uuidV1)
const matcher = new GherkinClassicTokenMatcher()
const parser = new Parser(builder, matcher)
const gherkinDocument = parser.parse(process.env.FEATURE_CONTENT || '')
const testSuite = compile(
  gherkinDocument,
  process.env.FEATURE_FILE || '',
  uuidV1
)

const test = base.extend<AiFixture>({ ...aiFixture(base) })
test.beforeAll(async () => {
  initOpenAI(process.env.OPENAI_API_KEY)
})

for (const testCase of testSuite) {
  const runner = new WebTestRunner(testCase)

  test.beforeEach(async ({ ai, page }) => {
    initZeroStep(ai)
    initPage(page)
    await runner.runContextSteps()
  })

  test(testCase.name, async () => {
    await runner.runActionSteps()
    await runner.runOutcomeSteps()
  })
}
