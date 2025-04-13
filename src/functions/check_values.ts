import {
  countChars,
  extractElements,
  getNoncompliantResults,
} from "../helpers/check_values.helper";

export function areEscapeCharsCorrect(
  srcValue: string,
  targetValue: string
): boolean {
  return countChars('"', srcValue) === countChars('"', targetValue)
    ? true
    : false;
}

export function getIncorrectVariables(
  srcValue: string,
  targetValue: string
): string[] {
  const srcVariables = extractElements("{{", srcValue, "}}");
  return getNoncompliantResults(srcVariables, targetValue);
}

export function getTranslatedPlaceholders(
  srcValue: string,
  targetValue: string
): string[] {
  const srcPlaceholders = extractElements("[", srcValue, "]");
  return getNoncompliantResults(srcPlaceholders, targetValue);
}

export function isValueTranslated(
  srcValue: string,
  targetValue: string
): boolean {
  return srcValue === targetValue ? false : true;
}

export function areGtLtCorrect(srcValue: string, targetValue: string): boolean {
  return countChars("<", srcValue) === countChars("<", targetValue) &&
    countChars(">", srcValue) === countChars(">", targetValue)
    ? true
    : false;
}
