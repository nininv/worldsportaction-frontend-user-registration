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
}


//for making charity roundup array
function getCharityRoundUpArray(allData) {
    let getCharityRoundUpArray = []
    let feesAllData = allData[0].fees
    console.log("feesAllData", feesAllData)

    for (let i in feesAllData) {
        let charityObj = {
            competitionId: feesAllData[i].competitionDetail.competitionId,
            competitionName: feesAllData[i].competitionDetail.competitionName,
            charityTitle: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail[0].roundUpName : "N/A",
            roundUpDescription: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail[0].roundUpDescription : "N/A",
            charityDetail: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail : [],
        }
        let competitionIdIndex = getCharityRoundUpArray.findIndex(x => x.competitionId == feesAllData[i].competitionDetail.competitionId)
        if (competitionIdIndex === -1) {
            getCharityRoundUpArray.push(charityObj)
        }

    }
    console.log("getCharityRoundUpArray", getCharityRoundUpArray)
    return getCharityRoundUpArray
}

//for calculating subtotal 
function calculateSubTotal(allData) {
    let fees_All_Data = allData[0].fees
    console.log("feesAllData", fees_All_Data)
    let resultData = {
        invoiceSubtotal: 0,
        invoiceGstTotal: 0
    }
    for (let i in fees_All_Data) {
        resultData.invoiceSubtotal = Number(resultData.invoiceSubtotal) + fees_All_Data[i].totalAmount.affiliateFees ? Number(fees_All_Data[i].totalAmount.affiliateFees) : 0 +
            Number(fees_All_Data[i].totalAmount.competitionFees) + Number(fees_All_Data[i].totalAmount.membershipFees)

        resultData.invoiceGstTotal = Number(resultData.invoiceGstTotal) + fees_All_Data[i].totalAmount.affiliateGst ? Number(fees_All_Data[i].totalAmount.affiliateGst) : 0 +
            Number(fees_All_Data[i].totalAmount.competitionGst) + Number(fees_All_Data[i].totalAmount.membershipGst)
    }
    return resultData
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
            console.log("getInvoicedata", action.result)
            let invoicedata = isArrayNotEmpty(action.result) ? action.result : []
            let charityRoundUpData = getCharityRoundUpArray(invoicedata)
            let calculateSubTotalData = calculateSubTotal(invoicedata)
            console.log("calculateSubTotalData", calculateSubTotalData)
            state.subTotalFees = calculateSubTotalData.invoiceSubtotal
            state.subTotalGst = calculateSubTotalData.invoiceGstTotal
            state.charityRoundUpFilter = charityRoundUpData
            state.getInvoicedata = action.result
            return {
                ...state,
                onLoad: false,
            }


        default:
            return state;
    }
}

export default stripe;
