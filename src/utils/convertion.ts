export const getFinishedTime = (timeFinished: Date, timeStart: Date) => {
  return `${Math.floor(
    (timeFinished.getTime() - timeStart.getTime()) / (1000 * 60 * 60)
  )
    .toFixed(0)
    .toString()
    .padStart(2, "0")}:${Math.floor(
    ((timeFinished.getTime() - timeStart.getTime()) / (1000 * 60)) % 60
  )
    .toFixed(0)
    .toString()
    .padStart(2, "0")}:${Math.floor(
    ((timeFinished.getTime() - timeStart.getTime()) / 1000) % 60
  )
    .toFixed(0)
    .toString()
    .padStart(2, "0")}`;
};
