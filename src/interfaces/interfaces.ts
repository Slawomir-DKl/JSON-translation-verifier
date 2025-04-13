type JSONValue = string | null | JSONObject | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export interface ComparePayload {
  srcLng: string;
  srcData: Object;
  targetLng: string;
  targetData: Object;
  root: string;
}

export interface Config {
  folder: string;
  srcLng: string;
  targetLng: string;
  version: string;
  lengthPercentDifference: number;
  maxErrorCount: number;
}
