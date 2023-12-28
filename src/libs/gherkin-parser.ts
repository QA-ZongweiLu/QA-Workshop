export const parseGherkin = (content: string) => {
  const gherkinCodeRegex = /^```gherkin[\s\S]*?^```/gm
  const gherkinCodeMatch = content.match(gherkinCodeRegex)

  let output = ''
  if (gherkinCodeMatch && gherkinCodeMatch.length > 0) {
    output = gherkinCodeMatch[0].replace(/^```gherkin\n|\n```$/gm, '')
  }
  return output
}
