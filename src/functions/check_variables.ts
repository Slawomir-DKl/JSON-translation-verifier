export function checkVariables( // może podajmy tylko srcValue i targetValue, on mi zwraca errory w [] i dodaję te errory do tamtych - uprościć parametry funkcji
    // dodaj tutaj root
  srcKey: string,
  srcLng: string,
  srcValue: string,
  targetValue: string,
  errors: string[]
): void {
  const srcVariables = extractVariables(srcValue);
  srcVariables.forEach((variable) => {
    if (targetValue.indexOf(variable) === -1) {
      errors.push(
        `❓ Variable alert: key ${srcKey} in ${srcLng} language contains variable ${variable} which is not present in the other language`
      );
    }
  });
}

function extractVariables(inputString: string): string[] {
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
