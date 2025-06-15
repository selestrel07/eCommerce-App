export const formatPrice = (price?: number, fractionDigits?: number): string => {
  if (!price) return '';
  if (fractionDigits) return (price / 10 ** fractionDigits).toFixed(fractionDigits);
  return price.toFixed(2);
};
