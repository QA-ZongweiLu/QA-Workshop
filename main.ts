import { program } from 'commander'
import { config } from 'dotenv'
import { runTestGenerator } from './src/cli-interfaces/generate-test'
import { runTestExecutor } from './src/cli-interfaces/execute-test'

config()

program
  .option('--generate-test', 'Go to the test case generator', false)
  .option('--run-test', 'Go to the test runner', false)

const options = program.parse(process.argv).opts()
const { generateTest, runTest } = options

if (generateTest) {
  runTestGenerator()
} else if (runTest) {
  runTestExecutor()
}
