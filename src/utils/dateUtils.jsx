// utils/dateUtils.js
export const getDateInfo = () => {
  const now = new Date();
  return {
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth() + 1, // 0-indexed, so add +1
    currentDate: now.getDate(),
    currentTime: now.toLocaleTimeString(), // formatted time
    fullDate: now.toLocaleDateString(), // formatted date
  };
};
