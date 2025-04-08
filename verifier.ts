import { checkDifferences } from "./src/functions/check_diff";
import { printResults } from "./src/functions/print_result";
import { Config } from "./src/interfaces/interfaces";

let errors = new Set<string>();

const config: Config = {
  folder: "files_to_check",
  srcLng: "EN",
  targetLng: "PL",
  lengthPercentDifference: 0.7,
  maxErrorCount: 50,
};

checkDifferences(config, errors);
printResults(config.maxErrorCount, errors);
