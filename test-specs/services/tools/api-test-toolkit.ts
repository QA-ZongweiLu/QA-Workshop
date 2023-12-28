import axios from 'axios'
import { DynamicStructuredTool } from 'langchain/tools'
import { z } from 'zod'

export const requestGetTool = new DynamicStructuredTool({
  name: 'RequestGetTool',
  description: `當你需要發送一個GET請求到特定的URL時，你可以使用這個工具。`,

  schema: z.object({
    url: z.string().describe('請求的URL'),
    headers: z
      .string()
      .describe(
        '測試案例中，發送請求時提到的headers，以JSON格式傳入，預設為空。'
      ),
    params: z
      .string()
      .describe(
        '測試案例中，發送請求時提到的params，以JSON格式傳入，預設為空。'
      ),
  }),

  func: async ({ url, headers, params }) => {
    console.log(`url: ${url}`)
    console.log(`params: ${params}`)
    console.log(`headers: ${headers}`)

    let paramsObj = {}
    let headersObj = {}

    try {
      headersObj = JSON.parse(headers)
    } catch (error) {
      headersObj = {}
    }

    try {
      paramsObj = JSON.parse(params)
    } catch (error) {
      paramsObj = {}
    }

    try {
      const response = await axios.request({
        url,
        method: 'GET',
        params: paramsObj,
        headers: headersObj,
      })
      const result = JSON.stringify({
        statusCode: response.status,
        body: response.data,
      })
      console.log(`success: sent GET request with ${result}`)
      return `success: sent GET request with ${result}`
    } catch (error) {
      console.log(`failure: ${error.message}`)
      return `failure: ${error.message}`
    }
  },
})

export const requestPostTool = new DynamicStructuredTool({
  name: 'RequestPostTool',
  description: `當你需要發送一個POST請求到特定的URL時，你可以使用這個工具。`,

  schema: z.object({
    url: z.string().describe('請求的URL'),
    headers: z
      .string()
      .describe(
        '測試案例中，發送請求時提到的headers，以JSON格式傳入。預設為空。'
      ),
    body: z
      .string()
      .describe(
        '測試案例中，發送請求時提到的body資料，以JSON格式傳入，預設為空。'
      ),
  }),

  func: async ({ url, headers, body }) => {
    console.log(`url: ${url}`)
    console.log(`body: ${body}`)
    console.log(`headers: ${headers}`)

    let bodyObj = {}
    let headersObj = {}

    try {
      headersObj = JSON.parse(headers)
    } catch (error) {
      headersObj = {}
    }

    try {
      bodyObj = JSON.parse(body)
    } catch (error) {
      bodyObj = {}
    }

    try {
      const response = await axios.request({
        url,
        method: 'POST',
        data: bodyObj,
        headers: headersObj,
      })
      const result = JSON.stringify({
        statusCode: response.status,
        body: response.data,
      })
      console.log(`success: sent POST request with ${result}`)
      return `success: sent POST request with ${result}`
    } catch (error) {
      console.log(`failure: ${error.message}`)
      return `failure: ${error.message}`
    }
  },
})
