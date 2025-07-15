export const isCouponValid = (coupon, totalAmount) => {
  console.log("coupon", coupon);

  console.log("total", totalAmount);

  const today = new Date();
  const expiryDate = new Date(coupon?.expiryDate);

  // If expiryDate is in the future or today, it's valid
  const checkexpiry = expiryDate >= today.setHours(0, 0, 0, 0);

  console.log("checkexpiry", checkexpiry);

  if (checkexpiry) {
    console.log(
      totalAmount < coupon?.minAmount,
      totalAmount,
      coupon?.minAmount
    );

    return totalAmount > coupon?.minAmount;
  } else {
    return false;
  }
};
