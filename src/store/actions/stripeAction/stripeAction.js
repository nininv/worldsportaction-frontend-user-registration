import ApiConstants from "../../../themes/apiConstants";

/////get invoice for new shop
function getShopInvoice(shopUniqueKey, invoiceId) {
    const action = {
        type: ApiConstants.API_GET_SHOP_INVOICE_LOAD,
        shopUniqueKey,
        invoiceId
    };
    return action;
}

/////get invoice
function getInvoice(registrationid, userRegId, invoiceId, teamMemberRegId) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        registrationid,
        userRegId,
        invoiceId,
        teamMemberRegId
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
function getInvoiceStatusAction(registrationid, userRegId, invoiceId,teamMemberRegId) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_STATUS_LOAD,
        registrationid,
        userRegId,
        invoiceId,
        teamMemberRegId
    }
    return action
}

///save stripe account
function saveStripeAccountAction(code, userId) {
    const action = {
        type: ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_LOAD,
        code, userId
    };
    return action
}

////stripe login link
function getStripeLoginLinkAction(userId) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_LOAD,
        userId
    };
    return action;
}

function clearInvoiceDataAction() {
    const action = {
        type: ApiConstants.CLEAR_INVOICE_DATA,
    };
    return action;
}

export {
    getInvoice,
    onChangeCharityAction,
    saveInvoiceAction,
    getInvoiceStatusAction,
    saveStripeAccountAction,
    getStripeLoginLinkAction,
    getShopInvoice,
    clearInvoiceDataAction
}
