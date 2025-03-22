import * as fs from "fs";

let errors: string[] = [];

function checkDifferences(sourceFileName: string, targetFileName: string) {
  const enJsonString = fs.readFileSync(`./${sourceFileName}`, "utf-8");
  const plJsonString = fs.readFileSync(`./${targetFileName}`, "utf-8");
  try {
    const enJsonData = JSON.parse(enJsonString);
    const plJsonData = JSON.parse(plJsonString);
    compareKeys("EN", enJsonData, "PL", plJsonData, "");
    compareKeys("PL", plJsonData, "EN", enJsonData, "");
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
              `❌ Key ${root}.${sourceKey} is object in ${sourceLanguage} but not in ${targetLanguage}`
            );
          }
        }
      }
    }
    if (comparator === false) {
      errors.push(`❌ Key ${root}.${sourceKey} not found in ${targetLanguage}`);
    }
    comparator = false;
    if (counter === sourceCount) {
      root = root.substring(0, root.lastIndexOf("."));
    }
  }
}

checkDifferences("en.json", "pl.json");

errors.sort().forEach((error) => {
  console.log(error);
});
// chcę żeby się też zgadzała kolejność
// docelowo zwracamy tylko liczbę faili i wykaz faili
// chcę też sprawdzać, czy nie ma pustych wartości (gdy są wartości w drugim języku)
// chcę też sprawdzać zmienne w {}
// chcę też sprawdzać, czy escape chars są OK
