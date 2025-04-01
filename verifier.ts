import * as fs from "fs";

const srcLng = "EN";
const targetLng = "PL";

let errors: string[] = [];

checkDifferences(srcLng, targetLng);

if (errors.length === 1) {
  console.log(`There is ${errors.length} error in JSON files`);
} else if (errors.length > 50) {
  console.log(
    `There is more than 50 errors in JSON files. Correct them and run the program again.`
  );
} else if (errors.length > 1) {
  console.log(`There are ${errors.length} errors in JSON files`);
} else {
  console.log("No errors found");
}

errors.sort().forEach((error) => {
  console.log(error);
});

function checkDifferences(srcLng: string, targetLng: string): void {
  const srcJsonString: string = fs.readFileSync(`./${srcLng}.json`, "utf-8");
  const targetJsonString: string = fs.readFileSync(
    `./${targetLng}.json`,
    "utf-8"
  );
  try {
    const srcJsonData = JSON.parse(srcJsonString);
    const targetJsonData = JSON.parse(targetJsonString);
    errors = compareKeys(srcLng, srcJsonData, targetLng, targetJsonData, "");
    errors = compareKeys(targetLng, targetJsonData, srcLng, srcJsonData, "");
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
  errors = checkOrder(srcLines, targetLines);
}

function compareKeys(
  srcLng: string,
  srcData: Object,
  targetLng: string,
  targetData: Object,
  root: string
): string[] {
  let comparator = false;
  let srcValue: any;
  let targetValue: any;
  let counter = 0;
  const srcCount = Object.keys(srcData).length;

  for (const srcKey in srcData) {
    counter++;
    for (const targetKey in targetData) {
      if (srcKey === targetKey) {
        comparator = true;
        srcValue = srcData[srcKey];
        targetValue = targetData[targetKey];
        if (typeof srcValue === "object" && srcValue !== null) {
          if (typeof targetValue === "object" && targetValue !== null) {
            root = root === "" ? srcKey : `${root}.${srcKey}`;
            errors = compareKeys(
              srcLng,
              srcValue,
              targetLng,
              targetValue,
              root
            );
          } else {
            errors.push(
              `❌ Object alert: key ${root}.${srcKey} is object in ${srcLng.toUpperCase()} but not in ${targetLng.toUpperCase()}`
            );
          }
        }
      }
      if (errors.length > 50) {
        return errors;
      }
    }
    if (comparator === false) {
      errors.push(
        `❗ Key alert: key ${root}.${srcKey} not found in ${targetLng.toUpperCase()}`
      );
    }
    comparator = false;
    if (counter === srcCount) {
      root = root.substring(0, root.lastIndexOf("."));
    }
    if (errors.length > 50) {
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
        if (errors.length > 50) {
          return errors;
        }
      }
    }
  }
  return errors;
}
