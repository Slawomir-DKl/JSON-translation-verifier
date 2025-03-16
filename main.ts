import * as fs from "fs";

function checkDifferences(sourceFileName: string, targetFileName: string) {
  const enJsonString = fs.readFileSync(`./${sourceFileName}`, "utf-8");
  const plJsonString = fs.readFileSync(`./${targetFileName}`, "utf-8");
  const enJsonData = JSON.parse(enJsonString);
  const plJsonData = JSON.parse(plJsonString);
  compareKeys("EN", enJsonData, "PL", plJsonData);
  compareKeys("PL", plJsonData, "EN", enJsonData);
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
            console.log(sourceKey, "OK");
            // funkcja rekurencyjna
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
// chcę żeby się zgadzały rekurencyjnie podklucze
// docelowo zwracamy tylko liczbę faili i wykaz faili
