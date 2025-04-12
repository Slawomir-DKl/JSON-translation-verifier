import { countQuotes, extractVariables } from "../helpers/check_values.helper";

export function getIncorrectVariables(
  srcValue: string,
  targetValue: string
): string[] {
  let variables = [];
  const srcVariables = extractVariables(srcValue);
  srcVariables.forEach((variable) => {
    if (targetValue.indexOf(variable) === -1) {
      variables.push(variable);
    }
  });
  return variables;
}

export function areEscapeCharsCorrect(
  srcValue: string,
  targetValue: string
): boolean {
  return countQuotes(srcValue) === countQuotes(targetValue) ? true : false;
}

export function isTranslated(srcValue: string, targetValue: string): boolean {
  return srcValue === targetValue ? false : true;
}
