export const compressPeaks = (peaks: number[], peakLinesCount: number): number[] => {
  const peakLinesItems: number[][] = [];
  peaks.forEach((item, index, arr) => {
    const i = Math.trunc((index * peakLinesCount) / arr.length);
    if (!peakLinesItems[i]) peakLinesItems[i] = [];
    peakLinesItems[i].push(item);
  });
  return peakLinesItems.map((item: number[]) => item.reduce((prev, curr) => prev + curr, 0) / item.length);
};

export const getFormatted = (seconds: number, decimals?: boolean): string => {
  const minutes: number = Math.trunc(seconds / 60);
  const sec: number = seconds - minutes * 60;
  const sSec: string = sec < 10 ? '0' + sec.toFixed(decimals ? 2 : 0) : sec.toFixed(decimals ? 2 : 0);
  return `${minutes}:${sSec}`;
};
