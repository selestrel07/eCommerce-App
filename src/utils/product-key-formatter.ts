export const keyToNameFormatter = (key?: string) => {
  return key
    ? key
        .split('-')
        .map((word: string) => `${word[0].toUpperCase()}${word.slice(1)}`)
        .join(' ')
    : '';
};
