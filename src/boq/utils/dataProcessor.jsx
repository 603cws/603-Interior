const openWorkSpacesKeys = ["linear", "lType"];

const cabinsKeys = ["md", "manager", "small"];

const meetingRoomKeys = [
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
  "washrooms",
];

const supportSpaceKeys = ["ups", "bms", "server", "other", "executiveWashroom"];

export const calculateSeatCountTotals = (seatCount) => {
  if (!seatCount) return {};

  const getTotal = (keys) =>
    keys.reduce((sum, key) => sum + (seatCount[key] || 0), 0);

  return {
    openworkspaces: getTotal(openWorkSpacesKeys),
    cabins: getTotal(cabinsKeys),
    meetingrooms: getTotal(meetingRoomKeys),
    publicspaces: getTotal(publicSpaceKeys),
    supportspaces: getTotal(supportSpaceKeys),
    pantry: getTotal(["lounge"]),
  };
};

const getCategoryTotal = (type, keys, data, latestData) => {
  return keys.reduce((sum, key) => {
    if (type === "areas") {
      const totalKey = `${key}Total`;
      return sum + (data[totalKey] || 0);
    } else {
      const qtyKey = `${key}Qty`;
      return sum + (latestData[qtyKey] || 0);
    }
  }, 0);
};

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

  const openworkspaces = getCategoryTotal(
    type,
    openWorkSpacesKeys,
    workspaceTotals,
    latestData
  );

  const cabins = getCategoryTotal(
    type,
    cabinsKeys,
    workspaceTotals,
    latestData
  );

  const meetingrooms = getCategoryTotal(
    type,
    meetingRoomKeys,
    workspaceTotals,
    latestData
  );

  const publicspaces = getCategoryTotal(
    type,
    publicSpaceKeys,
    workspaceTotals,
    latestData
  );

  const supportspaces = getCategoryTotal(
    type,
    supportSpaceKeys,
    workspaceTotals,
    latestData
  );

  let allAreas =
    openworkspaces + cabins + meetingrooms + publicspaces + supportspaces;

  let centralizedAreas =
    type === "quantity"
      ? cabins + meetingrooms + publicspaces + supportspaces
      : allAreas;

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
    washrooms:
      type === "quantity" ? latestData.washroomsQty : latestData.washroomsArea,
    executivewashroom:
      type === "quantity"
        ? latestData.executiveWashroomQty
        : latestData.executiveWashroomArea,
    other: type === "quantity" ? latestData.otherQty : latestData.otherArea,
    totalArea: type === "areas" ? latestData.totalArea : undefined,
    openworkspaces: type === "quantity" ? 1 : openworkspaces,
    cabins: cabins,
    meetingrooms: meetingrooms,
    publicspaces: publicspaces,
    supportspaces: supportspaces,
    allareas: allAreas,
    centralized: centralizedAreas,
    pantry: type === "quantity" ? latestData.loungeQty : latestData.loungeArea,
    usedSpace: latestData.usedSpace,
  };

  return processedData;
};

export default processData;
