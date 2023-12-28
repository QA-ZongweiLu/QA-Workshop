import { expect } from '@playwright/test'
import type { Pickle } from '@cucumber/messages'
import { invokeAssistantAPI, verifyResult } from '../services/openai'
import { waitForTimeout, waitForLoadState } from '../services/playwright'
import { zerostepAI } from '../services/zerostep'

class FailureTestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Failure'
    this.stack = ''
  }
}

export class APITestRunner {
  testCase: string
  prefix: string
  verifyResult: VerifyResult

  constructor(testCase: string, prefix: string = '') {
    this.testCase = testCase
    this.prefix = prefix
  }

  public async run() {
    const question = `${this.prefix}\n\n\`\`\`gherkin\n${this.testCase}\n\`\`\``
    const result = await invokeAssistantAPI(question)
    const answer = await verifyResult(result)
    const parsedAnswer: VerifyResult = JSON.parse(answer)
    try {
      expect(parsedAnswer.status).toBe('success')
    } catch (error) {
      throw new FailureTestError(parsedAnswer.message)
    }
  }
}

export class WebTestRunner {
  testCase: Pickle

  constructor(testCase: Pickle) {
    this.testCase = testCase
  }

  public async runContextSteps() {
    const steps = this.testCase.steps.filter((step) => step.type === 'Context')
    for (const step of steps) {
      console.log(`Action Start - ${step.text}`)
      let verified = false
      let retries = 0

      while (!verified && retries < 5) {
        try {
          await waitForLoadState()
          await zerostepAI(step.text)
          verified = true
        } catch (error) {
          await waitForTimeout(3000)
          retries++
        }
      }

      if (!verified) {
        throw new Error(`Failed to execute ${step.text}`)
      }

      console.log(`Action End - ${step.text}`)
    }
  }

  public async runActionSteps() {
    const steps = this.testCase.steps.filter((step) => step.type === 'Action')
    for (const step of steps) {
      console.log(`Action Start - ${step.text}`)
      let verified = false
      let retries = 0

      while (!verified && retries < 5) {
        try {
          const status = await zerostepAI(
            `Check if the action "${step.text}" is available?`,
            { type: 'assert' }
          )
          console.log(
            `Check if the action "${step.text}" is available? => ${status}`
          )
          await waitForLoadState()
          if (status) {
            await zerostepAI(step.text)
            verified = true
          } else {
            console.log(`Retry ${retries}`)
            await waitForTimeout(3000)
            retries++
          }
        } catch (error) {
          await waitForTimeout(3000)
          retries++
        }
      }

      if (!verified) {
        throw new Error(`Failed to execute ${step.text}`)
      }

      console.log(`Action End - ${step.text}`)
    }
  }

  public async runOutcomeSteps() {
    const steps = this.testCase.steps.filter((step) => step.type === 'Outcome')
    for (const step of steps) {
      console.log(`Assertion: ${step.text}`)
      let verified = false
      let retries = 0
      const errorMessage = ''

      while (!verified && retries < 5) {
        const result = await zerostepAI(step.text)
        if (result) {
          verified = true
        } else {
          await waitForTimeout(3000)
          retries++
        }
      }

      if (!verified) {
        throw new Error(errorMessage)
      }
    }
  }
}
