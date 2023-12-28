import type { AiFixture } from '@zerostep/playwright'

export let zerostepAI: AiFixture['ai']

export const initZeroStep = (aiFunc: AiFixture['ai']) => {
  zerostepAI = aiFunc
}
