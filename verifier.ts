import * as fs from "fs";

const sourceLanguage = "EN";
const targetLanguage = "PL";

let errors: string[] = [];

checkDifferences(sourceLanguage, targetLanguage);

function checkDifferences(sourceLanguage: string, targetLanguage: string) {
  const enJsonString = fs.readFileSync(`./${sourceLanguage}.json`, "utf-8");
  const plJsonString = fs.readFileSync(`./${targetLanguage}.json`, "utf-8");
  try {
    const enJsonData = JSON.parse(enJsonString);
    const plJsonData = JSON.parse(plJsonString);
    compareKeys(sourceLanguage, enJsonData, targetLanguage, plJsonData, "");
    compareKeys(targetLanguage, plJsonData, sourceLanguage, enJsonData, "");
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
  sourceLanguage: string,
  sourceData: Object,
  targetLanguage: string,
  targetData: Object,
  root: string
) {
  let comparator = false;
  let sourceValue: any;
  let targetValue: any;
  let counter = 0;
  const sourceCount = Object.keys(sourceData).length;

  for (const sourceKey in sourceData) {
    counter++;
    for (const targetKey in targetData) {
      if (sourceKey === targetKey) {
        comparator = true;
        sourceValue = sourceData[sourceKey];
        targetValue = targetData[targetKey];
        if (typeof sourceValue === "object" && sourceValue !== null) {
          if (typeof targetValue === "object" && targetValue !== null) {
            root = root === "" ? sourceKey : `${root}.${sourceKey}`;
            compareKeys(
              sourceLanguage,
              sourceValue,
              targetLanguage,
              targetValue,
              root
            );
          } else {
            errors.push(
              `❌ Key ${root}.${sourceKey} is object in ${sourceLanguage.toUpperCase} but not in ${targetLanguage.toUpperCase}`
            );
          }
        }
      }
    }
    if (comparator === false) {
      errors.push(
        `❌ Key ${root}.${sourceKey} not found in ${targetLanguage.toUpperCase}`
      );
    }
    comparator = false;
    if (counter === sourceCount) {
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
