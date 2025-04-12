export function getNoncompliantResults(
  srcElements: string[],
  targetValue: string
): string[] {
  let elements = [];
  srcElements.forEach((element) => {
    if (targetValue.indexOf(element) === -1) {
      elements.push(element);
    }
  });
  return elements;
}

export function extractElements(
  startString: string,
  inputString: string,
  endString: string
): string[] {
  let matches: string[];

  const escapedStartString = startString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEndString = endString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `${escapedStartString}(.*?)${escapedEndString}`,
    "g"
  );

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

export function countQuotes(inputString: string): number {
  const regex = new RegExp('"', "g");
  const matches = inputString.match(regex);
  return matches ? matches.length : 0;
}
