function calculateSpace(type, quantity, latestData, keys) {
  quantity = quantity[0] || {};

  if (type === "areas") {
    return keys.reduce((total, key) => {
      return (
        total +
        (quantity[`${key}Qty`] && latestData[`${key}Area`]
          ? latestData[`${key}Area`]
          : 0)
      );
    }, 0);
  }

  return keys.reduce((total, key) => total + (latestData[`${key}Qty`] || 0), 0);
}

const getCategoryTotal = (keys, totals) => {
  return keys.reduce((sum, key) => {
    const totalKey = `${key}Total`;
    return sum + (totals[totalKey] || 0);
  }, 0);
};

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

  const workspaceTotals = {};

  Object.keys(latestData).forEach((key) => {
    if (key.endsWith("Area")) {
      const prefix = key.replace("Area", "");
      const qtyKey = `${prefix}Qty`;
      if (qtyKey in latestData) {
        workspaceTotals[`${prefix}Total`] =
          latestData[key] * latestData[qtyKey];
      }
    }
  });

  const openWorkSpacesKeys = ["linear", "lType"];

  const cabinsKeys = ["md", "manager", "small"];

  const meetingRoomKeys = [
    // "discussionRoom",
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

  const publicSpaceKeys = [
    "reception",
    "lounge",
    "phoneBooth",
    "breakoutRoom",
    // "maleWashroom",
    // "femaleWashroom",
    "washrooms",
  ];

  const supportSpaceKeys = [
    "ups",
    "bms",
    "server",
    "other",
    "executiveWashroom",
  ];

  // const openworkspaces = calculateSpace(
  //   type,
  //   quantity,
  //   latestData,
  //   openWorkSpacesKeys
  // );

  const openworkspaces = getCategoryTotal(openWorkSpacesKeys, workspaceTotals);

  // const cabins = calculateSpace(type, quantity, latestData, cabinsKeys);
  const cabins = getCategoryTotal(cabinsKeys, workspaceTotals);

  // const meetingrooms = calculateSpace(
  //   type,
  //   quantity,
  //   latestData,
  //   meetingRoomKeys
  // );
  const meetingrooms = getCategoryTotal(meetingRoomKeys, workspaceTotals);

  // const publicspaces = calculateSpace(
  //   type,
  //   quantity,
  //   latestData,
  //   publicSpaceKeys
  // );
  const publicspaces = getCategoryTotal(publicSpaceKeys, workspaceTotals);

  // const supportspaces = calculateSpace(
  //   type,
  //   quantity,
  //   latestData,
  //   supportSpaceKeys
  // );
  const supportspaces = getCategoryTotal(supportSpaceKeys, workspaceTotals);

  let allAreas =
    openworkspaces + cabins + meetingrooms + publicspaces + supportspaces;

  const processedData = {
    linear: type === "quantity" ? latestData.linearQty : latestData.linearArea,
    ltype: type === "quantity" ? latestData.lTypeQty : latestData.lTypeArea,
    md: type === "quantity" ? latestData.mdQty : latestData.mdArea,
    manager:
      type === "quantity" ? latestData.managerQty : latestData.managerArea,
    small: type === "quantity" ? latestData.smallQty : latestData.smallArea,
    ups: type === "quantity" ? latestData.upsQty : latestData.upsArea,
    bms: type === "quantity" ? latestData.bmsQty : latestData.bmsArea,
    server: type === "quantity" ? latestData.serverQty : latestData.serverArea,
    reception:
      type === "quantity" ? latestData.receptionQty : latestData.receptionArea,
    lounge: type === "quantity" ? latestData.loungeQty : latestData.loungeArea,
    sales: type === "quantity" ? latestData.salesQty : latestData.salesArea,
    phonebooth:
      type === "quantity"
        ? latestData.phoneBoothQty
        : latestData.phoneBoothArea,
    // discussionroom:
    //   type === "quantity"
    //     ? latestData.discussionRoomQty
    //     : latestData.discussionRoomArea,
    interviewroom:
      type === "quantity"
        ? latestData.interviewRoomQty
        : latestData.interviewRoomArea,
    conferenceroom:
      type === "quantity"
        ? latestData.conferenceRoomQty
        : latestData.conferenceRoomArea,
    boardroom:
      type === "quantity" ? latestData.boardRoomQty : latestData.boardRoomArea,
    meetingroom:
      type === "quantity"
        ? latestData.meetingRoomQty
        : latestData.meetingRoomArea,
    meetingroomlarge:
      type === "quantity"
        ? latestData.meetingRoomLargeQty
        : latestData.meetingRoomLargeArea,
    hrroom: type === "quantity" ? latestData.hrRoomQty : latestData.hrRoomArea,
    financeroom:
      type === "quantity"
        ? latestData.financeRoomQty
        : latestData.financeRoomArea,
    videorecordingroom:
      type === "quantity"
        ? latestData.videoRecordingRoomQty
        : latestData.videoRecordingRoomArea,
    breakoutroom:
      type === "quantity"
        ? latestData.breakoutRoomQty
        : latestData.breakoutRoomArea,
    // malewashroom:
    //   type === "quantity"
    //     ? latestData.maleWashroomQty
    //     : latestData.maleWashroomArea,
    // femalewashroom:
    //   type === "quantity"
    //     ? latestData.femaleWashroomQty
    //     : latestData.femaleWashroomArea,
    washrooms:
      type === "quantity" ? latestData.washroomsQty : latestData.washroomsArea,
    executivewashroom:
      type === "quantity"
        ? latestData.executiveWashroomQty
        : latestData.executiveWashroomArea,
    other: type === "quantity" ? latestData.otherQty : latestData.otherArea,
    totalArea: type === "areas" ? latestData.totalArea : undefined,

    openworkspaces: openworkspaces,
    cabins: cabins,
    meetingrooms: meetingrooms,
    publicspaces: publicspaces,
    supportspaces: supportspaces,
    allareas: allAreas,
    centralized: allAreas,
    pantry: type === "quantity" ? latestData.loungeQty : latestData.loungeArea,
    usedSpace: latestData.usedSpace,
  };

  return processedData;
};

// Export the function for external use
export default processData;
