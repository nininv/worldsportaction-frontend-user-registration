import ApiConstants from "../../../themes/apiConstants";

/////get invoice 
function getInvoice(registrationid) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        registrationid
    }
    return action
}


export {
    getInvoice,
}
