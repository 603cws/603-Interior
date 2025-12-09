//change
export const getDateInfo = () => {
  const now = new Date();
  return {
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth() + 1,
    currentDate: now.getDate(),
    currentTime: now.toLocaleTimeString(),
    fullDate: now.toLocaleDateString(),
  };
};
