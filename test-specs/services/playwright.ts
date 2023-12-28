import { type Page } from '@playwright/test'

let page: Page

export const initPage = (p: Page) => {
  page = p
}

export const waitForLoadState = async (
  state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'
) => {
  await page.waitForLoadState(state)
}

export const waitForTimeout = async (timeout: number) => {
  await page.waitForTimeout(timeout)
}
