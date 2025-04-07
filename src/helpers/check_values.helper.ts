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

export function countBackslashes(inputString: string): number {
  const regex = new RegExp("\\\\", "g");
  const matches = inputString.match(regex);
  return matches ? matches.length : 0;
}
