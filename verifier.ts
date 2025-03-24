import * as fs from "fs";

const srcLng = "EN";
const targetLng = "PL";

let errors: string[] = [];

checkDifferences(srcLng, targetLng);

function checkDifferences(srcLng: string, targetLng: string) {
  const srcJsonString: string = fs.readFileSync(`./${srcLng}.json`, "utf-8");
  const targetJsonString: string = fs.readFileSync(
    `./${targetLng}.json`,
    "utf-8"
  );
  try {
    const srcJsonData = JSON.parse(srcJsonString);
    const targetJsonData = JSON.parse(targetJsonString);
    compareKeys(srcLng, srcJsonData, targetLng, targetJsonData, "");
    compareKeys(targetLng, targetJsonData, srcLng, srcJsonData, "");
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("One of JSON files is probably corrupted");
    } else {
      console.log("Unknown error occurred");
    }
    let errorTyped = error as Error;
    console.log(errorTyped.message);
  }
}

function compareKeys(
  srcLng: string,
  srcData: Object,
  targetLng: string,
  targetData: Object,
  root: string
) {
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
            compareKeys(srcLng, srcValue, targetLng, targetValue, root);
          } else {
            errors.push(
              `❌ Key ${root}.${srcKey} is object in ${srcLng.toUpperCase} but not in ${targetLng.toUpperCase}`
            );
          }
        }
      }
    }
    if (comparator === false) {
      errors.push(
        `❌ Key ${root}.${srcKey} not found in ${targetLng.toUpperCase}`
      );
    }
    comparator = false;
    if (counter === srcCount) {
      root = root.substring(0, root.lastIndexOf("."));
    }
  }
}

if (errors.length === 1) {
  console.log(`There is ${errors.length} error in JSON files`);
} else if (errors.length > 1) {
  console.log(`There are ${errors.length} errors in JSON files`);
} else {
  console.log("No errors found");
}

errors.sort().forEach((error) => {
  console.log(error);
});
