import { checkDifferences } from "./src/functions/check_diff";
import { printResults } from "./src/functions/print_result";
import { Config } from "./src/interfaces/interfaces";

let errors = new Set<string>();

const config: Config = {
  folder: "sample_files",
  srcLng: "EN",
  targetLng: "PL",
  version: "", // empty string if `en.json`; version will be added without any chars
  lengthPercentDifference: 0.7,
  maxErrorCount: 50,
};

checkDifferences(config, errors);
printResults(config.maxErrorCount, errors);
