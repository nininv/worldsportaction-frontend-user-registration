import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { getAge, deepCopyFunction } from '../../../util/helpers';

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    registrationSelection: [
        { id: 1, value: "De-register", helpMsg: "What is de-registration? I am leaving netball and no longer want to participate in Netball.I have not taken the court in training, grading or competition games." },
        { id: 2, value: "Transfer", helpMsg: "What is a transfer? I am wanting to move to another Netball Club or Association for the upcoming season." }
    ],
    registrationOption: 0,
    DeRegistionMainOption: [
        { id: 1, value: "Yes" },
        { id: 2, value: "No" }
    ],
    selectedDeRegistionMainOption: 0,
    deRegistionOption: [
        { id: 1, value: "I am over committed with other activities and can't fit in time for netball" },
        { id: 2, value: "I have been injured or health reason(not netball related" },
        { id: 3, value: "Decided not to participant in netball" },
        { id: 4, value: "Moving to a different geographical area" },
        { id: 5, value: "Other" },
    ],
    selectedDeRegistionOption: 0,
    transferOption: [
        { id: 1, value: "Moving to another Netball Club or Association for the upcoming season" },
        { id: 2, value: "No team available in current Club or Association" },
        { id: 3, value: "Other" },

    ],
    selectedTransferOption: 0,
    deRegistionOther: "",
    transferOther: "",
    email: "",
    mobileNumber: "",
    userName: ""


}

function deRegistrationReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_UPDATE_DE_REGISTRATION:
            if (action.key == "registrationOption") {
                state.registrationOption = action.value
                state.selectedDeRegistionMainOption = 1
            }
            if (action.key == "selectedDeRegistionMainOption") {
                state.selectedDeRegistionMainOption = action.value
            }
            if (action.key == "selectedDeRegistionOption") {
                state.selectedDeRegistionOption = action.value
            }
            if (action.key == "deRegistionOther") {
                state.deRegistionOther = action.value
            }
            if (action.key == "transferOther") {
                state.transferOther = action.value
            }
            if (action.key == "selectedTransferOption") {
                state.selectedTransferOption = action.value
            }
            if (action.key == "email") {
                state.email = action.value
            }
            if (action.key == "userName") {
                state.userName = action.value
            }
            if (action.key == "mobileNumber") {
                state.mobileNumber = action.value
            }
            return {
                ...state,
                onLoad: false,
            }


        default:
            return state;
    }
}




export default deRegistrationReducer;