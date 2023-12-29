# 🔍 QA Workshop - 🤖 Automated Test Assistant

This project is a prototype of an automated test assistant. It uses AI to generate test cases from natural language and run them without any step definition. Currently, it supports API and Web UI testing.

## 🔧 Setup

1. Use `npm install` to install all dependencies
2. This project uses openai API to generate test cases and run API tests. Therefore, you need to set `OPENAI_API_KEY` in your environment variables.
```bash
export OPENAI_API_KEY="<your token here>"
```

3. Also, This project requires a GPT model to generate test cases and run API tests. Therefore, you need to set `OPENAI_MODEL_NAME` in your environment variables. Currently, the only two models are supported: `gpt-3.5-turbo-1106` and `gpt-4-1106-preview`.
```bash
export OPENAI_MODEL_NAME="gpt-3.5-turbo-1106"
```

4. For Web UI testing, this project uses Zerostep. Therefore, you need to set `ZEROSTEP_TOKEN` in your environment variables.

```bash
export ZEROSTEP_TOKEN="<your token here>"
```

Learn more about [Zerostep](https://zerostep.com)

## 🚀 Usage

There are two commands you can use:

1. `npm run test:add` - Generate Gherkin format test cases from natural language and save them to `./features` folder.
2. `npm run test:run` - Run Gherkin format test cases without any step definition.

## 📚 References

Github Repositories:

- [OpenAI API for Node.js](https://github.com/openai/openai-node)
- [Zerostep](https://github.com/zerostep-ai/zerostep)
- [LangchainJS](https://github.com/langchain-ai/langchainjs)

## 🎉 Happy Testing! 🎉
