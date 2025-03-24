# JSON translation verifier

**Description:** The program verifies if source and target JSONs have the same keys with the same structure. The program is written in TypeScript. 

## How to use the script

1. Configure file names (constants `sourceFile` and `targetFile` at the beginning of the `verifier.ts`)

2. Run the script, e.g. `npx ts-node verifier.ts`

## Input files

Source and translation should be in standard JSON format. In case of doubts, check the JSON validity e.g. on [JSONLint](https://jsonlint.com/).

Structure of source JSON file

```json
{
  "SECTION_1": {
    "FEATURE_1": "Original text for feature 1",
    "FEATURE_2": "Original text for feature 2",
    "FEATURE_3": "Original text for feature 3"
  },
  "SECTION_2": {
    "FEATURE_4": "Original text for feature 4",
    "FEATURE_5": "Original text for feature 5"
  }
}
```

Structure of target JSON file (example in Polish)

```json
{
  "SECTION_1": {
    "FEATURE_1": "Tłumaczenie tekstu dla funkcji 1",
    "FEATURE_2": "Tłumaczenie tekstu dla funkcji 2",
    "FEATURE_3": "Tłumaczenie tekstu dla funkcji 3"
  },
  "SECTION_2": {
    "FEATURE_4": "Tłumaczenie tekstu dla funkcji 4",
    "FEATURE_5": "Tłumaczenie tekstu dla funkcji 5"
  }
}
```
