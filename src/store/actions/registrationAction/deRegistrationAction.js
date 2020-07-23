import ApiConstants from "../../../themes/apiConstants";


/////save end user registration
function updateDeregistrationData(value, key) {
    const action = {
        type: ApiConstants.API_UPDATE_DE_REGISTRATION,
        value, key
    };
    return action;
}



export {
    updateDeregistrationData,

}