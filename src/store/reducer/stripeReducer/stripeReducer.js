import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { setOrganisationData, getOrganisationData } from "../../../util/sessionStorage";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    getInvoicedata: [],
    charityRoundUpFilter: [],
    subTotalFees: 0,
    subTotalGst: 0,
    amountTotal: 0,
    fixedTotal: 0,
    charitySelected: {
        roundUpId: 0,
        charitySelectedId: 0,
        charityValue: 0,
        competitionId: 0,
        competitionOrganisationId: 0,
        membershipMappingId: 0,
    },
    invoiceId: 0,
    transactionId: 0,
    showCharitySuccessData: null,
    getAffiliteDetailData: [],
}


//for making charity roundup array
function getCharityRoundUpArray(allData) {
    let getCharityRoundUpArray = []
    let feesAllData = allData[0].fees
    try {
        for (let i in feesAllData) {
            let charityObj = {
                competitionId: feesAllData[i].competitionDetail.competitionId,
                competitionName: feesAllData[i].competitionDetail.competitionName,
                charityTitle: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail[0].roundUpName : "N/A",
                roundUpDescription: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail[0].roundUpDescription : "N/A",
                charityDetail: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail : [],
                competitionOrganisationId: feesAllData[i].competitionDetail.cOrganisationId,
                membershipMappingId: feesAllData[i].membershipDetail ? feesAllData[i].membershipDetail.membershipMappingId : 0,
            }
            let competitionIdIndex = getCharityRoundUpArray.findIndex(x => x.competitionId == feesAllData[i].competitionDetail.competitionId)
            if (competitionIdIndex === -1) {
                getCharityRoundUpArray.push(charityObj)
            }
    
        }
        let charityNoneObject = {
            competitionId: 0,
            competitionName: "None",
            charityTitle: "None",
            roundUpDescription: "",
            charityDetail: [],
            competitionOrganisationId: 0,
            membershipMappingId: 0,
        }
        getCharityRoundUpArray.push(charityNoneObject)
    } catch (error) {
        console.log("**********" + error);
    }
    
    return getCharityRoundUpArray
}

//for calculating subtotal 
function calculateSubTotal(allData) {
    let fees_All_Data = allData[0].fees
    let resultData = {
        invoiceSubtotal: 0,
        invoiceGstTotal: 0
    }
    console.log("fees_All_Data::" ,fees_All_Data);
    for (let i in fees_All_Data) {

        if (fees_All_Data[i].totalAmount.affiliateFees && fees_All_Data[i].totalAmount.affiliateGst) {
            resultData.invoiceSubtotal = Number(resultData.invoiceSubtotal) + Number(fees_All_Data[i].totalAmount.affiliateFees) +
                Number(fees_All_Data[i].totalAmount.competitionFees) + Number(fees_All_Data[i].totalAmount.membershipFees)

            resultData.invoiceGstTotal = Number(resultData.invoiceGstTotal) + Number(fees_All_Data[i].totalAmount.affiliateGst) +
                Number(fees_All_Data[i].totalAmount.competitionGst) + Number(fees_All_Data[i].totalAmount.membershipGst)
        }
        else {
            resultData.invoiceSubtotal = Number(resultData.invoiceSubtotal) +
                Number(fees_All_Data[i].totalAmount.competitionFees) + Number(fees_All_Data[i].totalAmount.membershipFees)

            resultData.invoiceGstTotal = Number(resultData.invoiceGstTotal) +
                Number(fees_All_Data[i].totalAmount.competitionGst) + Number(fees_All_Data[i].totalAmount.membershipGst)
        }

    }
    return resultData
}


//for calculating charity  amount 
function charityAppliedAmount(total, charityId) {
    let charityIdAmount = 1
    if (charityId == 1) {
        charityIdAmount = 1
    }
    if (charityId == 2) {
        charityIdAmount = 5
    }
    if (charityId == 3) {
        charityIdAmount = 10
    }
    if (total % charityIdAmount === 0) {
        return charityIdAmount
    } else {
        return ((Math.ceil(total / charityIdAmount) * charityIdAmount) - total).toFixed(2)
    }
}

//for calculating charity  amount 
function set_Charity_Selected(invoiceData) {
    let charitySelected = {
        roundUpId: 0,
        charitySelectedId: 0,
        charityValue: 0,
        competitionId: 0,
        competitionOrganisationId: 0,
        membershipMappingId: 0,
    }
    let charity_Selected_get_data = invoiceData[0].charitySelected ? invoiceData[0].charitySelected : null
    if (charity_Selected_get_data) {
        charitySelected.roundUpId = charity_Selected_get_data.roundUpId
        charitySelected.charitySelectedId = charity_Selected_get_data.charitySelectedId
        charitySelected.charityValue = charity_Selected_get_data.charityValue
        charitySelected.competitionId = charity_Selected_get_data.competitionId
        charitySelected.competitionOrganisationId = charity_Selected_get_data.organisationId
        charitySelected.membershipMappingId = charity_Selected_get_data.membershipProductMappingId
    }
    return charitySelected
}

//for  showing charity after succesful payment 
function makeCharitySuccessData(charitySelected, charityRoundUpFilter) {
    let competitionId = charitySelected.competitionId
    let charity_Selected = {
        charityTitle: "",
        roundUpDescription: "",
    }
    if (competitionId > 0) {
        let index = charityRoundUpFilter.findIndex(x => x.competitionId == competitionId)
        if (index > -1) {
            charity_Selected.charityTitle = charityRoundUpFilter[index].charityTitle
            charity_Selected.roundUpDescription = charityRoundUpFilter[index].roundUpDescription
        }
    }
    return charity_Selected
}

//for making affiliate detail array for showing on right top corner
function getAffiliteDetailArray(allData) {
    let getAffiliteDetailArray = []
    let fees_All_Data = allData[0].fees
    for (let i in fees_All_Data) {
        if (fees_All_Data[i].isDirect == 1) {
            let directCompObject = {
                organisationId: fees_All_Data[i].competitionDetail.cOrganisationId,
                organisationName: fees_All_Data[i].competitionDetail.cOrganisationName,
                organiationEmailId: fees_All_Data[i].competitionDetail.cOrganiationEmailId,
                organiationPhoneNo: fees_All_Data[i].competitionDetail.cOrganiationPhoneNo,
            }
            let organisationIdIndex = getAffiliteDetailArray.findIndex(x => x.organisationId == fees_All_Data[i].competitionDetail.cOrganisationId)
            if (organisationIdIndex === -1) {
                getAffiliteDetailArray.push(directCompObject)
            }
        } else {
            let affiliateCompObject = {
                organisationId: fees_All_Data[i].affiliateDetail.aOrganisationId,
                organisationName: fees_All_Data[i].affiliateDetail.aOrganisationName,
                organiationEmailId: fees_All_Data[i].affiliateDetail.aOrganiationEmailId,
                organiationPhoneNo: fees_All_Data[i].affiliateDetail.aOrganiationPhoneNo,
            }
            let organisationIdIndex = getAffiliteDetailArray.findIndex(x => x.organisationId == fees_All_Data[i].affiliateDetail.aOrganisationId)
            if (organisationIdIndex === -1) {
                getAffiliteDetailArray.push(affiliateCompObject)
            }
        }
    }
    return getAffiliteDetailArray
}


function stripe(state = initialState, action) {
    switch (action.type) {

        ///******fail and error handling */
        case ApiConstants.API_STRIPE_API_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_STRIPE_API_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        ///get invoice
        case ApiConstants.API_GET_INVOICE_LOAD:
            return {
                ...state,
                onLoad: true,
                error: null,

            }

        case ApiConstants.API_GET_INVOICE_SUCCESS:
            let invoicedata = isArrayNotEmpty(action.result) ? action.result : []
            console.log("**************0");
            let charityRoundUpData = getCharityRoundUpArray(invoicedata)
            console.log("**************1");
            let getAffiliteDetailData = getAffiliteDetailArray(invoicedata)
            console.log("**************2");
            let calculateSubTotalData = calculateSubTotal(invoicedata)
            console.log("**************3");
            state.subTotalFees = calculateSubTotalData.invoiceSubtotal
            console.log("**************4");
            state.subTotalGst = calculateSubTotalData.invoiceGstTotal
            console.log("**************5");
            state.charityRoundUpFilter = charityRoundUpData
            console.log("**************6");
            state.getAffiliteDetailData = getAffiliteDetailData
            console.log("**************7");
            state.getInvoicedata = action.result
            let charity_Selected = set_Charity_Selected(invoicedata)
            console.log("**************8");
            state.charitySelected = charity_Selected
            state.amountTotal = Number(calculateSubTotalData.invoiceSubtotal) + Number(calculateSubTotalData.invoiceGstTotal) + Number(charity_Selected.charityValue)
            console.log("**************9");
            state.fixedTotal = Number(calculateSubTotalData.invoiceSubtotal) + Number(calculateSubTotalData.invoiceGstTotal)
            console.log("**************10");
            let showCharitySuccessData = makeCharitySuccessData(charity_Selected, charityRoundUpData)
            console.log("**************11");
            state.showCharitySuccessData = showCharitySuccessData
            return {
                ...state,
                onLoad: false,
            }

        //////onchange charity roundup data
        case ApiConstants.API_ONCHANGE_CHARITY_ROUNDUP_DATA_DATA:
            let charityAllData = JSON.parse(JSON.stringify(state.charityRoundUpFilter))
            let fixed__Total = JSON.parse(JSON.stringify(state.fixedTotal))
            if (action.key == "competitionId") {
                let competitionIdIndex = charityAllData.findIndex(x => x.competitionId == action.value)
                if (competitionIdIndex > -1) {
                    state.charitySelected.competitionOrganisationId = charityAllData[competitionIdIndex].competitionOrganisationId
                    state.charitySelected.membershipMappingId = charityAllData[competitionIdIndex].membershipMappingId

                    if (isArrayNotEmpty(charityAllData[competitionIdIndex].charityDetail)) {
                        let roundUpSelectedId = charityAllData[competitionIdIndex].charityDetail[0].charitySelectedId
                        state.charitySelected.charitySelectedId = roundUpSelectedId
                        state.charitySelected.roundUpId = charityAllData[competitionIdIndex].charityDetail[0].roundUpId
                        let charityApplied_Value = charityAppliedAmount(state.fixedTotal, roundUpSelectedId)
                        state.amountTotal = Number(fixed__Total) + Number(charityApplied_Value)
                        state.charitySelected.charityValue = Number(charityApplied_Value)
                    }
                    else {
                        state.charitySelected.charitySelectedId = 0
                        state.charitySelected.roundUpId = 0
                        state.charitySelected.charityValue = 0
                        state.amountTotal = Number(fixed__Total)
                    }

                }
                state.charitySelected.competitionId = action.value
            }
            if (action.key == "charitySelectedId") {
                let roundUpIDIndex = isArrayNotEmpty(action.charityItem.charityDetail) && action.charityItem.charityDetail.findIndex(x => x.charitySelectedId == action.value)
                if (roundUpIDIndex > -1) {
                    state.charitySelected.roundUpId = action.charityItem.charityDetail[roundUpIDIndex].roundUpId
                }
                state.charitySelected.charitySelectedId = action.value
                state.charitySelected.competitionId = action.charityItem.competitionId
                state.charitySelected.competitionOrganisationId = action.charityItem.competitionOrganisationId
                state.charitySelected.membershipMappingId = action.charityItem.membershipMappingId
                let charityAppliedValue = charityAppliedAmount(state.fixedTotal, action.value)
                state.amountTotal = Number(fixed__Total) + Number(charityAppliedValue)
                state.charitySelected.charityValue = Number(charityAppliedValue)
            }
            return {
                ...state,
                onLoad: false,
            }


        ////invoice save post api
        case ApiConstants.API_SAVE_INVOICE_LOAD:
            return {
                ...state,
                onLoad: true,
                error: null,

            }

        case ApiConstants.API_SAVE_INVOICE_SUCCESS:
            let saveInvoiceSuccessData = action.result.data
            state.invoiceId = saveInvoiceSuccessData.invoiceId
            state.transactionId = saveInvoiceSuccessData.transactionDetails ? saveInvoiceSuccessData.transactionDetails.transactionId : 0
            return {
                ...state,
                onLoad: false,
                error: null,
            }

        ////////get invoice status
        case ApiConstants.API_GET_INVOICE_STATUS_LOAD:
            return {
                ...state,
                onLoad: true,
                error: null,

            }

        case ApiConstants.API_GET_INVOICE_STATUS_SUCCESS:
            let getInvoiceStatusSuccessData = action.result.data
            state.invoiceId = getInvoiceStatusSuccessData ? getInvoiceStatusSuccessData.invoiceId : 0
            state.transactionId = getInvoiceStatusSuccessData ? getInvoiceStatusSuccessData.transactionId ?
                getInvoiceStatusSuccessData.transactionId : 0 : 0
            return {
                ...state,
                onLoad: false,
                error: null,
            }
        default:
            return state;
    }
}

export default stripe;
