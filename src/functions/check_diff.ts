import { ComparePayload, Config, JSONArray } from "../interfaces/interfaces";
import * as fs from "fs";
import { checkOrder } from "./check_order";
import { revertPayload } from "../helpers/check_diff.helper";
import {
  areEscapeCharsCorrect,
  getIncorrectVariables,
  getTranslatedPlaceholders,
  isValueTranslated,
} from "./check_values";

export function checkDifferences(config: Config, errors: Set<string>): void {
  let srcJsonData: JSONArray;
  let targetJsonData: JSONArray;
  const srcLng = config.srcLng;
  const targetLng = config.targetLng;
  const folder = config.folder;
  let comparePayload: ComparePayload;
  const srcJsonString: string = fs.readFileSync(
    `./${folder}/${srcLng}${config.version}.json`,
    "utf-8"
  );
  const targetJsonString: string = fs.readFileSync(
    `./${folder}/${targetLng}${config.version}.json`,
    "utf-8"
  );
  try {
    srcJsonData = JSON.parse(srcJsonString);
    targetJsonData = JSON.parse(targetJsonString);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("One of JSON files is probably corrupted");
    } else {
      console.log("Unknown error occurred");
    }
    let errorTyped = error as Error;
    console.log(errorTyped.message);
  }

  comparePayload = {
    srcLng: srcLng,
    srcData: srcJsonData,
    targetLng: targetLng,
    targetData: targetJsonData,
    root: "",
  };

  compareKeys(comparePayload, config, errors);
  compareKeys(revertPayload(comparePayload), config, errors);

  const srcLines = srcJsonString.split("\n");
  const targetLines = targetJsonString.split("\n");
  checkOrder(srcLines, targetLines, errors);
}

function compareKeys(
  internalPayload: ComparePayload,
  config: Config,
  errors: Set<string>
): void {
  let srcValue: JSONArray;
  let targetValue: JSONArray;
  let counter = 0;
  for (const srcKey in internalPayload.srcData) {
    counter++;
    if (srcKey in internalPayload.targetData) {
      srcValue = internalPayload.srcData[srcKey];
      targetValue = internalPayload.targetData[srcKey];
      if (typeof srcValue === "object" && srcValue !== null) {
        if (typeof targetValue === "object" && targetValue !== null) {
          const root =
            internalPayload.root === ""
              ? `${srcKey}.`
              : `${internalPayload.root}.${srcKey}.`;
          const subKeyPayload: ComparePayload = {
            srcLng: internalPayload.srcLng,
            srcData: srcValue,
            targetLng: internalPayload.targetLng,
            targetData: targetValue,
            root: root,
          };
          compareKeys(subKeyPayload, config, errors);
        } else {
          errors.add(
            `2️⃣  Object alert: key ${
              internalPayload.root
            }${srcKey} is object in ${internalPayload.srcLng.toUpperCase()} but not in ${internalPayload.targetLng.toUpperCase()}`
          );
        }
      }

      if (typeof srcValue === "string" && typeof targetValue === "string") {
        const variableErrors: string[] = getIncorrectVariables(
          srcValue,
          targetValue
        );
        variableErrors.forEach((variable) => {
          errors.add(
            `3️⃣  Variable alert: key ${internalPayload.root}${srcKey} in ${internalPayload.srcLng} language contains variable ${variable} which is not present in the other language`
          );
        });
        if (!areEscapeCharsCorrect(srcValue, targetValue)) {
          errors.add(
            `4️⃣  Escape marks are inconsistent for key ${internalPayload.root}${srcKey}`
          );
        }
        if (!isValueTranslated(srcValue, targetValue)) {
          errors.add(
            `4️⃣  Value for key ${internalPayload.root}${srcKey} is not translated`
          );
        }
        const placeholderErrors: string[] = getTranslatedPlaceholders(
          srcValue,
          targetValue
        );
        placeholderErrors.forEach((placeholder) => {
          errors.add(
            `3️⃣  Placeholder alert: key ${internalPayload.root}${srcKey} in ${internalPayload.srcLng} language contains placeholder ${placeholder} which is not present in the other language`
          );
        });
      }

      if (
        srcValue.length <
        targetValue.length * config.lengthPercentDifference
      ) {
        errors.add(
          `6️⃣  Length alert: value of key ${
            internalPayload.root
          }${srcKey} is much shorter in ${internalPayload.srcLng.toUpperCase()} than in ${internalPayload.targetLng.toUpperCase()}`
        );
      }
    } else {
      errors.add(
        `1️⃣  Key alert: key ${
          internalPayload.root
        }${srcKey} not found in ${internalPayload.targetLng.toUpperCase()}`
      );
    }
  }
}
