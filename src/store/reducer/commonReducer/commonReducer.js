import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    weekDays: [],
    stateList: [],
    daysList: [],
    registrationOtherInfoOnLoad: false,
    venueList: [],
    addVenueSuccessMsg: "",
    gradesReferenceData: [],
    favouriteTeamsList: [],
    firebirdPlayerList: [],
    registrationOtherInfoList: [],
    countryList: [],
    nationalityList: [],
    heardByList: [],
    playerPositionList: [],
    genderList: []
};

function commonReducerState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_TIME_SLOT_INIT_LOAD:
            return { ...state }
        case ApiConstants.API_TIME_SLOT_INIT_SUCCESS:
            return {
                ...state,
                applyVenue: action.result.ApplyToVenue,
                timeSlotRotation: action.result.TimeslotRotation,
                timeSlotGeneration: action.result.TimeslotGeneration,
                weekDays: action.result.Day
            };

        ////Common Ref Case
        case ApiConstants.API_GET_COMMON_REF_DATA_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_COMMON_REF_DATA_SUCCESS:
            return {
                ...state,
                onLoad: false,
                stateList: action.result.State,
                daysList: action.result.Day,
                status: action.status
            };

        ///////get the grades reference data 
        case ApiConstants.API_GRADES_REFERENCE_LIST_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GRADES_REFERENCE_LIST_SUCCESS:
            console.log(action, 'gradesReferenceData')
            return {
                ...state,
                status: action.status,
                gradesReferenceData: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the Favourite Team List 
        case ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_FAVOURITE_TEAM_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                favouriteTeamsList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the Firebird Player List 
        case ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                firebirdPlayerList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

         ///////get the  registration other info 
         case ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD:
            return { ...state, registrationOtherInfoOnLoad: true, error: null };

        case ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                registrationOtherInfoList: isArrayNotEmpty(action.result) ? action.result : [],
                registrationOtherInfoOnLoad: false,
                error: null
            };

        ///////get the  country list
        case ApiConstants.API_COUNTRY_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_COUNTRY_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                countryList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the  nationality list
        case ApiConstants.API_NATIONALITY_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_NATIONALITY_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                nationalityList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };
        ///////get the  HeardBy list
        case ApiConstants.API_HEARDBY_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_HEARDBY_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                heardByList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        ///////get the  Player Position Reference
        case ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_PLAYER_POSITION_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                playerPositionList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        case ApiConstants.Search_Venue_updated:

            return { ...state, venueList: action.filterData }

        case ApiConstants.CLEAR_FILTER_SEARCH:
            console.log('Called clear Filter',state.mainVenueList)
            // state.venueList= [...state.mainVenueList]
            return {
                
                ...state,
                venueList: [...state.mainVenueList],
            }
     
        ///////get the  Gender list
        case ApiConstants.API_GENDER_REFERENCE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GENDER_REFERENCE_SUCCESS:
            return {
                ...state,
                status: action.status,
                genderList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                error: null
            };

        default:
            return state;
    }
}

export default commonReducerState;