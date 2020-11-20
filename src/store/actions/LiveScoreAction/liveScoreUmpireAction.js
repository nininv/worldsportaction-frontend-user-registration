import ApiConstants from "../../../themes/apiConstants";

function getUmpireAvailabilityAction(userId, fromTime, endTime) {
    const action = {
      type: ApiConstants.API_LIVE_SCORE_GET_UMPIRE_AVAILABILITY_LOAD,
      userId,
      fromTime,
      endTime
    };
    return action;
}

function saveUmpireAvailabilityAction(postData, userId, fromTime, endTime) {
    const action = {
      type: ApiConstants.API_LIVE_SCORE_SAVE_UMPIRE_AVAILABILITY_LOAD,
      postData,
      userId,
      fromTime,
      endTime
    };
    return action;
}


export {
    getUmpireAvailabilityAction,
    saveUmpireAvailabilityAction,
} 
