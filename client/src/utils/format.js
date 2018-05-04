export const formatPrice = (price, currency) => `${currency || ''} ${price.toFixed(2)}`.trim();
