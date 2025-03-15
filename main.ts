import * as fs from "fs";

function checkDifferences(sourceFileName: string, targetFileName: string) {
  const enJsonString = fs.readFileSync(`./${sourceFileName}`, "utf-8");
  const plJsonString = fs.readFileSync(`./${targetFileName}`, "utf-8");

  compareMainKeys(enJsonString, plJsonString);
  compareMainKeys(plJsonString, enJsonString);
}

function compareMainKeys(sourceJSON: string, targetJSON: string) {
  const sourceData = JSON.parse(sourceJSON);
  const targetData = JSON.parse(targetJSON);
  let comparer: string;

  Object.keys(sourceData).forEach((sourceKey) => {
    comparer = Object.keys(targetData).indexOf(sourceKey) > -1 ? "✅" : "❌";
    console.log(sourceKey, comparer);
  });
}

checkDifferences("en.json", "pl.json");
// chcę żeby się też zgadzała kolejność
// chcę żeby się zgadzały rekurencyjnie podklucze
// docelowo zwracamy tylko liczbę faili i wykaz faili
