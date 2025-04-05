import * as fs from "fs";

interface ComparePayload {
  srcLng: string;
  srcData: Object;
  targetLng: string;
  targetData: Object;
  root: string;
}

const srcLng = "EN";
const targetLng = "PL";
const lengthPercentDifference = 70;
const maxErrorCount = 100;

let errors: string[] = [];

checkDifferences(srcLng, targetLng);
printResults();

function checkDifferences(srcLng: string, targetLng: string): void {
  let comparePayload: ComparePayload;
  const srcJsonString: string = fs.readFileSync(`./${srcLng}.json`, "utf-8");
  const targetJsonString: string = fs.readFileSync(
    `./${targetLng}.json`,
    "utf-8"
  );
  try {
    const srcJsonData = JSON.parse(srcJsonString);
    const targetJsonData = JSON.parse(targetJsonString);
    comparePayload = {
      srcLng: srcLng,
      srcData: srcJsonData,
      targetLng: targetLng,
      targetData: targetJsonData,
      root: "",
    };

    compareKeys(comparePayload);
    comparePayload = revertPayload(comparePayload);
    compareKeys(comparePayload);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("One of JSON files is probably corrupted");
    } else {
      console.log("Unknown error occurred");
    }
    let errorTyped = error as Error;
    console.log(errorTyped.message);
  }

  const srcLines = srcJsonString.split("\n");
  const targetLines = targetJsonString.split("\n");
  checkOrder(srcLines, targetLines);
}

function revertPayload(comparePayload: ComparePayload): ComparePayload {
  const newTargetLng = comparePayload.srcLng;
  const newTargetData = comparePayload.srcData;
  comparePayload.srcLng = comparePayload.targetLng;
  comparePayload.srcData = comparePayload.targetData;
  comparePayload.targetLng = newTargetLng;
  comparePayload.targetData = newTargetData;
  return comparePayload;
}

function compareKeys(comparePayload: ComparePayload): string[] {
  let comparator = false;
  let srcValue: any;
  let targetValue: any;
  let counter = 0;
  let targetFound = false;
  const srcCount = Object.keys(comparePayload.srcData).length;

  for (const srcKey in comparePayload.srcData) {
    counter++;
    for (const targetKey in comparePayload.targetData) {
      if (!targetFound) {
        if (srcKey === targetKey) {
          targetFound = true;
          comparator = true;
          srcValue = comparePayload.srcData[srcKey];
          targetValue = comparePayload.targetData[targetKey];
          if (typeof srcValue === "object" && srcValue !== null) {
            if (typeof targetValue === "object" && targetValue !== null) {
              comparePayload.root =
                comparePayload.root === ""
                  ? srcKey
                  : `${comparePayload.root}.${srcKey}`;
              const subComparePayload: ComparePayload = {
                srcLng: srcLng,
                srcData: srcValue,
                targetLng: targetLng,
                targetData: targetValue,
                root: comparePayload.root,
              };
              compareKeys(subComparePayload); // ja tu kurcze czyszczę errory
            } else {
              errors.push(
                `❌ Object alert: key ${
                  comparePayload.root
                }.${srcKey} is object in ${srcLng.toUpperCase()} but not in ${targetLng.toUpperCase()}`
              );
            }
          } else if (
            typeof srcValue === "string" &&
            typeof targetValue === "string" &&
            srcValue.length <
              (targetValue.length * lengthPercentDifference) / 100
          ) {
            errors.push(
              `📏 Length alert: value of key ${
                comparePayload.root
              }.${srcKey} is much shorter in ${srcLng.toUpperCase()} than in ${targetLng.toUpperCase()}`
            );
          }
        }
        if (errors.length > maxErrorCount) {
          return errors;
        }
        break;
      }
    }
    targetFound = false;
    if (comparator === false) {
      errors.push(
        `❗ Key alert: key ${
          comparePayload.root
        }.${srcKey} not found in ${targetLng.toUpperCase()}`
      );
    }
    comparator = false;
    if (counter === srcCount) {
      comparePayload.root = comparePayload.root.substring(
        0,
        comparePayload.root.lastIndexOf(".")
      );
    }
    if (errors.length > maxErrorCount) {
      return errors;
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
        if (errors.length > maxErrorCount) {
          return errors;
        }
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
