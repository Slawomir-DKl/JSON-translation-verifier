import { ComparePayload } from "../interfaces/interfaces";

export function revertPayload(internalPayload: ComparePayload): ComparePayload {
  return {
    srcLng: internalPayload.targetLng,
    srcData: internalPayload.targetData,
    targetLng: internalPayload.srcLng,
    targetData: internalPayload.srcData,
    root: internalPayload.root,
  };
}
