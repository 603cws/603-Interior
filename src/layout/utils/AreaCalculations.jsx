export const MAX_AREA = 25000;
export const MIN_AREA = 1000;

export const calculateReceptionArea = (totalArea) => {
  if (totalArea >= MIN_AREA && totalArea <= MAX_AREA) {
    if (totalArea >= 1000 && totalArea <= 2000) {
      return Math.round(totalArea * 0.055);
    } else if (totalArea >= 2000 && totalArea <= 10000) {
      return Math.round(totalArea * 0.05);
    } else if (totalArea >= 10000 && totalArea <= 12000) {
      return Math.round(totalArea * 0.0475);
    } else if (totalArea >= 12000 && totalArea <= 14000) {
      return Math.round(totalArea * 0.045);
    } else if (totalArea >= 14000 && totalArea <= 16000) {
      return Math.round(totalArea * 0.0425);
    } else if (totalArea >= 16000 && totalArea <= 18000) {
      return Math.round(totalArea * 0.04);
    } else if (totalArea >= 18000 && totalArea <= 19000) {
      return Math.round(totalArea * 0.0375);
    } else if (totalArea >= 19000 && totalArea <= 20000) {
      return Math.round(totalArea * 0.035);
    } else if (totalArea >= 20000 && totalArea <= 21000) {
      return Math.round(totalArea * 0.0325);
    } else if (totalArea >= 21000 && totalArea <= 22000) {
      return Math.round(totalArea * 0.03);
    } else if (totalArea >= 22000 && totalArea <= 23000) {
      return Math.round(totalArea * 0.0275);
    } else if (totalArea >= 23000 && totalArea <= 24000) {
      return Math.round(totalArea * 0.025);
    } else if (totalArea >= 24000 && totalArea <= 25000) {
      return Math.round(totalArea * 0.02);
    }
  } else {
    return 1;
  }
};

export const calculateLoungeArea = (totalArea) => {
  if (totalArea >= 1000 && totalArea < 2000) {
    return Math.round(totalArea * 0.11);
  } else if (totalArea >= 2000 && totalArea < 3000) {
    return Math.round(totalArea * 0.08);
  } else if (totalArea >= 3000 && totalArea < 4000) {
    return Math.round(totalArea * 0.065);
  } else if (totalArea >= 4000 && totalArea < 5000) {
    return Math.round(totalArea * 0.06);
  } else if (totalArea >= 5000 && totalArea < 6000) {
    return Math.round(totalArea * 0.05);
  } else if (totalArea >= 6000 && totalArea < 7000) {
    return Math.round(totalArea * 0.047);
  } else if (totalArea >= 7000 && totalArea < 8000) {
    return Math.round(totalArea * 0.046);
  } else if (totalArea >= 8000 && totalArea < 12000) {
    return Math.round(totalArea * 0.045);
  } else if (totalArea >= 12000 && totalArea < 13000) {
    return Math.round(totalArea * 0.043);
  } else if (totalArea >= 13000 && totalArea < 14000) {
    return Math.round(totalArea * 0.0407);
  } else if (totalArea >= 14000 && totalArea <= 25000) {
    return Math.round(totalArea * 0.04);
  } else {
    return 0;
  }
};

export const calculateLinear = (totalArea) => {
  if (totalArea >= 1000 && totalArea < 2000) {
    return Math.round(totalArea * 0.3);
  } else if (totalArea >= 2000 && totalArea < 6000) {
    return Math.round(totalArea * 0.36);
  } else if (totalArea >= 6000 && totalArea < 10000) {
    return Math.round(totalArea * 0.38);
  } else if (totalArea >= 10000 && totalArea <= 25000) {
    return Math.round(totalArea * 0.4);
  } else {
    return 0;
  }
};

export const calculateLType = (totalArea, areaValues) => {
  if (totalArea >= 8000 && totalArea < 9000) {
    return areaValues.lType * 5;
  } else if (totalArea >= 9000 && totalArea < 14000) {
    return areaValues.lType * 10;
  } else if (totalArea >= 14000 && totalArea < 18000) {
    return areaValues.lType * 15;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.lType * 20;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.lType * 25;
  } else {
    return 0;
  }
};

export const calculateMd = (totalArea, areaValues) => {
  if (totalArea >= 1000 && totalArea < 6000) {
    return areaValues.md * 1;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.md * 2;
  } else if (totalArea >= 9000 && totalArea < 12000) {
    return areaValues.md * 3;
  } else if (totalArea >= 12000 && totalArea < 15000) {
    return areaValues.md * 4;
  } else if (totalArea >= 15000 && totalArea < 18000) {
    return areaValues.md * 5;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.md * 6;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.md * 7;
  } else {
    return 0;
  }
};

export const calculateManager = (totalArea, areaValues) => {
  if (totalArea >= 2000 && totalArea < 3000) {
    return areaValues.manager * 1;
  } else if (totalArea >= 3000 && totalArea < 6000) {
    return areaValues.manager * 2;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.manager * 3;
  } else if (totalArea >= 9000 && totalArea < 12000) {
    return areaValues.manager * 4;
  } else if (totalArea >= 12000 && totalArea < 15000) {
    return areaValues.manager * 5;
  } else if (totalArea >= 15000 && totalArea < 18000) {
    return areaValues.manager * 6;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.manager * 7;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.manager * 8;
  } else {
    return 0;
  }
};

export const calculateSmall = (totalArea, areaValues) => {
  if (totalArea >= 2000 && totalArea < 3000) {
    return areaValues.small * 1;
  } else if (totalArea >= 3000 && totalArea < 6000) {
    return areaValues.small * 2;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.small * 3;
  } else if (totalArea >= 9000 && totalArea <= 25000) {
    return areaValues.small * 4;
  } else {
    return 0;
  }
};

export const calculateInterviewRoom = (totalArea, areaValues) => {
  if (totalArea >= 6000 && totalArea < 12000) {
    return areaValues.interviewRoom * 1;
  } else if (totalArea >= 12000 && totalArea <= 25000) {
    return areaValues.interviewRoom * 2;
  } else {
    return 0;
  }
};

export const calculateConferenceRoom = (totalArea, areaValues) => {
  if (totalArea >= 3000 && totalArea < 8000) {
    return areaValues.conferenceRoom * 1;
  } else if (totalArea >= 8000 && totalArea < 15000) {
    return areaValues.conferenceRoom * 2;
  } else if (totalArea >= 15000 && totalArea < 18000) {
    return areaValues.conferenceRoom * 3;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.conferenceRoom * 4;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.conferenceRoom * 5;
  } else {
    return 0;
  }
};

export const calculateBoardRoom = (totalArea, areaValues) => {
  if (totalArea >= 12000 && totalArea <= 25000) {
    return areaValues.boardRoom * 1;
  } else {
    return 0;
  }
};

export const calculateMeetingRoom = (totalArea, areaValues) => {
  if (totalArea >= 1000 && totalArea < 3000) {
    return areaValues.meetingRoom * 1;
  } else if (totalArea >= 3000 && totalArea < 6000) {
    return areaValues.meetingRoom * 2;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.meetingRoom * 3;
  } else if (totalArea >= 9000 && totalArea < 12000) {
    return areaValues.meetingRoom * 4;
  } else if (totalArea >= 12000 && totalArea <= 25000) {
    return areaValues.meetingRoom * 6;
  } else {
    return 0;
  }
};

export const calculateMeetingRoomLarge = (totalArea, areaValues) => {
  if (totalArea >= 14000 && totalArea < 15000) {
    return areaValues.meetingRoomLarge * 1;
  } else if (totalArea >= 15000 && totalArea <= 25000) {
    return areaValues.meetingRoomLarge * 2;
  } else {
    return 0;
  }
};

export const calculateVideoRecordingRoom = (totalArea, areaValues) => {
  if (totalArea >= 15000 && totalArea <= 25000) {
    return areaValues.videoRecordingRoom * 1;
  } else {
    return 0;
  }
};

export const calculatePhoneBooth = (totalArea, areaValues) => {
  if (totalArea >= 3000 && totalArea < 9000) {
    return areaValues.phoneBooth * 2;
  } else if (totalArea >= 9000 && totalArea < 18000) {
    return areaValues.phoneBooth * 4;
  } else if (totalArea >= 18000 && totalArea <= 25000) {
    return areaValues.phoneBooth * 8;
  } else {
    return 0;
  }
};

export const calculateServer = (totalArea, areaValues) => {
  if (totalArea >= 2000 && totalArea < 6000) {
    return areaValues.server * 1;
  } else if (totalArea >= 6000 && totalArea < 12000) {
    return areaValues.server * 2;
  } else if (totalArea >= 12000 && totalArea < 18000) {
    return areaValues.server * 4;
  } else if (totalArea >= 18000 && totalArea <= 25000) {
    return areaValues.server * 8;
  } else {
    return 0;
  }
};

export const calculateWashroomsArea = (totalArea) => {
  if (totalArea >= 1000 && totalArea < 2000) {
    return Math.round(totalArea * 0.12);
  } else if (totalArea >= 2000 && totalArea < 3000) {
    return Math.round(totalArea * 0.1);
  } else if (totalArea >= 3000 && totalArea < 4000) {
    return Math.round(totalArea * 0.08);
  } else if (totalArea >= 4000 && totalArea < 10000) {
    return Math.round(totalArea * 0.05);
  } else if (totalArea >= 10000 && totalArea < 12000) {
    return Math.round(totalArea * 0.0475);
  } else if (totalArea >= 12000 && totalArea < 14000) {
    return Math.round(totalArea * 0.046);
  } else if (totalArea >= 14000 && totalArea < 16000) {
    return Math.round(totalArea * 0.045);
  } else if (totalArea >= 16000 && totalArea < 20000) {
    return Math.round(totalArea * 0.044);
  } else if (totalArea >= 20000 && totalArea < 22000) {
    return Math.round(totalArea * 0.043);
  } else if (totalArea >= 22000 && totalArea < 24000) {
    return Math.round(totalArea * 0.042);
  } else if (totalArea >= 24000 && totalArea <= 25000) {
    return Math.round(totalArea * 0.04);
  } else {
    return 0;
  }
};

export const mapAreaValues = (
  userId,
  areaValues,
  areaQuantities,
  totalArea = null,
  builtArea,
  seatCounts
) => {
  return {
    userId: userId || null,
    linearArea: areaValues.linear,
    linearQty: areaQuantities.linear || 0,
    lTypeArea: areaValues.lType,
    lTypeQty: areaQuantities.lType || 0,
    mdArea: areaValues.md,
    mdQty: areaQuantities.md || 0,
    managerArea: areaValues.manager,
    managerQty: areaQuantities.manager || 0,
    smallArea: areaValues.small,
    smallQty: areaQuantities.small || 0,
    upsArea: areaValues.ups,
    upsQty: areaQuantities.ups || 0,
    bmsArea: areaValues.bms,
    bmsQty: areaQuantities.bms || 0,
    serverArea: areaValues.server,
    serverQty: areaQuantities.server || 0,
    receptionArea: areaValues.reception,
    receptionQty: areaQuantities.reception || 0,
    loungeArea: areaValues.lounge,
    loungeQty: areaQuantities.lounge || 0,
    salesArea: areaValues.sales,
    salesQty: areaQuantities.sales || 0,
    phoneBoothArea: areaValues.phoneBooth,
    phoneBoothQty: areaQuantities.phoneBooth || 0,
    discussionRoomArea: areaValues.discussionRoom,
    discussionRoomQty: areaQuantities.discussionRoom || 0,
    interviewRoomArea: areaValues.interviewRoom,
    interviewRoomQty: areaQuantities.interviewRoom || 0,
    conferenceRoomArea: areaValues.conferenceRoom,
    conferenceRoomQty: areaQuantities.conferenceRoom || 0,
    boardRoomArea: areaValues.boardRoom,
    boardRoomQty: areaQuantities.boardRoom || 0,
    meetingRoomArea: areaValues.meetingRoom,
    meetingRoomQty: areaQuantities.meetingRoom || 0,
    meetingRoomLargeArea: areaValues.meetingRoomLarge,
    meetingRoomLargeQty: areaQuantities.meetingRoomLarge || 0,
    hrRoomArea: areaValues.hrRoom,
    hrRoomQty: areaQuantities.hrRoom || 0,
    financeRoomArea: areaValues.financeRoom,
    financeRoomQty: areaQuantities.financeRoom || 0,
    breakoutRoomArea: areaValues.breakoutRoom,
    breakoutRoomQty: areaQuantities.breakoutRoom || 0,
    executiveWashroomArea: areaValues.executiveWashroom,
    executiveWashroomQty: areaQuantities.executiveWashroom || 0,
    videoRecordingRoomArea: areaValues.videoRecordingRoom,
    videoRecordingRoomQty: areaQuantities.videoRecordingRoom || 0,
    otherArea: areaValues.other,
    otherQty: areaQuantities.other || 0,
    washroomsArea: areaValues.washrooms,
    washroomsQty: areaQuantities.washrooms || 0,
    ...(totalArea !== null && { totalArea }),
    usedSpace: builtArea,
    seatCount: seatCounts,
  };
};
