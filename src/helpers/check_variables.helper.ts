export function extractVariables(inputString: string): string[] {
  const regex = /{{(.*?)}}/g;
  let matches: string[];
  try {
    matches = inputString.match(regex);
  } catch (error) {
    console.log(inputString);
    console.log(error.message);
  }

  if (!matches) {
    return [];
  }

  return matches;
}
