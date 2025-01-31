function calculateSpace(type, quantity, latestData, keys) {
  quantity = quantity[0] || {};
  if (type === "areas") {
    return keys.reduce((total, key) => {
      return total + (quantity[key] && latestData[key] ? latestData[key] : 0);
    }, 0);
  }
  return keys.reduce((total, key) => total + (latestData[key] || 0), 0);
}

// Same calculateSpace function with console logs for debugging
// function calculateSpace(type, quantity, latestData, keys) {
//   quantity = quantity[0] || {};
//   console.log("Type:", type); // Log type to ensure it's correct
//   let total = 0;

//   if (type === "areas") {
//     keys.forEach((key) => {
//       const quantityValue = quantity[key];
//       const latestDataValue = latestData[key];
//       const addValue =
//         quantityValue > 0 && latestDataValue ? latestDataValue : 0;

//       // Log key and its corresponding values
//       console.log(`Key: ${key}`);
//       console.log(`quantity[${key}]:`, quantityValue);
//       console.log(`latestData[${key}]:`, latestDataValue);
//       console.log(`Added to total:`, addValue);

//       total += addValue;
//     });
//   } else {
//     keys.forEach((key) => {
//       const latestDataValue = latestData[key];
//       const addValue = latestDataValue || 0;

//       // Log key and its corresponding values
//       console.log(`Key: ${key}`);
//       console.log(`latestData[${key}]:`, latestDataValue);
//       console.log(`Added to total:`, addValue);

//       total += addValue;
//     });
//   }

//   console.log("Final Total:", total); // Log the final total
//   return total;
// }

const processData = (data, type, quantity = {}) => {
  if (!data || data.length === 0) return null;

  const latestData = data[0];

  const openWorkSpacesKeys = ["linear", "lType"];

  const cabinsKeys = ["md", "manager", "small"];

  const meetingRoomKeys = [
    "discussionRoom",
    "interviewRoom",
    "conferenceRoom",
    "boardRoom",
    "meetingRoom",
    "meetingRoomLarge",
    "hrRoom",
    "financeRoom",
    "sales",
    "videoRecordingRoom",
  ];

  const publicSpaceKeys = ["reception", "lounge", "phoneBooth", "breakoutRoom"];

  const supportSpaceKeys = [
    "ups",
    "bms",
    "server",
    "other",
    "executiveWashroom",
  ];

  const openworkspaces = calculateSpace(
    type,
    quantity,
    latestData,
    openWorkSpacesKeys
  );

  const cabins = calculateSpace(type, quantity, latestData, cabinsKeys);

  const meetingrooms = calculateSpace(
    type,
    quantity,
    latestData,
    meetingRoomKeys
  );

  const publicspaces = calculateSpace(
    type,
    quantity,
    latestData,
    publicSpaceKeys
  );

  const supportspaces = calculateSpace(
    type,
    quantity,
    latestData,
    supportSpaceKeys
  );

  let allAreas =
    openworkspaces + cabins + meetingrooms + publicspaces + supportspaces;

  const processedData = {
    linear: latestData.linear,
    ltype: latestData.lType,
    md: latestData.md,
    manager: latestData.manager,
    small: latestData.small,
    ups: latestData.ups,
    bms: latestData.bms,
    server: latestData.server,
    reception: latestData.reception,
    lounge: latestData.lounge,
    sales: latestData.sales,
    phonebooth: latestData.phoneBooth,
    discussionroom: latestData.discussionRoom,
    interviewroom: latestData.interviewRoom,
    conferenceroom: latestData.conferenceRoom,
    boardroom: latestData.boardRoom,
    meetingroom: latestData.meetingRoom,
    meetingroomlarge: latestData.meetingRoomLarge,
    hrroom: latestData.hrRoom,
    financeroom: latestData.financeRoom,
    videorecordingroom: latestData.videoRecordingRoom,
    breakoutroom: latestData.breakoutRoom,
    executivewashroom: latestData.executiveWashroom,
    other: latestData.other,
    totalArea: type === "areas" ? latestData.totalArea : undefined,

    openworkspaces: openworkspaces,
    cabins: cabins,
    meetingrooms: meetingrooms,
    publicspaces: publicspaces,
    supportspaces: supportspaces,
    allareas: allAreas,
    centralized: allAreas,
    pantry: latestData.lounge,
  };

  return processedData;
};

// Export the function for external use
export default processData;
