export const isCouponValid = (expiryDateStr) => {
  const today = new Date();
  const expiryDate = new Date(expiryDateStr);

  // If expiryDate is in the future or today, it's valid
  return expiryDate >= today.setHours(0, 0, 0, 0);
};
