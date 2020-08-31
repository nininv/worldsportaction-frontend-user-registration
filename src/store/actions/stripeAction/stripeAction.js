import ApiConstants from "../../../themes/apiConstants";

/////get invoice 
function getInvoice(registrationid, userRegId) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        registrationid,
        userRegId
    }
    return action
}

/////onchange charity roundup
function onChangeCharityAction(value, key, charityItem) {
    const action = {
        type: ApiConstants.API_ONCHANGE_CHARITY_ROUNDUP_DATA_DATA,
        value, key, charityItem
    }
    return action
}


///invoice save post api
function saveInvoiceAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_INVOICE_LOAD,
        payload
    }
    return action
}

///////get invoice status
function getInvoiceStatusAction(registrationid, userRegId) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_STATUS_LOAD,
        registrationid,
        userRegId
    }
    return action
}

export {
    getInvoice,
    onChangeCharityAction,
    saveInvoiceAction,
    getInvoiceStatusAction,
}
