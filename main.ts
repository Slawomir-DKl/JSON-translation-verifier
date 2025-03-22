import * as fs from "fs";

function checkDifferences(sourceFileName: string, targetFileName: string) {
  const enJsonString = fs.readFileSync(`./${sourceFileName}`, "utf-8");
  const plJsonString = fs.readFileSync(`./${targetFileName}`, "utf-8");
  try {
    const enJsonData = JSON.parse(enJsonString);
    const plJsonData = JSON.parse(plJsonString);
    compareKeys("EN", enJsonData, "PL", plJsonData);
    compareKeys("PL", plJsonData, "EN", enJsonData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("One of JSON files is probably corrupted");
    } else {
      console.log("Unknown error occured");
    }
    let errorTyped = error as Error;
    console.log(errorTyped.message);
  }
}

function compareKeys(
  sourceLanguage: string,
  sourceData: Object,
  targetLanguage: string,
  targetData: Object
) {
  let comparator = false;
  let sourceValue: any;
  let targetValue: any;

  for (const sourceKey in sourceData) {
    for (const targetKey in targetData) {
      if (sourceKey === targetKey) {
        comparator = true;
        sourceValue = sourceData[sourceKey];
        targetValue = targetData[targetKey];
        if (typeof sourceValue === "object" && sourceValue !== null) {
          if (typeof targetValue === "object" && targetValue !== null) {
            // console.log(sourceKey, "OK");
            compareKeys(
              sourceLanguage,
              sourceValue,
              targetLanguage,
              targetValue
            );
          } else {
            console.log(
              `❌ Key ${sourceKey} is object in ${sourceLanguage} but not in ${targetLanguage}`
            );
          }
        }
      }
    }
    if (comparator === false) {
      console.log(`❌ Key ${sourceKey} not found in ${targetLanguage}`);
    }
    comparator = false;
  }
}

checkDifferences("en.json", "pl.json");
// chcę żeby się też zgadzała kolejność
// docelowo zwracamy tylko liczbę faili i wykaz faili
// chcę też sprawdzać, czy nie ma pustych wartości (gdy są wartości w drugim języku)
// chcę też sprawdzać zmienne w {}
// chcę też sprawdzać, czy escape chars są OK
