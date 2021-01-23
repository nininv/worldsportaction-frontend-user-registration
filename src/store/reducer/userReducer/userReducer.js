import ApiConstants from "../../../themes/apiConstants";
import { deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString, feeIsNull, formatValue } from "../../../util/helpers";
import { JsonWebTokenError } from "jsonwebtoken";
import { setPhotoUrl } from "../../../util/sessionStorage";

const teamMemberObj = {
    genderRefId: null,
    email: null,
    lastName: null,
    firstName: null,
    middleName: null,
    dateOfBirth: null,
    mobileNumber: null,
    payingFor: 0,
    emergencyFirstName: null,
    emergencyLastName: null,
    emergencyContactNumber: null,
    isRegistererAsParent: 0,
    parentOrGuardian: [],
    membershipProductTypes: []
}

const teamMembersSaveTemp = {
    competitionId: null,
    organisationId: null,
    registrationId: null,
    teamMemberRegId: null,
    existingUserId: null,
    registeringYourself: 4,
    competitionMembershipProductDivisionId: null,
    teamId: null,
    registeringPersonUserId: null,
    name: null,
    countryRefId: null,
    mobileNumber: null,
    teamName: null,
    divisions: [],
    teamMembers: [],
    registrationRestrictionTypeRefId: null
}

const teamMemberRegReviewTemp = {
    total: {
        gst: "20.90",
        total: "229.90",
        shipping: "0.00",
        subTotal: "209.00",
        targetValue: "229.90",
        charityValue: "0.00",
        transactionFee: "0.00"
    },
    yourInfo: {
        email: "manager12345@gmail.com",
        suburb: "Melbourne",
        userId: 13367,
        street1: "123 Queen St",
        street2: null,
        lastName: "12",
        firstName: "Manager123",
        postalCode: "3000",
        stateRefId: 7,
        countryRefId: 1,
        mobileNumber: "2323289348"
    },
    compParticipants: [
        {
            email: "manager12345@gmail.com",
            gender: "Female",
            payNow: "229.90",
            userId: 0,
            lastName: "12",
            teamName: "team 98765",
            firstName: "Manager123",
            dateOfBirth: "1990-01-17T00:00:00.000Z",
            noOfPlayers: null,
            payPerMatch: "0.00",
            teamMembers: {
                payingForList: [],
                notPayingForList: []
            },
            mobileNumber: "2323289348",
            participantId: "2440df41-76b3-4209-9b13-e9d86fb3d2ea",
            paymentOptions: [
                {
                    feesTypeRefId: 2,
                    paymentOptionRefId: 3
                },
                {
                    feesTypeRefId: 1,
                    paymentOptionRefId: 1
                }
            ],
            competitionName: "Single game fee test 1",
            selectedOptions: {
                vouchers: [],
                discountCodes: [],
                gameVoucherValue: null,
                selectedDiscounts: [],
                paymentOptionRefId: 1,
                isHardshipCodeApplied: 0,
                selectedSchoolRegCode: null,
                isSchoolRegCodeApplied: 0,
                nominationPayOptionRefId: 1,
                selectedGovernmentVouchers: []
            },
            organisationName: "Netball NSW",
            orgRegistrationId: 6205,
            competitionEndDate: "2021-03-27T00:00:00.000Z",
            competitionLogoUrl: "https://www.googleapis.com/download/storage/v1/b/world-sport-action-dev-c1019.appspot.com/o/competitions%2Flogo_comp_f5f531f9-720d-4bf3-8074-dfe14730d9db_1607903705789.png?generation=1607903708831697&alt=media",
            isTeamRegistration: 1,
            membershipProducts: [
                {
                    fees: {
                        affiliateFee: null,
                        membershipFee: {
                            name: "Netball NSW",
                            emailId: "netball@nsw.gov.au",
                            phoneNo: "039009000",
                            casualFee: 0,
                            casualGST: 0,
                            feesToPay: 89,
                            seasonalFee: 89,
                            seasonalGST: 8.9,
                            feesToPayGST: 8.9,
                            organisationId: "b540171a-27b3-4c69-991f-b4bf0be28159",
                            discountsToDeduct: 0,
                            membershipMappingId: 1138,
                            childDiscountsToDeduct: 0,
                            governmentVoucherAmount: 0
                        },
                        competitionOrganisorFee: {
                            name: "Netball NSW",
                            emailId: "netball@nsw.gov.au",
                            phoneNo: "039009000",
                            casualFee: 10,
                            casualGST: 1,
                            feesToPay: 0,
                            seasonalFee: 120,
                            seasonalGST: 12,
                            feesToPayGST: 0,
                            nominationFee: 0,
                            nominationGST: 0,
                            organisationId: "b540171a-27b3-4c69-991f-b4bf0be28159",
                            discountsToDeduct: 0,
                            nominationFeeToPay: 10,
                            nominationGSTToPay: 1,
                            membershipMappingId: 1138,
                            childDiscountsToDeduct: 0,
                            governmentVoucherAmount: 0
                        }
                    },
                    email: "virat015@gmail.com.invalid",
                    isPlayer: 1,
                    lastName: "A",
                    feesToPay: "229.90",
                    firstName: "Virat017",
                    divisionId: 3948,
                    divisionName: "D1",
                    mobileNumber: "1212211221",
                    discountsToDeduct: "0.00",
                    membershipTypeName: "Player",
                    membershipMappingId: 1138,
                    orgRegParticipantId: 9927,
                    membershipProductName: "Single game fee",
                    childDiscountsToDeduct: "0.00",
                    governmentVoucherAmount: null,
                    competitionMembershipProductTypeId: 5502
                }
            ],
            competitionUniqueKey: "18e47b5f-4ab3-4c77-9ff8-e32436388497",
            isTeamSeasonalUponReg: 0,
            organisationUniqueKey: "9971815e-d9cb-4d44-bba2-f5be2e12c120",
            governmentVoucherAmount: "0.00",
            registeringYourselfRefId: 1,
            competitionMembershipProductTypeIdCoach: null
        }
    ],
    securePaymentOptions: [
        {
            securePaymentOptionRefId: 1
        },
        {
            securePaymentOptionRefId: 2
        }
    ]
}

const initialState = {
    onLoad: false,
    onUpUpdateLoad: false,
    error: null,
    result: [],
    status: 0,
    roles: [],
    userRolesEntity: [],
    allUserOrganisationData: [],
    getUserOrganisation: [],
    activityPlayerOnLoad: false,
    activityPlayerList: [],
    activityPlayerPage: 1,
    activityPlayerTotalCount: 1,
    activityParentOnLoad: false,
    activityParentList: [],
    activityParentPage: 1,
    activityParentTotalCount: 1,
    activityScorerOnLoad: false,
    activityScorerList: [],
    activityScorerPage: 1,
    activityScorerTotalCount: 1,
    activityManagerOnLoad: false,
    activityManagerList: [],
    activityManagerPage: 1,
    activityManagerTotalCount: 1,
    personalData: {},
    personalEmergency: [],
    medicalData: [],
    personalByCompData: [],
    userRegistrationList: null,
    userRegistrationPage: 1,
    userRegistrationTotalCount: 1,
    userRegistrationOnLoad: false,
    onMedicalLoad: false,
    onPersonLoad: false,
    userHistoryLoad: false,
    userHistoryList: [],
    userHistoryPage: 1,
    userHistoryTotalCount: 1,
    userRole: [],
    scorerActivityRoster: [],
    scorerCurrentPage: null,
    scorerTotalCount: null,
    umpireActivityOnLoad: false,
    umpireActivityList: [],
    umpireActivityCurrentPage: 1,
    umpireActivityTotalCount: 0,
    allOrganisationList: [],
    getTeamMembersOnLoad: false,
    teamMembersDetails: null,
    teamMembersSave: deepCopyFunction(teamMembersSaveTemp),
    membershipProductsInfo: null,
    onMembershipLoad: false,
    teamMemberRegReviewList: null,
    getTeamMembersReviewOnLoad: false,
    teamMembersSaveErrorMsg: null,
    teamMemberRegId: null,
    teamMembersSaveOnLoad: false,
    teamMemberDeletion: false
};

//get User Role
function getUserRole(userRoleData) {
    let userRole = false

    for (let i in userRoleData) {
        if (userRoleData[i].roleId == 15 || userRoleData[i].roleId == 20) {
            userRole = true
            break;
        }
    }
    return userRole
}

function getUpdatedTeamMemberObj(competition) {
    try {
        let teamMemberTemp = deepCopyFunction(teamMemberObj);
        teamMemberTemp.membershipProductTypes = [];
        let filteredTeamMembershipProducts = competition.membershipProducts.filter(x => x.isTeamRegistration == 1 && x.allowTeamRegistrationTypeRefId == 1);
        for (let product of filteredTeamMembershipProducts) {
            let obj = {
                competitionMembershipProductId: product.competitionMembershipProductId,
                competitionMembershipProductTypeId: product.competitionMembershipProductTypeId,
                isPlayer: product.isPlayer,
                productTypeName: product.shortName,
                isChecked: false
            }
            teamMemberTemp.membershipProductTypes.push(obj);
        }
        return teamMemberTemp;
    } catch (ex) {
        console.log("Error in getUpdatedTeamMemberObj::" + ex);
    }
}

function upateTeamMembersSave(state) {
    try {
        let membershipProducts = state.membershipProductInfo;
        let organisation = membershipProducts[0];
        let competition = organisation.competitions[0];
        state.teamMembersSave.registrationRestrictionTypeRefId = competition.registrationRestrictionTypeRefId;
        state.teamMembersSave.teamMembers.push(getUpdatedTeamMemberObj(competition));
    } catch (ex) {
        console.log("Error in updateTeamMemberSave::" + ex);
    }
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_USER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                umpireActivityOnLoad: false,
            };

        case ApiConstants.API_USER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                umpireActivityOnLoad: false,
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

        case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS:
            let personalData = action.result;
            setPhotoUrl(personalData.photoUrl)
            let arr = [];
            if (personalData != null) {
                let obj = {
                    emergencyFirstName: personalData.emergencyFirstName,
                    emergencyLastName: personalData.emergencyLastName,
                    emergencyContactNumber: personalData.emergencyContactNumber,
                    userId: personalData.userId
                };
                arr.push(obj);
            }
            return {
                ...state,
                onLoad: false,
                personalData: personalData,
                personalEmergency: arr,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD:
            return { ...state, onPersonLoad: true };

        case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS:
            let personalByCompData = action.result;
            return {
                ...state,
                onPersonLoad: false,
                personalByCompData: personalByCompData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD:
            return { ...state, onMedicalLoad: true };

        case ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS:
            let medicalData = action.result;
            return {
                ...state,
                onMedicalLoad: false,
                medicalData: medicalData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_REGISTRATION_LOAD:
            return { ...state, userRegistrationOnLoad: true };

        case ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS:
            let userRegistrationData = action.result;
            return {
                ...state,
                userRegistrationOnLoad: false,
                userRegistrationList: userRegistrationData,
                // userRegistrationDataPage: userRegistrationData.page ? userRegistrationData.page.currentPage : 1,
                // userRegistrationDataTotalCount: userRegistrationData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_LOAD:
            return { ...state, getTeamMembersOnLoad: true };

        case ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_SUCCESS:
            let teamMembersDetailsData = action.result;
            return {
                ...state,
                getTeamMembersOnLoad: false,
                teamMembersDetails: teamMembersDetailsData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD:
            return { ...state, activityPlayerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS:
            let activityPlayerData = action.result;
            return {
                ...state,
                activityPlayerOnLoad: false,
                activityPlayerList: activityPlayerData.activityPlayers,
                activityPlayerPage: activityPlayerData.page ? activityPlayerData.page.currentPage : 1,
                activityPlayerTotalCount: activityPlayerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD:
            return { ...state, activityParentOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS:
            let activityParentData = action.result;
            return {
                ...state,
                activityParentOnLoad: false,
                activityParentList: activityParentData.activityParents,
                activityParentPage: activityParentData.page ? activityParentData.page.currentPage : 1,
                activityParentTotalCount: activityParentData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD:
            return { ...state, activityScorerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS:
            let activityScorerData = action.result;
            return {
                ...state,
                activityScorerOnLoad: false,
                activityScorerList: activityScorerData.activityScorer,
                activityScorerPage: activityScorerData.page ? activityScorerData.page.currentPage : 1,
                activityScorerTotalCount: activityScorerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD:
            return { ...state, activityManagerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS:
            let activityManagerData = action.result;
            return {
                ...state,
                activityManagerOnLoad: false,
                activityManagerList: activityManagerData.activityManager,
                activityManagerPage: activityManagerData.page ? activityManagerData.page.currentPage : 1,
                activityManagerTotalCount: activityManagerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_PROFILE_UPDATE_LOAD:
            return { ...state, onUpUpdateLoad: true };

        case ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS:
            return {
                ...state,
                onUpUpdateLoad: false,
                userProfileUpdate: action.result,
                status: action.status
            };
        case ApiConstants.API_USER_MODULE_HISTORY_LOAD:
            return { ...state, userHistoryLoad: true };

        case ApiConstants.API_USER_MODULE_HISTORY_SUCCESS:
            let userHistoryData = action.result;
            return {
                ...state,
                userHistoryLoad: false,
                userHistoryList: userHistoryData.userHistory,
                userHistoryPage: userHistoryData.page ? userHistoryData.page.currentPage : 1,
                userHistoryTotalCount: userHistoryData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_GET_USER_ROLE_LOAD:
            return { ...state, };

        case ApiConstants.API_GET_USER_ROLE_SUCCESS:
            let userRole = getUserRole(action.result)
            state.userRole = userRole
            return {
                ...state,
            };

        ////Scorer
        case ApiConstants.API_GET_SCORER_ACTIVITY_LOAD:
            return { ...state, activityScorerOnLoad: true };

        case ApiConstants.API_GET_SCORER_ACTIVITY_SUCCESS:
            return {
                ...state,
                activityScorerOnLoad: false,
                scorerActivityRoster: action.result.activityRoster,
                scorerCurrentPage: action.result.page.currentPage,
                scorerTotalCount: action.result.page.totalCount,
            };

        ////umpire activity list
        case ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_LOAD:
            return { ...state, umpireActivityOnLoad: true };

        case ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_SUCCESS:
            let umpireActivityData = action.result
            return {
                ...state,
                umpireActivityOnLoad: false,
                umpireActivityList: isArrayNotEmpty(umpireActivityData.results) ? umpireActivityData.results : [],
                umpireActivityCurrentPage: umpireActivityData.page.currentPage,
                umpireActivityTotalCount: umpireActivityData.page.totalCount,
            };

        /////////get all the organisations without authentication and userId
        case ApiConstants.API_GET_ALL_ORGANISATION_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_ALL_ORGANISATION_LIST_SUCCESS:
            state.allOrganisationList = action.result
            return {
                ...state,
                allOrganisationList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
            };

        case ApiConstants.API_ADD_CHILD_SUCCESS:
            return { ...state };

        case ApiConstants.API_ADD_PARENT_LOAD:
            return { ...state };

        case ApiConstants.API_ADD_PARENT_SUCCESS:
            return { ...state };

        case ApiConstants.API_USER_PHOTO_UPDATE_LOAD:
            return { ...state, userPhotoUpdate: true };

        case ApiConstants.API_USER_PHOTO_UPDATE_SUCCESS:
            let personalDataTemp = { ...action.result };
            personalDataTemp.userId = personalDataTemp.id;
            setPhotoUrl(personalDataTemp.photoUrl);
            let arrTemp = [];
            if (personalDataTemp != null) {
                let obj = {
                    emergencyFirstName: personalDataTemp.emergencyFirstName,
                    emergencyLastName: personalDataTemp.emergencyLastName,
                    emergencyContactNumber: personalDataTemp.emergencyContactNumber,
                    userId: personalDataTemp.userId
                };
                arrTemp.push(obj);
            }
            return {
                ...state,
                personalData: personalDataTemp,
                personalEmergency: arrTemp,
                userPhotoUpdate: false,
                status: action.status,
                error: null
            };

        case ApiConstants.API_REGISTRATION_RESEND_EMAIL_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_REGISTRATION_RESEND_EMAIL_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            }

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
            return { ...state, onMembershipLoad: true };

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
            state.membershipProductInfo = action.result;
            if (!state.teamMemberRegId) {
                state.teamMembersSave = deepCopyFunction(teamMembersSaveTemp)
                upateTeamMembersSave(state);
            }
            return {
                ...state,
                onMembershipLoad: false,
                status: action.status,
            };

        case ApiConstants.TEAM_MEMBER_SAVE_UPDATE_ACTION:
            if (action.key === "teamMembersSave") {
                state.teamMembersSave = action.data;
            } else if (action.key === "teamMember") {
                if (action.index == undefined) {
                    upateTeamMembersSave(state)
                } else {
                    state.teamMembersSave.teamMembers.splice(action.index, 1);
                    state.teamMemberDeletion = true;
                }
            } else if (action.key === "membershipProductTypes") {
                state.teamMembersSave.teamMembers[action.index].membershipProductTypes[action.subIndex].isChecked = action.data;
            } else if (action.key === "teamMemberRegId") {
                state.teamMemberRegId = action.data;
            } else if (action.key === "teamMemberDeletion") {
                state.teamMemberDeletion = false
            }
             else {
                state.teamMembersSave.teamMembers[action.index][action.key] = action.data;
            }
            return {
                ...state
            }

        case ApiConstants.API_TEAM_MEMBERS_SAVE_LOAD:
            return { ...state, teamMembersSaveOnLoad: true }

        case ApiConstants.API_TEAM_MEMBERS_SAVE_SUCCESS:
            state.teamMembersSaveOnLoad = false;
            state.teamMembersSaveErrorMsg = action.result.errorMsg ? action.result.errorMsg : null;
            state.teamMemberRegId = action.result.id ? action.result.id : null;
            return {
                ...state,
                status: action.status,
            }

        case ApiConstants.API_GET_TEAM_MEMBERS_LOAD:
            return { ...state, onLoad: true }

        case ApiConstants.API_GET_TEAM_MEMBERS_SUCCESS:
            return {
                ...state,
                status: action.status,
                teamMembersSave: action.result,
                onLoad: false,
            }

        case ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_LOAD:
            return { ...state, getTeamMembersReviewOnLoad: true }

        case ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_SUCCESS:
            return {
                ...state,
                teamMemberRegReviewList: action.result,
                status: action.status,
                getTeamMembersReviewOnLoad: false
            }

        case ApiConstants.UPDATE_TEAM_MEMBER_REVIEW_INFO:
            let reviewData = state.teamMemberRegReviewList;
            if (action.subKey === "total") {
                let type = action.key;
                let totalVal = reviewData.total.total;
                let transactionVal = 0;
                let targetVal = 0;
                if (action.value == 1) {
                    if (type === "International_CC") {
                        transactionVal = (totalVal * 3.0 / 100) + 0.30;
                    }
                    if (type === "International_AE") {
                        transactionVal = (totalVal * 2.7 / 100) + 0.30;
                    } else if (type === "DOMESTIC_CC") {
                        transactionVal = (totalVal * 2.25 / 100) + 0.30;
                    } else if (type === "direct_debit") {
                        transactionVal = (totalVal * 1.5 / 100) + 0.30;
                        if (transactionVal > 3.50) {
                            transactionVal = 3.50;
                        }
                    }
                    targetVal = feeIsNull(transactionVal) + feeIsNull(totalVal);
                    reviewData["total"]["targetValue"] = formatValue(targetVal);
                    reviewData["total"]["transactionFee"] = formatValue(transactionVal);
                } else {
                    reviewData["total"]["targetValue"] = "0.00";
                    reviewData["total"]["transactionFee"] = "0.00";
                }
            }
            return {
                ...state,
                error: null
            }
        case ApiConstants.API_TEAM_MEMBER_UPDATE_LOAD:
            return { ...state, onTeamUpdateLoad: true };

        case ApiConstants.API_TEAM_MEMBER_UPDATE_SUCCESS:
            return {
                ...state,
                onTeamUpdateLoad: false,
                teamMemberUpdate: action.result,
                status: action.status
            };
        default:
            return state;
    }
}

export default userReducer;
