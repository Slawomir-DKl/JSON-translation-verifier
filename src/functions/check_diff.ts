import { ComparePayload, Config } from "../interfaces/interfaces";
import * as fs from "fs";
import { checkOrder } from "./check_order";
import { revertPayload } from "../helpers/check_diff.helper";
import { getIncorrectVariables } from "./check_variables";

export function checkDifferences(config: Config, errors: string[]): void {
  let srcJsonData: any;
  let targetJsonData: any;
  const srcLng = config.srcLng;
  const targetLng = config.targetLng;
  const folder = config.folder;
  let comparePayload: ComparePayload;
  const srcJsonString: string = fs.readFileSync(
    `./${folder}/${srcLng}.json`,
    "utf-8"
  );
  const targetJsonString: string = fs.readFileSync(
    `./${folder}/${targetLng}.json`,
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
  errors: string[]
): string[] {
  let srcValue: any;
  let targetValue: any;
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
              ? srcKey
              : `${internalPayload.root}.${srcKey}`;
          const subKeyPayload: ComparePayload = {
            srcLng: internalPayload.srcLng,
            srcData: srcValue,
            targetLng: internalPayload.targetLng,
            targetData: targetValue,
            root: root,
          };
          compareKeys(subKeyPayload, config, errors);
        } else {
          errors.push(
            `❌ Object alert: key ${
              internalPayload.root
            }.${srcKey} is object in ${internalPayload.srcLng.toUpperCase()} but not in ${internalPayload.targetLng.toUpperCase()}`
          );
        }
      }

      if (typeof srcValue === "string" && typeof targetValue === "string") {
        const variableErrors: string[] = getIncorrectVariables(
          srcValue,
          targetValue
        );
        variableErrors.forEach((variable) => {
          errors.push(
            `❓ Variable alert: key ${srcKey} in ${internalPayload.srcLng} language contains variable ${variable} which is not present in the other language`
          );
        });
      }

      if (
        srcValue.length <
        targetValue.length * config.lengthPercentDifference
      ) {
        errors.push(
          `📏 Length alert: value of key ${
            internalPayload.root
          }.${srcKey} is much shorter in ${internalPayload.srcLng.toUpperCase()} than in ${internalPayload.targetLng.toUpperCase()}`
        );
      }
    } else {
      errors.push(
        `❗ Key alert: key ${
          internalPayload.root
        }.${srcKey} not found in ${internalPayload.targetLng.toUpperCase()}`
      );
    }
  }
  return errors;
}
