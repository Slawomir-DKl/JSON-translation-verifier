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
  lengthPercentDifference: number;
  maxErrorCount: number;
}
