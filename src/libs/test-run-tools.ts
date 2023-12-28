import type { SpawnOptions } from 'child_process'
import { spawn } from 'child_process'

export const runTestAsync = (
  testType: 'api' | 'web',
  env: NodeJS.ProcessEnv
) => {
  return spawnPromise(
    './node_modules/playwright/cli.js',
    [
      'test',
      `./test-specs/${testType}-test.spec.ts`,
      `--project=${testType}`,
      '--headed',
    ],
    { env }
  )
}

const spawnPromise = (
  command: string,
  args: string[],
  options: SpawnOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options)
    let output = ''

    child.stdout.on('data', (data) => {
      output += data
      console.log(data.toString())
    })
    child.stderr.on('data', (data) => {
      output += data
      console.error(data.toString())
    })
    child.on('close', () => {
      resolve(output)
    })
    child.on('error', (error) => reject(error))
  })
}
