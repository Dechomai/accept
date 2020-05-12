export const calculateEscrow = (price1, count1, price2, count2) =>
  Math.min(price1 * count1, price2 * count2);

export const calculateEscrowDifference = (price1, count1, price2, count2) => {
  const escrow = calculateEscrow(price1, count1, price2, count2);
  return Math.max(price1 * count1 - escrow, price2 * count2 - escrow);
};
