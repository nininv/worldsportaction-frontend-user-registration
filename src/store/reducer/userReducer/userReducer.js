import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { JsonWebTokenError } from "jsonwebtoken";

let affiliate = {
    affiliateId: 0,
    affiliateOrgId: 0,
    organisationTypeRefId: 0,
    affiliatedToOrgId: 0,
    organisationId: 0,
    name: '',
    street1: '',
    street2: '',
    suburb: '',
    phoneNo: '',
    city: '',
    postalCode: '',
    stateRefId: 0,
    whatIsTheLowestOrgThatCanAddChild: 0,
    contacts: []
}

let affiliateListObj = {
    affiliateId: 0,
    affiliateToOrgId: 0,
    affiliateOrgId: 0,
    affiliateName: '',
    affiliatedToName: '',
    organisationTypeRefName: '',
    contact1Name: '',
    contact2Name: '',
    statusRefName: ''
}

let affiliateToObj = {
    affiliateTo: [],
    organisationTypes: [],
    organisationName: ''

}

const initialState = {
    onLoad: false,
    affiliateOnLoad: false,
    affiliateToOnLoad: false,
    affiliateOurOrgOnLoad: false,
    error: null,
    result: [],
    status: 0,
    affiliate: { affiliate },
    affiliateEdit: {},
    affiliateOurOrg: affiliate,
    affiliateList: [],
    affiliateTo: {},
    roles: [],
    userRolesEntity: [],
    affiliateListPage: 1,
    affiliateListTotalCount: 1,
    venueOragnasation: [],
    allUserOrganisationData: [],
    getUserOrganisation: [],

};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_USER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_USER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        // get Role Entity List for current  user
        case ApiConstants.API_ROLE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_ROLE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                roles: action.result,
                status: action.status
            };

        // User Role Entity List for current  user
        case ApiConstants.API_URE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_URE_SUCCESS:

            return {
                ...state,
                onLoad: false,
                userRoleEntity: action.result,
                status: action.status
            };

        case ApiConstants.API_AFFILIATES_LISTING_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_AFFILIATES_LISTING_SUCCESS:
            let data = action.result;
            // console.log("DATA::" + JSON.stringify(data));

            return {
                ...state,
                onLoad: false,
                affiliateList: data.affiliates,
                affiliateListPage: data.page ? data.page.currentPage : 1,
                affiliateListTotalCount: data.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_SAVE_AFFILIATE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_AFFILIATE_SUCCESS:

            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateOnLoad: true };

        case ApiConstants.API_AFFILIATE_BY_ORGANISATION_SUCCESS:
            let affiliateData = action.result;

            return {
                ...state,
                onLoad: false,
                affiliateOnLoad: false,
                affiliateEdit: affiliateData,
                status: action.status
            };
        case ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateOurOrgOnLoad: true };

        case ApiConstants.API_AFFILIATE_OUR_ORGANISATION_SUCCESS:
            let affiliateOurOrgData = action.result;

            return {
                ...state,
                onLoad: false,
                affiliateOurOrgOnLoad: false,
                affiliateOurOrg: affiliateOurOrgData,
                status: action.status
            };
        case ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD:
            return { ...state, onLoad: true, affiliateToOnLoad: true };

        case ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS:
            let affiliateToData = action.result;

            return {
                ...state,
                onLoad: false,
                affiliateTo: affiliateToData,
                affiliateToOnLoad: false,
                status: action.status
            };
        case ApiConstants.UPDATE_AFFILIATE:

            let oldData = state.affiliateEdit;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            oldData[getKey] = updatedValue;
            return { ...state, error: null };

        case ApiConstants.UPDATE_ORG_AFFILIATE:

            let oldOrgData = state.affiliateOurOrg;
            let updatedOrgValue = action.updatedData;
            let getOrgKey = action.key;
            oldOrgData[getOrgKey] = updatedOrgValue;
            return { ...state, error: null };

        case ApiConstants.UPDATE_NEW_AFFILIATE:

            let oldAffiliateData = state.affiliate.affiliate;
            let updatedVal = action.updatedData;
            let key = action.key;
            oldAffiliateData[key] = updatedVal;

            return { ...state, error: null };



        //Get oragnasation for add venue 
        case ApiConstants.API_ORGANISATION_LOAD:
            return { ...state, onLoad: true, error: null }

        case ApiConstants.API_ORGANISATION_SUCCESS:
            return {
                ...state,
                venueOragnasation: action.result,
                onLoad: false,
                error: null,
                status: action.status
            }

        //////delete the Affiliate 
        case ApiConstants.API_AFFILIATE_DELETE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_AFFILIATE_DELETE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };


        /////get particular user organisation 
        case ApiConstants.API_GET_USER_ORGANISATION_LOAD:
            return { ...state, onLoad: true, error: null }

        case ApiConstants.API_GET_USER_ORGANISATION_SUCCESS:
            state.allUserOrganisationData = isArrayNotEmpty(action.result) ? action.result : []
            state.getUserOrganisation = isArrayNotEmpty(action.result) ? action.result : []

            return {
                ...state,
                onLoad: false,
                error: null,
                status: action.status
            }

        ////onchange user organisation data
        case ApiConstants.ONCHANGE_USER_ORGANISATION:
            let allorgData = JSON.parse(JSON.stringify(state.allUserOrganisationData))
            let organisationIndex = allorgData.findIndex(
                x =>
                    x.organisationUniqueKey ==
                    action.organisationData.organisationUniqueKey
            );
            allorgData.splice(organisationIndex, 1)
            state.getUserOrganisation = allorgData
            return {
                ...state,
                onLoad: false,
                error: null
            };

        default:
            return state;
    }
}


export default userReducer;