import * as fs from "fs";

interface ComparePayload {
  srcLng: string;
  srcData: Object;
  targetLng: string;
  targetData: Object;
  root: string;
}

let errors: string[] = [];
let srcJsonData: any;
let targetJsonData: any;

// CONFIGURATION
const folder = "files_to_check";
const srcLng = "EN";
const targetLng = "PL";
const lengthPercentDifference = 0.5;
const maxErrorCount = 50;

checkDifferences(srcLng, targetLng);
printResults();

function checkDifferences(srcLng: string, targetLng: string): void {
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

  compareKeys(comparePayload);
  compareKeys(revertPayload(comparePayload));

  const srcLines = srcJsonString.split("\n");
  const targetLines = targetJsonString.split("\n");
  checkOrder(srcLines, targetLines);
}

function revertPayload(internalPayload: ComparePayload): ComparePayload {
  return {
    srcLng: internalPayload.targetLng,
    srcData: internalPayload.targetData,
    targetLng: internalPayload.srcLng,
    targetData: internalPayload.srcData,
    root: internalPayload.root,
  };
}

function compareKeys(internalPayload: ComparePayload): string[] {
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
          compareKeys(subKeyPayload);
        } else {
          errors.push(
            `❌ Object alert: key ${
              internalPayload.root
            }.${srcKey} is object in ${internalPayload.srcLng.toUpperCase()} but not in ${internalPayload.targetLng.toUpperCase()}`
          );
        }
      }
      if (
        typeof srcValue === "string" &&
        typeof targetValue === "string" &&
        srcValue.length < targetValue.length * lengthPercentDifference
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

function checkOrder(srcLines: string[], targetLines: string[]): string[] {
  for (let lineCnt = 0; lineCnt < srcLines.length; lineCnt++) {
    const srcLine: string = srcLines[lineCnt];
    if (srcLine.indexOf('"') > -1) {
      const targetLine: string = targetLines[lineCnt];
      const srcKey: string = srcLine.trim().split('"')[1];
      const targetKey: string = targetLine.trim().split('"')[1];
      if (srcKey != targetKey) {
        const maxLineCntLength: number = Math.floor(
          Math.log10(srcLines.length) + 1
        );
        const lineNumber: string = (lineCnt + 1)
          .toString()
          .padStart(maxLineCntLength, "0");
        errors.push(
          `⭕ Order alert: keys in line ${lineNumber} - source: ${srcKey}, target: ${targetKey}`
        );
      }
    }
  }
  return errors;
}

function printResults() {
  if (errors.length === 1) {
    console.log(`There is ${errors.length} error in JSON files`);
  } else if (errors.length > maxErrorCount) {
    console.log(
      `There is more than ${maxErrorCount} errors in JSON files. Correct them and run the program again.`
    );
  } else if (errors.length > 1) {
    console.log(`There are ${errors.length} errors in JSON files`);
  } else {
    console.log("No errors found");
  }

  errors.sort();
  const maxErrors =
    errors.length > maxErrorCount ? maxErrorCount : errors.length;

  for (let index = 0; index < maxErrors; index++) {
    console.log(errors[index]);
  }
}
