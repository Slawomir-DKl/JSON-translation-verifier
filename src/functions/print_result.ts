export function printResults(maxErrorCount: number, errors: string[]) {
  if (errors.length === 1) {
    console.log(`There is ${errors.length} error in JSON files`);
  } else if (errors.length > maxErrorCount) {
    console.log(
      `There is more than ${maxErrorCount} errors in JSON files. Correct them and run the program again.`
    );
  } else if (errors.length > 1) {
    console.log(`There are ${errors.length} errors in JSON files`);
  } else {
    console.log("No errors found");
  }

  errors.sort();
  const maxErrors =
    errors.length > maxErrorCount ? maxErrorCount : errors.length;

  for (let index = 0; index < maxErrors; index++) {
    console.log(errors[index]);
  }
}
