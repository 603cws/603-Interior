export const isCouponValid = (coupon, totalAmount) => {
  const today = new Date();
  const expiryDate = new Date(coupon?.expiryDate);
  const checkexpiry = expiryDate >= today.setHours(0, 0, 0, 0);

  if (checkexpiry) {
    return totalAmount > coupon?.minAmount;
  } else {
    return false;
  }
};
