import { extractVariables } from "../helpers/check_variables.helper";

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
