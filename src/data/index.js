import { data } from './data';

export async function getData() {
  return data;
}

export async function getTargetIndex() {
  const awards = data[1].awards;
  let max = -1, targetIndex;
  awards.forEach((award, index) => {
    const t = award.chance * Math.random();
    if (t > max) {
      targetIndex = index;
      max = t;
    }
  })
  return targetIndex;
}