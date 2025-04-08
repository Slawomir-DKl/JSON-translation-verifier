export function checkOrder(
  srcLines: string[],
  targetLines: string[],
  errors: Set<string>
): void {
  for (let lineCnt = 0; lineCnt < srcLines.length; lineCnt++) {
    const srcLine: string = srcLines[lineCnt];
    if (srcLine.indexOf('"') > -1) {
      const targetLine: string = targetLines[lineCnt];
      const srcKey: string = srcLine.trim().split('"')[1];
      const targetKey: string = targetLine.trim().split('"')[1];
      if (srcKey != targetKey) {
        const maxLineCntLength: number = Math.floor(
          Math.log10(srcLines.length) + 1
        );
        const lineNumber: string = (lineCnt + 1)
          .toString()
          .padStart(maxLineCntLength, "0");
        errors.add(
          `5️⃣ Order alert: keys in line ${lineNumber} - source: ${srcKey}, target: ${targetKey}`
        );
      }
    }
  }
}
