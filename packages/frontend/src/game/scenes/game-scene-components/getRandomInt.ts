export const getRandomInt = (min: number, max: number) => {
  const minAdjusted = Math.ceil(min);
  const maxAdjusted = Math.floor(max);
  return Math.floor(Math.random() * (maxAdjusted - minAdjusted)) + min;
};
