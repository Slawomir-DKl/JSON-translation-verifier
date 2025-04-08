export function printResults(maxErrorCount: number, errors: Set<string>) {
  if (errors.size === 1) {
    console.log(`There is ${errors.size} error in JSON files`);
  } else if (errors.size > maxErrorCount) {
    console.log(
      `There is more than ${maxErrorCount} errors in JSON files. Correct them and run the program again.`
    );
  } else if (errors.size > 1) {
    console.log(`There are ${errors.size} errors in JSON files`);
  } else {
    console.log("No errors found");
  }

  const errorList = Array.from(errors).sort();
  const maxErrors = errorList.length > maxErrorCount ? maxErrorCount : errorList.length;

  for (let index = 0; index < maxErrors; index++) {
    console.log(errorList[index]);
  }
}
