import { DUMMY_REPORT } from './dummyData';

export const submitIdea = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DUMMY_REPORT);
    }, 1500);
  });
};
