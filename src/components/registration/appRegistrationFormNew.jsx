import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    Table,
    DatePicker,
    Radio,
    Form,
    Modal,
    message,
    Steps,
    Tag,
    Pagination,
    Carousel,
    Spin, notification
} from "antd";
import "./product.css";
import "../user/user.css";
import '../competition/competition.css';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getUreAction } from "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import {
    getCommonRefData,
    favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction,
    heardByReferenceAction,
    playerPositionReferenceAction,
    genderReferenceAction,
    disabilityReferenceAction,
    personRegisteringRoleReferenceAction,
    identificationReferenceAction,
    otherSportsReferenceAction,
    accreditationUmpireReferenceAction,
    accreditationCoachReferenceAction,
    walkingNetballQuesReferenceAction,
    getSchoolListAction,
    validateRegistrationCapAction,
    netSetGoTshirtSizeAction
} from '../../store/actions/commonAction/commonAction';
import {
    getUserRegistrationUserInfoAction,
    updateUserRegistrationObjectAction,
    selectParticipantAction,
    membershipProductEndUserRegistrationAction,
    updateParticipantCompetitionAction,
    updateUserRegistrationStateVarAction,
    updateParticipantAdditionalInfoAction,
    saveParticipantInfo,
    getParticipantInfoById,
    orgRegistrationRegSettingsEndUserRegAction,
    registrationExpiryCheckAction,
    getSeasonalAndCasualFees
} from '../../store/actions/registrationAction/userRegistrationAction';
import { getAge, deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString } from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import { getOrganisationId, getCompetitonId, getUserId, getAuthToken, getSourceSystemFlag } from "../../util/sessionStorage";
import CSVReader from 'react-csv-reader'
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import { get } from "jquery";
import { captializedString } from "../../util/helpers";
import { nearByOrganisations } from "../../util/geocode";
import ApiConstants from "../../themes/apiConstants";
import { regexNumberExpression } from '../../util/helpers';
// import zipcodes from  'zipcodes';

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class AppRegistrationFormNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            submitButtonText: AppConstants.next,
            showAddAnotherCompetitionView: false,
            searchAddressError: null,
            organisationId: null,
            competitionId: null,
            enabledSteps: [],
            completedSteps: [],
            singleCompModalVisible: false,
            getMembershipLoad: false,
            getParticipantByIdLoad: false,
            findAnotherCompetitionFlag: false,
            registrationId: null,
            participantId: null,
            // allCompetitions: [],
            allCompetitionsByOrgId: [],
            competitions: [],
            competitionsCountPerPage: 6,
            currentCompetitions: 1,
            organisations: [],
            postalCode: null,
            hasErrorParticipitant: false,
            hasErrorParent: [],
            hasErrorEmergency: false,
            registrationCapModalVisible: false,
            validateRegistrationCapOnLoad: false,
            validateRegistrationCapBySubmit: false,
            sameEmailValidationModalVisible: false,
            sameSomeoneEmailValidationModalVisible: false,
            hasChecked: false
        }
        this.ref = React.createRef();
        this.props.getCommonRefData();
        this.props.genderReferenceAction();
        this.props.countryReferenceAction();
        this.props.playerPositionReferenceAction();
        this.props.identificationReferenceAction();
        this.props.disabilityReferenceAction();
        this.props.favouriteTeamReferenceAction();
        this.props.firebirdPlayerReferenceAction();
        this.props.otherSportsReferenceAction();
        this.props.heardByReferenceAction();
        this.props.accreditationUmpireReferenceAction();
        this.props.accreditationCoachReferenceAction();
        this.props.walkingNetballQuesReferenceAction();
        this.props.netSetGoTshirtSizeAction();
    }

    componentDidUpdate(nextProps) {
        let registrationState = this.props.userRegistrationState;
        if (!registrationState.onMembershipLoad && this.state.getMembershipLoad) {
            this.setState({ organisations: registrationState.membershipProductInfo });
            let participantId = this.props.location.state ? this.props.location.state.participantId : null;
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            this.props.updateUserRegistrationStateVarAction("participantId", participantId);
            this.props.updateUserRegistrationStateVarAction("registrationId", registrationId);
            this.setState({ participantId: participantId, registrationId: registrationId });
            if (participantId && registrationId) {
                this.props.getParticipantInfoById(participantId, '');
                this.setState({ getParticipantByIdLoad: true })
            } else {
                if (registrationId) {
                    this.props.getParticipantInfoById('', registrationId);
                    this.setState({ getParticipantByIdLoad: true })
                }
            }
            //Set all competitins of all organisation
            // this.setAllCompetitions(registrationState.membershipProductInfo);
            this.setState({ getMembershipLoad: false });
        }

        if (!registrationState.onParticipantByIdLoad && this.state.getParticipantByIdLoad) {
            if (this.state.participantId != null) {
                this.state.completedSteps = [0, 1, 2];
                this.state.enabledSteps = [0, 1, 2];
                this.setState({
                    getParticipantByIdLoad: false,
                    completedSteps: this.state.completedSteps,
                    enabledSteps: this.state.enabledSteps
                });
                setTimeout(() => {
                    this.setParticipantDetailStepFormFields();
                }, 300);
            } else {
                this.setState({ getParticipantByIdLoad: false });
                this.selectAnotherParticipant();
            }
        }

        if (registrationState.addCompetitionFlag) {
            //calling setting service after added competition
            let payload = {
                "organisationUniqueKey": this.state.organisationId,
                "competitionUniqueKey": this.state.competitionId
            }
            this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
            this.setState({
                showAddAnotherCompetitionView: false,
                organisationId: null,
                competitionId: null
            });
            if (this.state.findAnotherCompetitionFlag) {
                this.setState({ findAnotherCompetitionFlag: false })
            }
            this.props.updateUserRegistrationStateVarAction("addCompetitionFlag", false);
            if (registrationState.expiredRegistration != null) {
                this.props.updateUserRegistrationStateVarAction("expiredRegistration", null);
            }
        }

        if (registrationState.isSavedParticipant) {
            this.props.updateUserRegistrationStateVarAction("isSavedParticipant", false);
            if (registrationState.saveValidationErrorMsg != null && registrationState.saveValidationErrorMsg.length > 0) {
                this.setState({ singleCompModalVisible: true });
            } else {
                history.push("/registrationProducts", {
                    registrationId: this.props.userRegistrationState.registrationId,
                    paymentSuccess: false
                })
            }
        }

        if (registrationState.updateExistingUserOnLoad) {
            setTimeout(() => {
                this.setParticipantDetailStepFormFields();
            }, 300);
            this.props.updateUserRegistrationStateVarAction("updateExistingUserOnLoad", false);
        }

        if (registrationState.expiredRegistrationFlag) {
            if (getOrganisationId() && getCompetitonId()) {
                let payload = {
                    organisationId: getOrganisationId(),
                    competitionId: getCompetitonId()
                }
                this.props.registrationExpiryCheckAction(payload);
            }
            this.props.updateUserRegistrationStateVarAction("expiredRegistrationFlag", false);
        }

        if (registrationState.enableSeasonalAndCasualService) {
            this.props.getSeasonalAndCasualFees(registrationState.seasionalAndCasualFeesInputObj);
            this.props.updateUserRegistrationStateVarAction("enableSeasonalAndCasualService", false);
        }

        if (registrationState.individualCompetitionNotExist == true) {
            this.setState({ organisationId: null, competitionId: null });
            this.props.updateUserRegistrationStateVarAction("individualCompetitionNotExist", false);
        }

        if (registrationState.enableValidateRegistrationCapService == true) {
            this.props.validateRegistrationCapAction(registrationState.registrationCapValidateInputObj);
            this.setState({ validateRegistrationCapOnLoad: true })
            this.props.updateUserRegistrationStateVarAction("enableValidateRegistrationCapService", false)
        }

        if (this.props.commonReducerState.onLoad == false && this.state.validateRegistrationCapOnLoad == true) {
            if (this.props.commonReducerState.status == 4) {
                this.setState({ registrationCapModalVisible: true, validateRegistrationCapBySubmit: false })
            } else {
                if (this.state.validateRegistrationCapBySubmit == true) {
                    this.stepNavigation();
                    this.setState({ validateRegistrationCapBySubmit: false });
                }
            }
            this.setState({ validateRegistrationCapOnLoad: false })
        }
    }

    componentDidMount() {
        this.props.updateUserRegistrationObjectAction(null, "registrationObj");
        this.getUserInfo();
        this.props.membershipProductEndUserRegistrationAction({});
        this.setState({ getMembershipLoad: true });
        if (getOrganisationId() != null && getCompetitonId() != null) {
            this.setState({
                showAddAnotherCompetitionView: false,
                organisationId: getOrganisationId(),
                competitionId: getCompetitonId()
            })
        }
    }

    // setAllCompetitions = (membershipProductInfo) => {
    //     try{
    //         let allCompetitionsTemp = [];
    //         for(let org of membershipProductInfo){
    //             allCompetitionsTemp.push.apply(allCompetitionsTemp,org.competitions);
    //         }
    //         this.setState({allCompetitions: allCompetitionsTemp});
    //         this.setState({competitions: allCompetitionsTemp.slice(0,this.state.competitionsCountPerPage)});
    //     }catch(ex){
    //         console.log("Error in setAllCompetitions"+ex);
    //     }
    // }

    changeStep = (current) => {
        const { registrationObj } = this.props.userRegistrationState;
        if (this.state.enabledSteps.includes(current)) {
            if (this.state.currentStep == 1 && this.state.enabledSteps.includes(2)) {
                let registrationCapValidationInputObj = this.getRegistrationCapValidationInputObj(registrationObj);
                console.log("registrationCapValidationInputObj.products.find(x => x.competitionId)", registrationCapValidationInputObj.products.find(x => x.competitionId))
                if (registrationCapValidationInputObj.products.find(x => x.competitionId)) {
                    this.props.validateRegistrationCapAction(registrationCapValidationInputObj);
                    this.setState({ validateRegistrationCapBySubmit: true, validateRegistrationCapOnLoad: true });
                    return;
                }
            }
            this.setState({ currentStep: current });
            this.scrollToTop();
        }
        if (current == 0) {
            this.setState({ submitButtonText: AppConstants.next })
            setTimeout(() => {
                this.setParticipantDetailStepFormFields();
            }, 300);
        } else if (current == 1) {
            if (this.state.enabledSteps.includes(1)) {
                this.setState({ submitButtonText: AppConstants.addCompetitionAndMembership });
                setTimeout(() => {
                    for(let i in registrationObj.competitions){
                        this.props.form.setFieldsValue({[`tShirtSizeRefId${i}`] : registrationObj.competitions[i].tShirtSizeRefId});
                    }
                }, 300);
            }
        } else {
            if (this.state.enabledSteps.includes(2)) {
                this.setState({ submitButtonText: AppConstants.signupToCompetition });
                setTimeout(() => {
                    this.setParticipantAdditionalInfoStepFormFields();
                }, 300);
            }
        }
    }

    scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    setParticipantDetailStepFormFields() {
        const { registrationObj } = this.props.userRegistrationState;
        try {
            if (registrationObj) {
                this.props.form.setFieldsValue({
                    [`genderRefId`]: registrationObj.genderRefId,
                    [`dateOfBirth`]: registrationObj.dateOfBirth ? moment(registrationObj.dateOfBirth, "MM-DD-YYYY") : null,
                    [`participantFirstName`]: registrationObj.firstName,
                    [`participantMiddleName`]: registrationObj.middleName,
                    [`participantLastName`]: registrationObj.lastName,
                    [`participantMobileNumber`]: registrationObj.mobileNumber,
                    [`participantEmail`]: registrationObj.email,
                    [`emergencyFirstName`]: registrationObj.emergencyFirstName,
                    [`emergencyLastName`]: registrationObj.emergencyLastName,
                    [`emergencyContactNumber`]: registrationObj.emergencyContactNumber,
                });
                if (registrationObj.selectAddressFlag) {
                    this.setParticipantDetailStepAddressFormFields("selectAddressFlag");
                }
                if (registrationObj.manualEnterAddressFlag) {
                    this.setParticipantDetailStepAddressFormFields("manualEnterAddressFlag");
                }
                {
                    (registrationObj.parentOrGuardian || []).map((parent, pIndex) => {
                        this.props.form.setFieldsValue({
                            [`parentFirstName${pIndex}`]: parent.firstName,
                            [`parentMiddleName${pIndex}`]: parent.middleName,
                            [`parentLastName${pIndex}`]: parent.lastName,
                            [`parentMobileNumber${pIndex}`]: parent.mobileNumber,
                            [`parentEmail${pIndex}`]: parent.email,
                        });
                        if (parent.selectAddressFlag) {
                            this.setParticipantDetailStepParentAddressFormFields("selectAddressFlag", parent, pIndex);
                        }
                    })
                }
            }
        } catch (ex) {
            console.log("Error in setParticipantDetailStepFormFields" + ex);
        }
    }

    setParticipantAdditionalInfoStepFormFields = () => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            let additionalInfo = registrationObj.additionalInfo;
            if (registrationObj) {
                this.props.form.setFieldsValue({
                    [`additionalInfoCountryRefId`]: additionalInfo.countryRefId,
                    [`additionalInfoAnyExistingMedialCondition`]: additionalInfo.existingMedicalCondition,
                    [`additionalInfoAnyRedularMedicalConditions`]: additionalInfo.regularMedication,
                    [`additionalInfoInjury`]: additionalInfo.injuryInfo,
                    [`additionalInfoAllergies`]: additionalInfo.allergyInfo,
                    [`additionalInfoTeamYouFollow`]: additionalInfo.favouriteTeamRefId,
                    [`additionalInfoPlayingOtherParticipantSports`]: additionalInfo.otherSportsInfo ? additionalInfo.otherSportsInfo : [],
                    [`additionalInfoFavoriteBird`]: additionalInfo.favouriteTeamRefId,
                    [`additionalInfoDisablityCareNumber`]: additionalInfo.disabilityCareNumber,
                    [`additionalInfoHeartTrouble`]: additionalInfo.walkingNetball.heartTrouble,
                    [`additionalInfoChestPain`]: additionalInfo.walkingNetball.chestPain,
                    [`additionalInfoFaintOrSpells`]: additionalInfo.walkingNetball.faintOrSpells,
                    [`additionalInfoBloodPressure`]: additionalInfo.walkingNetball.bloodPressure,
                    [`additionalInfoJointOrBoneProblem`]: additionalInfo.walkingNetball.jointOrBoneProblem,
                    [`additionalInfoPhysicalActivity`]: additionalInfo.walkingNetball.physicalActivity,
                    [`additionalInfoPregnant`]: additionalInfo.walkingNetball.pregnant,
                    [`additionalInfoLowerBackProblem`]: additionalInfo.walkingNetball.lowerBackProblem,
                    [`additionalInfoProvideFurtherDetails`]: additionalInfo.walkingNetballInfo
                });
            }
        } catch (ex) {
            console.log("Error in setParticipantAdditionalInfoStepFormFields::" + ex);
        }
    }

    setParticipantDetailStepAddressFormFields = (key) => {
        try {
            const { registrationObj, userInfo } = this.props.userRegistrationState;
            let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj?.userId);
            let selectAddressDropDownList = this.getSelectAddressDropdown(user);
            let selectAddressDropDownUserAddress = selectAddressDropDownList?.find(x => x.userId == registrationObj?.userId)
            if (key == "selectAddressFlag") {
                if (isArrayNotEmpty(userInfo)) {
                    this.props.form.setFieldsValue({
                        [`participantSelectAddress`]: this.getAddress(selectAddressDropDownUserAddress)
                    });
                    this.onChangeSetParticipantValue(selectAddressDropDownUserAddress?.userId, "addOrRemoveAddressBySelect")
                }
            } else if (key == "manualEnterAddressFlag") {
                this.props.form.setFieldsValue({
                    [`participantStreet1`]: registrationObj.street1,
                    [`participantSuburb`]: registrationObj.suburb,
                    [`participantStateRefId`]: registrationObj.stateRefId,
                    [`participantPostalCode`]: registrationObj.postalCode,
                    [`participantCountryRefId`]: registrationObj.countryRefId
                });
            }
        } catch (ex) {
            console.log("Error in setParticipantDetailStepAddressFormFields" + ex);
        }
    }

    setParticipantDetailStepParentAddressFormFields = (key, parent, pIndex) => {
        try {
            const { registrationObj, userInfo } = this.props.userRegistrationState;
            let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj.userId);
            let selectAddressDropDownList = this.getSelectAddressDropdown(user);
            let selectAddressDropDownParentAddress = selectAddressDropDownList?.find(x => x.userId == parent.userId);
            if (key == "selectAddressFlag") {
                if (isArrayNotEmpty(userInfo)) {
                    this.props.form.setFieldsValue({
                        [`parentSelectAddress${pIndex}`]: this.getAddress(selectAddressDropDownParentAddress),
                    });
                    this.onChangeSetParentValue(selectAddressDropDownParentAddress.userId, "addOrRemoveAddressBySelect", pIndex)
                }
            } else if (key == "manualEnterAddressFlag") {
                this.props.form.setFieldsValue({
                    [`parentStreet1${pIndex}`]: parent.street1,
                    [`parentSuburb${pIndex}`]: parent.suburb,
                    [`parentStateRefId${pIndex}`]: parent.stateRefId,
                    [`parentCountryRefId${pIndex}`]: parent.countryRefId,
                    [`parentPostalCode${pIndex}`]: parent.postalCode,
                });
            }
        } catch (ex) {
            console.log("Error in setParticipantDetailStepParentAddressFormFields" + ex);
        }
    }

    getAddress = (addressObject) => {
        try {
            if (addressObject) {
                const { stateList, countryList } = this.props.commonReducerState;
                const state = stateList.length > 0 && addressObject.stateRefId > 0
                    ? stateList.find((state) => state.id === addressObject.stateRefId).name
                    : null;
                const country = countryList.length > 0 && addressObject.countryRefId > 0
                    ? countryList.find((country) => country.id === addressObject.countryRefId).description
                    : null;

                let defaultAddress = '';
                if (state) {
                    defaultAddress = (addressObject.street1 ? addressObject.street1 + ', ' : '') +
                        (addressObject.suburb ? addressObject.suburb + ', ' : '') +
                        (addressObject.postalCode ? addressObject.postalCode + ', ' : '') +
                        (state ? state + ', ' : '') +
                        (country ? country + '.' : '');
                    return defaultAddress;
                }
            }
        } catch (ex) {
            console.log("Error in getPartcipantParentAddress" + ex);
        }
    }

    getUserInfo = () => {
        if (getUserId() != 0) {
            let payload = {
                competitionUniqueKey: getCompetitonId(),
                organisationId: getOrganisationId(),
                userId: getUserId()
            }
            this.setState({ getUserLoad: true });
            this.props.getUserRegistrationUserInfoAction(payload);
        } else {
            this.props.updateUserRegistrationStateVarAction("userInfo", [])
        }
    }

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    setImage = (data, key) => {
        if (data.files[0] !== undefined) {
            if (key == "participantPhoto") {
                let photoUrl = URL.createObjectURL(data.files[0]);
                this.props.updateUserRegistrationObjectAction(photoUrl, "photoUrl");
                let particpantPhoto = data.files[0];
                this.props.updateUserRegistrationObjectAction(particpantPhoto, "participantPhoto");
            }
        }
    }

    addOrSelectParticipant = (userId) => {
        this.props.selectParticipantAction(userId, "userId");
    }

    getParentObj = () => {
        let parentObj = {
            "tempParentId": null,
            "userId": 0,
            "firstName": null,
            "middleName": null,
            "lastName": null,
            "mobileNumber": null,
            "email": null,
            "street1": null,
            "street2": null,
            "suburb": null,
            "stateRefId": null,
            "countryRefId": 1,
            "postalCode": null,
            "isSameAddress": false,
            "selectAddressFlag": true,
            "addNewAddressFlag": false,
            "manualEnterAddressFlag": false
        }
        return parentObj;
    }

    getSchoolList = (stateRefId) => {
        this.onChangeSetAdditionalInfo(null, "schoolId");
        this.props.getSchoolListAction(stateRefId);
    }

    onChangeSetParticipantValue = (value, key) => {
        const { registrationObj, parents, userInfo } = this.props.userRegistrationState;
        if (key == "addOrRemoveAddressBySelect") {
            if (value) {
                let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj.userId);
                let participantAddress = this.getSelectAddressDropdown(user).find(x => x.userId == value);
                registrationObj.street1 = participantAddress.street1;
                registrationObj.street2 = participantAddress.street2;
                registrationObj.postalCode = participantAddress.postalCode;
                registrationObj.suburb = participantAddress.suburb;
                registrationObj.stateRefId = participantAddress.stateRefId;
                registrationObj.countryRefId = participantAddress.countryRefId;
                this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
            } else {
                this.clearParticipantAddress(registrationObj);
            }
        } else if (key == "stateRefId") {
            this.getSchoolList(value);
            this.props.updateUserRegistrationObjectAction(value, key);
        }
        else if (key == "mobileNumber") {
            if (value.length === 10) {
                this.setState({
                    hasErrorParticipitant: false
                })
                this.props.updateUserRegistrationObjectAction(regexNumberExpression(value), key);
            } else if (value.length < 10) {
                this.props.updateUserRegistrationObjectAction(regexNumberExpression(value), key);
                this.setState({
                    hasErrorParticipitant: true
                })
            }
            setTimeout(() => {
                this.props.form.setFieldsValue({
                    [`participantMobileNumber`]: registrationObj.mobileNumber,
                });
            }, 300);
        }
        else if (key == 'emergencyContactNumber') {
            if (value.length === 10) {
                this.setState({
                    hasErrorEmergency: false
                })
                this.props.updateUserRegistrationObjectAction(regexNumberExpression(value), key);
            } else if (value.length < 10) {
                this.props.updateUserRegistrationObjectAction(regexNumberExpression(value), key);
                this.setState({
                    hasErrorEmergency: true
                })

            }

            if (!regexNumberExpression(value)) {
                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        [`emergencyContactNumber`]: null,
                    });
                }, 300);
            }


        }
        else {
            this.props.updateUserRegistrationObjectAction(value, key);
            // console.log("update field", registrationObj);
        }

        if (key == "dateOfBirth" || key == "referParentEmail") {
            setTimeout(() => {
                this.props.form.setFieldsValue({
                    [`participantEmail`]: registrationObj.email ? registrationObj.email : null
                });
            });
            if (key == 'referParentEmail' && value == true) {

                // this.setState({
                //     sameEmailValidationModalVisible: true
                // })
            }

            if (key == "dateOfBirth") {
                if (getAge(value) < 18) {
                    if (!isArrayNotEmpty(registrationObj.parentOrGuardian)) {
                        this.addParent("add");
                    }
                } else {
                    this.addParent("removeAllParent")
                }
            }
        }
    }

    clearParticipantAddress = (registrationObj) => {
        registrationObj.street1 = null;
        registrationObj.street2 = null;
        registrationObj.postalCode = null;
        registrationObj.suburb = null;
        registrationObj.stateRefId = null;
        registrationObj.countryRefId = null;
        this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
    }

    getUpdatedParentObj = (parent) => {
        try {
            const { registeredParents } = this.props.userRegistrationState;
            if (isArrayNotEmpty(registeredParents)) {
                parent.firstName = registeredParents[0].firstName;
                parent.lastName = registeredParents[0].lastName;
                parent.email = registeredParents[0].email;
                parent.mobileNumber = registeredParents[0].mobileNumber;
                parent.street1 = registeredParents[0].street1;
                parent.street2 = registeredParents[0].street2;
                parent.suburb = registeredParents[0].suburb;
                parent.stateRefId = registeredParents[0].stateRefId;
                parent.postalCode = registeredParents[0].postalCode;
                parent.countryRefId = registeredParents[0].countryRefId;
                parent.addNewAddressFlag = false;
                parent.manualEnterAddressFlag = true;

                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        [`parentFirstName${0}`]: parent.firstName,
                        [`parentMiddleName${0}`]: parent.middleName,
                        [`parentLastName${0}`]: parent.lastName,
                        [`parentMobileNumber${0}`]: parent.mobileNumber,
                        [`parentEmail${0}`]: parent.email,
                        [`parentStreet1${0}`]: parent.street1,
                        [`parentSuburb${0}`]: parent.suburb,
                        [`parentStateRefId${0}`]: parent.stateRefId,
                        [`parentCountryRefId${0}`]: parent.countryRefId,
                        [`parentPostalCode${0}`]: parent.postalCode,
                    });
                }, 300);
            }
            return parent;
        } catch (ex) {
            console.log("Error in getUpdatedParentObj::" + ex);
        }
    }

    addParent = (key, parentIndex) => {
        try {
            const { registrationObj, userInfo, registeredParents } = this.props.userRegistrationState;
            let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
            let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj.userId);
            if (key == "add") {
                let parentObj = deepCopyFunction(this.getParentObj());
                parentObj.selectAddressFlag = (newUser || user.parentOrGuardian == null) ? false : true;
                parentObj.addNewAddressFlag = (newUser || user.parentOrGuardian == null) ? true : false;
                parentObj.tempParentId = registrationObj.parentOrGuardian.length + 1;

                //Do for second user when he is a child for first user
                if (registrationObj.registeringYourself == 2) {
                    let parentObjTemp = this.getUpdatedParentObj(parentObj);
                    registrationObj.parentOrGuardian.push(parentObjTemp);
                } else {
                    registrationObj.parentOrGuardian.push(parentObj);
                }
            }
            if (key == "remove") {
                registrationObj.parentOrGuardian.splice(parentIndex, 1);
            }
            if (key == "removeAllParent") {
                registrationObj.parentOrGuardian = [];
            }
            this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj")
        } catch (ex) {
            console.log("Exception occured in addParent" + ex);
        }
    }

    onChangeSetParentValue = (value, key, parentIndex) => {
        try {
            const { registrationObj, userInfo } = this.props.userRegistrationState;
            if (key == "isSameAddress") {
                registrationObj.parentOrGuardian[parentIndex][key] = value;
                if (value) {
                    registrationObj.parentOrGuardian[parentIndex]["street1"] = registrationObj.street1;
                    registrationObj.parentOrGuardian[parentIndex]["street2"] = registrationObj.street2;
                    registrationObj.parentOrGuardian[parentIndex]["suburb"] = registrationObj.suburb;
                    registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = registrationObj.stateRefId;
                    registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = registrationObj.countryRefId;
                    registrationObj.parentOrGuardian[parentIndex]["postalCode"] = registrationObj.postalCode;
                    this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
                } else {
                    this.clearParentAddress(registrationObj, parentIndex);
                }
            } else if (key == "addOrRemoveAddressBySelect") {
                if (value) {
                    let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj.userId);
                    let parentAddress = this.getSelectAddressDropdown(user).find(x => x.userId == value);
                    registrationObj.parentOrGuardian[parentIndex]["street1"] = parentAddress.street1;
                    registrationObj.parentOrGuardian[parentIndex]["street2"] = parentAddress.street2;
                    registrationObj.parentOrGuardian[parentIndex]["postalCode"] = parentAddress.postalCode;
                    registrationObj.parentOrGuardian[parentIndex]["suburb"] = parentAddress.suburb;
                    registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = parentAddress.stateRefId;
                    registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = parentAddress.countryRefId;
                    this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
                } else {
                    this.clearParentAddress(registrationObj, parentIndex);
                }
            }
            else if (key == "mobileNumber") {
                if (value.length === 10) {
                    let hasError = this.state.hasErrorParent;
                    let obj = hasError.find(element => element.parentIndex == parentIndex);
                    if (obj != undefined) {
                        hasError.splice(hasError.indexOf(obj), 1);
                    }
                    // hasError.push({
                    //     error : false,
                    //     parentIndex : parentIndex
                    // })
                    this.setState({
                        hasErrorParent: hasError
                    })
                    registrationObj.parentOrGuardian[parentIndex][key] = regexNumberExpression(value);
                    this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
                } else if (value.length < 10) {
                    registrationObj.parentOrGuardian[parentIndex][key] = regexNumberExpression(value);
                    this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
                    // this.setState({
                    //     hasErrorParent: true
                    // })
                    console.log('obj ', this.state.hasErrorParent, parentIndex)
                    let hasError = this.state.hasErrorParent;
                    let obj = hasError.find(element => element.parentIndex == parentIndex);
                    console.log('obj ', obj)
                    if (obj == undefined) {
                        hasError.push({
                            error: true,
                            parentIndex: parentIndex
                        })
                    };


                    this.setState({
                        hasErrorParent: hasError
                    })


                }

                if (!regexNumberExpression(value)) {
                    setTimeout(() => {
                        this.props.form.setFieldsValue({
                            [`parentMobileNumber${parentIndex}`]: null,
                        });
                    }, 300);
                }
            }
            else {
                registrationObj.parentOrGuardian[parentIndex][key] = value;
                this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
            }
        } catch (ex) {
            console.log("Exception occured in onChangeSetParentValue" + ex);
        }
    }

    clearParentAddress = (registrationObj, parentIndex) => {
        registrationObj.parentOrGuardian[parentIndex]["street1"] = null;
        registrationObj.parentOrGuardian[parentIndex]["street2"] = null;
        registrationObj.parentOrGuardian[parentIndex]["suburb"] = null;
        registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = null;
        registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = null;
        registrationObj.parentOrGuardian[parentIndex]["postalCode"] = null;
        this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
    }

    handlePlacesAutocomplete = (addressData, key, parentIndex) => {
        const { registrationObj } = this.props.userRegistrationState;
        const { stateList, countryList } = this.props.commonReducerState;
        const address = addressData;
        // if (!address.addressOne) {
        //     this.setState({searchAddressError: ValidationConstants.addressDetailsError});
        // }else {
        //     this.setState({searchAddressError: ''})
        // }
        console.log("adderssData", address)
        if (address) {
            const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address?.state).id : null;
            const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address?.country).id : null;
            if (key == "parent") {
                this.onChangeSetParentValue(stateRefId ? stateRefId : null, "stateRefId", parentIndex);
                this.onChangeSetParentValue(address.addressOne, "street1", parentIndex);
                this.onChangeSetParentValue(address.suburb, "suburb", parentIndex);
                this.onChangeSetParentValue(address.postcode, "postalCode", parentIndex);
                this.onChangeSetParentValue(countryRefId ? countryRefId : null, "countryRefId", parentIndex);
            }
            if (key == "participant") {
                this.onChangeSetParticipantValue(stateRefId, "stateRefId");
                if (stateRefId) {
                    this.getSchoolList(stateRefId);
                }
                this.onChangeSetParticipantValue(address.addressOne, "street1");
                this.onChangeSetParticipantValue(address.suburb, "suburb");
                this.onChangeSetParticipantValue(address.postcode, "postalCode");
                this.onChangeSetParticipantValue(countryRefId, "countryRefId");
                if (isArrayNotEmpty(registrationObj.parentOrGuardian)) {
                    for (let parent of registrationObj.parentOrGuardian) {
                        parent.isSameAddress = false;
                    }
                }
                this.props.updateUserRegistrationObjectAction(registrationObj, "registrationObj");
            }
        }
    };

    onChangeSetCompetitionValue = (value, key, index, subIndex, subKey, subValue) => {
        this.props.updateParticipantCompetitionAction(value, key, index, subIndex, subKey, subValue);
    }

    divRestriction = (competition, divisionInfo, competitionIndex) => {
        let restrictionId = competition.competitionInfo.registrationRestrictionTypeRefId
        let isSameDiv = (competition.divisions || []).find(x => x.competitionMembershipProductDivisionId == divisionInfo.competitionMembershipProductDivisionId)
        if (restrictionId == 1) {
            if (competition.divisions.length < 1) {
                this.onChangeSetCompetitionValue(divisionInfo.competitionMembershipProductDivisionId, "divisionInfo", competitionIndex, null, null, divisionInfo.competitionMembershipProductTypeId)
            }
        }
        else if (restrictionId == 2) {
            if (!isSameDiv) {
                this.onChangeSetCompetitionValue(divisionInfo.competitionMembershipProductDivisionId, "divisionInfo", competitionIndex, null, null, divisionInfo.competitionMembershipProductTypeId)
            }
        }
        else {
            this.onChangeSetCompetitionValue(divisionInfo.competitionMembershipProductDivisionId, "divisionInfo", competitionIndex, null, null, divisionInfo.competitionMembershipProductTypeId)
        }
    }

    onChangeDivisionInfo = (divisionIndex, competitionIndex, divisionInfoList) => {
        const { registrationObj } = this.props.userRegistrationState;
        // this.onChangeSetCompetitionValue(divisionIndex, "divisionInfoIndex", competitionIndex);
        this.onChangeSetCompetitionValue(null, "divisionInfoIndex", competitionIndex);
        let divisionInfo = divisionInfoList[divisionIndex];
        (registrationObj.competitions || []).map((competition) => (
            this.divRestriction(competition, divisionInfo, competitionIndex)
        ))
        // this.onChangeSetCompetitionValue(divisionInfo.competitionMembershipProductDivisionId, "divisionInfo", competitionIndex, null, null, divisionInfo.competitionMembershipProductTypeId)
    }

    addFriend = (removeOrAdd, competitionIndex, friendIndex) => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            let friends = registrationObj.competitions[competitionIndex].friends;
            if (removeOrAdd == "add") {
                let friend = {
                    "firstName": null,
                    "lastName": null,
                    "middleName": null,
                    "mobileNumber": null,
                    "email": null
                }
                friends.push(friend);
            } else {
                friends.splice(friendIndex, 1);
            }
            this.onChangeSetCompetitionValue(friends, "friends", competitionIndex);
        } catch (ex) {
            console.log("Error in addFriend" + ex);
        }
    }

    addReferFriend = (removeOrAdd, competitionIndex, referFriendIndex) => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            let referFriends = registrationObj.competitions[competitionIndex].referFriends;
            if (removeOrAdd == "add") {
                let friend = {
                    "firstName": null,
                    "lastName": null,
                    "middleName": null,
                    "mobileNumber": null,
                    "email": null
                }
                referFriends.push(friend);
            } else {
                referFriends.splice(referFriendIndex, 1);
            }
            this.onChangeSetCompetitionValue(referFriends, "referFriends", competitionIndex);
        } catch (ex) {
            console.log("Error in addReferFriends" + ex);
        }
    }

    addAnotherCompetition = (competition) => {
        this.setState({ competitionId: competition.competitionUniqueKey });
        let { membershipProductInfo } = this.props.userRegistrationState;
        let organisationInfo = deepCopyFunction(membershipProductInfo).find(x => x.organisationUniqueKey == competition.organisationUniqueKey);
        this.setState({ organisationId: organisationInfo.organisationUniqueKey });
        if (organisationInfo) {
            let organisation = {
                organisationInfo: organisationInfo,
                competitionInfo: competition,
                findAnotherCompetition: this.state.findAnotherCompetitionFlag
            }
            this.props.updateUserRegistrationObjectAction(organisation, "competitions");
        }
        setTimeout(() => {
            window.scrollTo({
                top: this.ref.offsetTop,
                behavior: "smooth"
            });
        }, 300)
    }

    onChangeSetAdditionalInfo = (value, key, subKey) => {
        this.props.updateParticipantAdditionalInfoAction(value, key, subKey);
    }

    removeCompetition = (competitionId) => {
        try {
            let registrationObjTemp = this.props.userRegistrationState.registrationObj;
            let filteredCompetitions = registrationObjTemp.competitions.filter(x => x.competitionId != competitionId);
            registrationObjTemp.competitions = filteredCompetitions;
            this.props.updateUserRegistrationObjectAction(registrationObjTemp, "registrationObj");
        } catch (ex) {
            console.log("Error in removeCompetition");
        }
    }

    dateConversion = (f, key, referenceKey) => {
        try {
            let date = moment(f, "DD-MM-YYYY").format("MM-DD-YYYY");
            if (referenceKey == "participant") {
                this.onChangeSetParticipantValue(date, "dateOfBirth")
            } else if (referenceKey == "additionalInfo") {
                this.onChangeSetAdditionalInfo(date, key)
            }
        } catch (ex) {
            console.log("Error in dateConversion::" + ex)
        }
    }

    getFilteredRegisrationObj = (registrationObj) => {
        registrationObj["existingUserId"] = getUserId() ? Number(getUserId()) : null;
        registrationObj.participantId = this.state.participantId != null ? this.state.participantId : null;
        registrationObj.registrationId = this.state.registrationId != null ? this.state.registrationId : null;
        registrationObj.userId = registrationObj.userId == -1 || registrationObj.userId == -2 ? null : registrationObj.userId;
        // registrationObj.dateOfBirth = registrationObj.dateOfBirth ? moment(registrationObj.dateOfBirth,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
        // registrationObj.additionalInfo.accreditationUmpireExpiryDate = registrationObj.additionalInfo.accreditationUmpireExpiryDate ? moment(registrationObj.additionalInfo.accreditationUmpireExpiryDate ,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
        // registrationObj.additionalInfo.accreditationCoachExpiryDate = registrationObj.additionalInfo.accreditationCoachExpiryDate ? moment(registrationObj.additionalInfo.accreditationCoachExpiryDate ,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
        // registrationObj.additionalInfo.childrenCheckExpiryDate = registrationObj.additionalInfo.childrenCheckExpiryDate ? moment(registrationObj.additionalInfo.childrenCheckExpiryDate ,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
        let competitions = registrationObj.competitions;
        for (let competition of competitions) {
            competition.organisationInfo = null;
            competition.competitionInfo = null;
        }
        return registrationObj;
    }

    getParticipantType = () => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            let participantType;
            if (registrationObj.registeringYourself == 1) {
                participantType = "Myself";
            } else if (registrationObj.registeringYourself == 2) {
                participantType = "Child";
            } else {
                participantType = "Registering someone else"
            }
            return participantType;
        } catch (ex) {
            console.log("Error in getParticipantType" + ex);
        }
    }

    findAnotherCompetition = (competitionIndex) => {
        if (competitionIndex == 0) {
            this.setState({
                showAddAnotherCompetitionView: true,
                findAnotherCompetitionFlag: true, organisationId: null, competitions: null
            });
            this.onChangeSetPostalCode('');
        } else {
            this.onChangeSetCompetitionValue(null, "competition", competitionIndex, null, null)
        }
    }

    getOrganisationPhotos = (organisationPhotos) => {
        try {
            let organisationPhotosTemp = [];
            for (let i = 0; i < organisationPhotos.length; i++) {
                if ((i % 2) == 0) {
                    let obj = {
                        photoUrl1: organisationPhotos[i].photoUrl,
                        photoType1: organisationPhotos[i].photoType,
                        photoUrl2: organisationPhotos[i + 1]?.photoUrl,
                        photoType2: organisationPhotos[i + 1]?.photoType,
                    }
                    organisationPhotosTemp.push(obj);
                }
            }
            return organisationPhotosTemp;
        } catch (ex) {
            console.log("Error in getOrganisationPhotos::" + ex);
        }
    }

    disabledOrNot = () => {
        // let disabled;
        // this.props.form.validateFields((err,values) => {
        //     disabled = err ? true : false;
        // });
        // console.log("button",disabled);
        // return disabled;
    }

    isExistIndividualRegCompetition = () => {
        try {
            const { membershipProductInfo } = this.props.userRegistrationState;
            let exist = false;
            if (getOrganisationId() && getCompetitonId()) {
                let organisation = membershipProductInfo.find(x => x.organisationUniqueKey == getOrganisationId());
                if (organisation) {
                    let competition = organisation.competitions.find(x => x.competitionUniqueKey == getCompetitonId());
                    if (competition) {
                        exist = true;
                    }
                }
            } else {
                exist = true;
            }
            return exist;
        } catch (ex) {
            console.log("Error in isExistIndividualReCompetition::" + ex);
        }
    }

    selectAnotherParticipant = () => {
        let empty = [];
        this.setState({
            enabledSteps: empty,
            completedSteps: empty,
            currentStep: 0
        });

        //For retain competitions based on the url for a another participant
        if (getOrganisationId() != null && getCompetitonId() != null && this.isExistIndividualRegCompetition()) {
            this.setState({
                showAddAnotherCompetitionView: false,
                organisationId: getOrganisationId(),
                competitionId: getCompetitonId()
            })
        }

        this.props.updateUserRegistrationStateVarAction("registrationObj", null);
    }

    addressSearchValidation = () => {
        try {
            let error = false;
            const { registrationObj } = this.props.userRegistrationState;
            console.log("registrationObj", registrationObj);
            if (registrationObj.addNewAddressFlag &&
                registrationObj.stateRefId == null) {
                error = true;
            }
            if (isArrayNotEmpty(registrationObj.parentOrGuardian)) {
                let parent = registrationObj.parentOrGuardian.find(x => x.addNewAddressFlag == true &&
                    x.stateRefId == null);
                if (parent != undefined) {
                    error = true;
                }
            }
            return error;
        } catch (ex) {
            console.log("Error in addressSearchValidation" + ex);
        }
    }

    productValidation = () => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            let competitions = registrationObj.competitions;
            let check = true;
            for (let competition of competitions) {
                if (isArrayNotEmpty(competition.products)) {
                    for (let product of competition.products) {
                        if (product.isPlayer == 1) {
                            let divisionsTemp = competition.divisions.find(x => x.competitionMembershipProductId == product.competitionMembershipProductId);
                            if (divisionsTemp == undefined) {
                                check = false;
                                break;
                            }
                        }
                    }
                } else {
                    check = false;
                }
            }
            return check;
        } catch (ex) {
            console.log("Error in checkProductEitherAddOrNot" + ex);
        }
    }

    isNetSetGo = (competition, competitionIndex) => {
        try{
            let value = true;
            if(isArrayNotEmpty(competition.products)){
                let checkedPlayerProduct = competition.products.find(x => x.isChecked == true && x.membershipTypeName == "Player - NetSetGo");
                if(checkedPlayerProduct == undefined) {
                    value = false
                }
            }
            else{
                value = false;
            }
            return value;
        } catch (ex) {
            console.log("Error in isNetSetGo" + ex);
        }
    }

    isPlayerActive = (competition) => {
        try {
            let value = true;
            if (isArrayNotEmpty(competition.products)) {
                let checkedPlayerProduct = competition.products.find(x => x.isChecked == true && x.isPlayer == 1);
                if (checkedPlayerProduct == undefined) {
                    value = false;
                }
            } else {
                value = false;
            }
            return value;
        } catch (ex) {
            console.log("Error in isPlayerActive" + ex);
        }
    }

    onChangeSetOrganisation = (organisationId) => {
        try {
            let { membershipProductInfo } = this.props.userRegistrationState;
            this.setState({
                organisationId: organisationId,
                currentCompetitions: 1
            });
            let organisationInfo = deepCopyFunction(membershipProductInfo).find(x => x.organisationUniqueKey == organisationId);
            if (organisationInfo) {
                this.setState({
                    allCompetitionsByOrgId: organisationInfo.competitions,
                    competitions: organisationInfo.competitions.slice(0, this.state.competitionsCountPerPage)
                });
            }
        } catch (ex) {
            console.log("Error in onChangeSetOrganisation" + ex);
        }
    }

    paginationItems = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a style={{ color: "var(--app-color)", fontWeight: "700" }}>Prev</a>;
        }
        if (type === 'next') {
            return <a style={{ color: "var(--app-color)", fontWeight: "700" }}>Next</a>;
        }
        return originalElement;
    }

    pagingCompetitions = (current) => {
        let startIndex = (current - 1) * this.state.competitionsCountPerPage;
        let endIndex = current * this.state.competitionsCountPerPage;
        this.setState({ currentCompetitions: current });
        // if(this.state.organisationId == null){
        //     this.setState({competitions: this.state.allCompetitions.slice(startIndex,endIndex)});
        // }else{
        this.setState({ competitions: this.state.allCompetitionsByOrgId.slice(startIndex, endIndex) });
        //}
    }

    goToRegistrationProducts = () => {
        history.push({ pathname: '/registrationProducts', state: { registrationId: this.state.registrationId } })
    }

    goToTeamRegistrationForm = (uniqueKey, registrationId) => {
        // console.log(registrationId, uniqueKey);

        const { registrationReviewList } = this.props.registrationProductState;
        const compParticipants = registrationReviewList !== null ?
            isArrayNotEmpty(registrationReviewList.compParticipants) ?
                registrationReviewList.compParticipants : [] : [];
        const isTeamRegistration = compParticipants[0] ? compParticipants[0].isTeamRegistration : false;

        // CM-2026
        // if not team registration (is individual registration) and registrationId is present
        // then prevent adding a team to cart
        if (!isTeamRegistration && this.state.registrationId) {
            notification.open({
                message: AppConstants.banIndividualTeamMixRegistrationMessageTitle,
                description:
                  AppConstants.banIndividualTeamMixRegistrationMessage,
              });
            return
        }

        if (uniqueKey) {
            history.push({ pathname: '/appTeamRegistrationForm', state: { existingTeamParticipantId: uniqueKey, registrationId: registrationId } });
        } else {
            history.push({ pathname: '/appTeamRegistrationForm', state: { registrationId: registrationId } });
        }
    }

    onChangeSetPostalCode = (postalCode) => {
        try {
            this.setState({ postalCode: postalCode });
            setTimeout(() => {
                if (postalCode == '') {
                    this.searchOrganisationByPostalCode();
                }
            }, 300);
        } catch (ex) {
            console.log("Error in searchOrganisationByPostalCode" + ex);
        }
    }

    searchOrganisationByPostalCode = () => {
        try {
            let { membershipProductInfo } = this.props.userRegistrationState;
            if (this.state.postalCode) {
                const nearByOrganisationsData = nearByOrganisations(membershipProductInfo, this.state.postalCode, 20);
                this.setState({ organisations: nearByOrganisationsData });
                //this.setAllCompetitions(nearByOrganisationsData);
                let selectedOrganisationExistInList = nearByOrganisationsData.find(x => x.organisationUniqueKey == this.state.organisationId);
                if (selectedOrganisationExistInList == undefined) {
                    this.setState({ competitions: null, organisationId: null })
                }
            } else {
                this.setState({ organisations: membershipProductInfo });
                //this.setAllCompetitions(membershipProductInfo);
            }
        } catch (ex) {
            console.log("Error in searchOrganisationByPostalCode" + ex);
        }
    }

    getSelectAddressDropdown = (user) => {
        try {
            let addresses = [];
            if (user) {
                let address = {
                    "userId": user.id,
                    "street1": user.street1,
                    "street2": user.street2,
                    "suburb": user.suburb,
                    "postalCode": user.postalCode,
                    "stateRefId": user.stateRefId,
                    "countryRefId": user.countryRefId
                }
                addresses.push(address);
                if (isArrayNotEmpty(user.parentOrGuardian)) {
                    for (let parent of user.parentOrGuardian) {
                        let parentAddress = {
                            "userId": parent.userId,
                            "street1": parent.street1,
                            "street2": parent.street2,
                            "suburb": parent.suburb,
                            "postalCode": parent.postalCode,
                            "stateRefId": parent.stateRefId,
                            "countryRefId": parent.countryRefId
                        }
                        addresses.push(parentAddress);
                    }
                }
            }
            return addresses;
        } catch (ex) {
            console.log("Error in getSelectAddressDropdown" + ex);
        }
    }

    stepNavigation = (registrationObj, expiredRegistration) => {
        try {
            let nextStep = this.state.currentStep + 1;
            this.scrollToTop();
            if (nextStep == 1) {
                if (registrationObj.competitions.length == 0 &&
                    expiredRegistration == null) {
                    this.setState({ showAddAnotherCompetitionView: true });
                }
                this.state.enabledSteps.push(0, nextStep);
            } else {
                this.state.enabledSteps.push(nextStep);
                if (nextStep == 2) {
                    setTimeout(() => {
                        this.setParticipantAdditionalInfoStepFormFields();
                    }, 300);
                }
            }
            this.state.completedSteps.push(this.state.currentStep);
            this.setState({
                currentStep: nextStep,
                enabledSteps: this.state.enabledSteps,
                completedSteps: this.state.completedSteps
            });
        } catch (ex) {
            console.log("Error in stepNavigation::" + ex);
        }
    }

    getRegistrationCapValidationInputObj = (registrationObj) => {
        try {
            let registrationCapValidateInputObjTemp = {
                registrationId: this.props.userRegistrationState.registrationId ? this.props.userRegistrationState.registrationId : "",
                participantId: this.props.userRegistrationState.participantId ? this.props.userRegistrationState.participantId : "",
                isTeamRegistration: 0,
                products: []
            }
            for (let competition of registrationObj.competitions) {
                for (let productItem of competition.products) {
                    if (productItem.isPlayer == 1) {
                        let divisions = competition.divisions.filter(x => x.competitionMembershipProductId == productItem.competitionMembershipProductId && x.competitionMembershipProductTypeId == productItem.competitionMembershipProductTypeId);
                        if (divisions) {
                            for (let divisionItem of divisions) {
                                let product = {
                                    "competitionId": competition.competitionId,
                                    "organisationId": competition.organisationId,
                                    "competitionMembershipProductTypeId": divisionItem.competitionMembershipProductTypeId,
                                    "divisionId": divisionItem.competitionMembershipProductDivisionId
                                }
                                registrationCapValidateInputObjTemp.products.push(product);
                            }
                        }
                    } else {
                        let product = {
                            "competitionId": competition.competitionId,
                            "organisationId": competition.organisationId,
                            "competitionMembershipProductTypeId": productItem.competitionMembershipProductTypeId,
                            "divisionId": null
                        }
                        registrationCapValidateInputObjTemp.products.push(product);
                    }
                }
            }
            return registrationCapValidateInputObjTemp;
        } catch (ex) {
            console.log("Error in getRegistrationCapValidationInputObj::" + ex)
        }
    }

    setReferParentEmailIfRequired = (registrationObj) => {
        try {
            const { userInfo } = this.props.userRegistrationState;
            let childEmail = registrationObj.email;
            if (getAge(registrationObj.dateOfBirth) < 18 && childEmail) {
                let isSameWithParentEmail = registrationObj.parentOrGuardian.find(x => x.email === childEmail);
                if (isSameWithParentEmail) {
                    this.setState({ sameEmailValidationModalVisible: true });
                    return false;
                } else {
                    this.onChangeSetParticipantValue(false, "referParentEmail");
                }
            }
            if (registrationObj.registeringYourself == 3) {
                if (getUserId() != 0) {
                    let user = userInfo?.find(x => x.id == getUserId());
                    if (user) {
                        if (user.email === registrationObj.email) {
                            this.setState({ sameSomeoneEmailValidationModalVisible: true })
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (ex) {
            console.log("Error in setReferParentEmailIfRequried::" + ex);
        }
    }

    saveRegistrationForm = (e) => {
        try {
            e.preventDefault();
            const { registrationObj, expiredRegistration } = this.props.userRegistrationState;
            let saveRegistrationObj = JSON.parse(JSON.stringify(registrationObj));
            let filteredSaveRegistrationObj = this.getFilteredRegisrationObj(saveRegistrationObj)

            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.error(AppConstants.pleaseReview)
                    if (filteredSaveRegistrationObj.parentOrGuardian != null && filteredSaveRegistrationObj.parentOrGuardian.length > 0) {
                        for (let a in filteredSaveRegistrationObj.parentOrGuardian) {
                            if (filteredSaveRegistrationObj.parentOrGuardian[a].mobileNumber == null || filteredSaveRegistrationObj.parentOrGuardian[a].mobileNumber.length != 10) {
                                if (this.state.hasErrorParent.length > 0) {
                                    let item = this.state.hasErrorParent.find(element => element.parentIndex == a);
                                    if (item != undefined) {
                                        let hasErrors = this.state.hasErrorParent;
                                        hasErrors[a].error = true;
                                        this.setState({
                                            hasErrorParent: hasErrors
                                        })
                                    }
                                    else {
                                        let hasErrors = this.state.hasErrorParent;
                                        hasErrors.push({
                                            error: true,
                                            parentIndex: a
                                        })
                                        this.setState({
                                            hasErrorParent: hasErrors
                                        })
                                    }
                                }
                                else {
                                    let hasErrors = this.state.hasErrorParent;
                                    hasErrors.push({
                                        error: true,
                                        parentIndex: a
                                    })
                                    this.setState({
                                        hasErrorParent: hasErrors
                                    })
                                }

                            }
                        }
                    }

                }
                if (!err) {
                    // if(registrationObj.photoUrl == null){
                    //     message.error(ValidationConstants.userPhotoIsRequired);
                    //     return;
                    // }

                    if (this.state.currentStep == 0) {
                        let addressSearchError = this.addressSearchValidation();
                        if (addressSearchError) {
                            message.error(ValidationConstants.addressDetailsIsRequired);
                            return;
                        };

                        if (values.participantMobileNumber != null && values.participantMobileNumber.length != 10) {
                            // message.error(ValidationConstants.mobileLength);
                            message.error(AppConstants.pleaseReview)
                            this.setState({ hasErrorParticipitant: true })
                            return false;
                        }
                        if (values.emergencyContactNumber != null && values.emergencyContactNumber.length != 10) {
                            message.error(AppConstants.pleaseReview)
                            this.setState({ hasErrorEmergency: true })
                            return false;
                        }
                        let hasError = this.state.hasErrorParent;
                        if (filteredSaveRegistrationObj.parentOrGuardian != null && filteredSaveRegistrationObj.parentOrGuardian.length > 0) {
                            for (let a in filteredSaveRegistrationObj.parentOrGuardian) {
                                if (filteredSaveRegistrationObj.parentOrGuardian[a].mobileNumber.length != 10) {
                                    message.error(AppConstants.pleaseReview)
                                    hasError.push({
                                        error: true,
                                        parentIndex: a
                                    });
                                    this.setState({
                                        hasErrorParent: hasError
                                    })
                                    return false
                                }
                            }
                        }

                        let isSame = this.setReferParentEmailIfRequired(registrationObj);
                        if (!isSame) {
                            return;
                        }
                    }
                    if (this.state.currentStep == 1) {
                        if (registrationObj.competitions.length == 0) {
                            message.error(ValidationConstants.competitionField);
                            return;
                        } else {
                            let productAdded = this.productValidation();
                            if (!productAdded) {
                                message.error(ValidationConstants.fillMembershipProductDivisionInformation);
                                return;
                            }
                        }
                        let registrationCapValidationInputObj = this.getRegistrationCapValidationInputObj(registrationObj);
                        if (registrationCapValidationInputObj.products.find(x => x.competitionId)) {
                            this.props.validateRegistrationCapAction(registrationCapValidationInputObj);
                            this.setState({ validateRegistrationCapBySubmit: true, validateRegistrationCapOnLoad: true });
                            return;
                        }
                    }
                    if (this.state.currentStep != 2) {
                        if(this.state.currentStep==0){
                            this.setState({sameEmailValidationModalVisible:true})
                        }
                        // this.stepNavigation(registrationObj, expiredRegistration);
                    }
                    setTimeout(() => {
                        this.setState({
                            submitButtonText: this.state.currentStep == 1 ?
                                AppConstants.addCompetitionAndMembership :
                                AppConstants.signupToCompetition
                        });
                    }, 100);
                    if (this.state.currentStep == 2) {
                        let formData = new FormData();
                        formData.append("participantPhoto", registrationObj.participantPhoto);
                        formData.append("participantDetail", JSON.stringify(filteredSaveRegistrationObj));
                        this.props.saveParticipantInfo(formData);
                    }
                }
            });
        } catch (ex) {
            console.log("Exception occured in saveRegistrationForm" + ex);
        }
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "flex-start"
                    }}>
                    <Breadcrumb
                        style={{ alignItems: "center", alignSelf: "center" }}
                        separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.signupToCompetition}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        )
    }

    participantDetailsStepView = (getFieldDecorator) => {
        let { registrationObj } = this.props.userRegistrationState;
        console.log("regostratop", registrationObj.dateOfBirth)
        return (
            <div>
                {registrationObj.userId == -1 || registrationObj.userId == -2 ?
                    <div>{this.addedParticipantView()}</div>
                    :
                    <div>{this.addedParticipantWithProfileView()}</div>
                }
                <div>{this.participantDetailView(getFieldDecorator)}</div>
                {getAge(registrationObj.dateOfBirth) < 18 ? (
                    <div>{this.parentOrGuardianView(getFieldDecorator)}</div>
                ) : (
                        <div>
                            {registrationObj.dateOfBirth && (
                                <div>{this.emergencyContactView(getFieldDecorator)}</div>
                            )}
                        </div>
                    )}
            </div>
        )
    }

    addOrSelectParticipantView = () => {
        let userRegistrationstate = this.props.userRegistrationState;
        let userInfo = userRegistrationstate.userInfo;
        let registrationObj = userRegistrationstate.registrationObj;
        return (
            <div
                className="registration-form-view"
                style={{
                    marginTop: "0px !important",
                }}
            >
                <div className="form-heading"
                    style={{ paddingBottom: "0px" }}>
                    {userInfo.length == 0 ? AppConstants.addParticipant : AppConstants.selectOrAddParticipant}
                </div>
                <div className="row">
                    {(userInfo || []).map((user, index) => (
                        <div className='col-sm-6' key={index}>
                            {!user.isTeamRegistration ?
                                <div
                                    onClick={() => this.addOrSelectParticipant(user.id)}
                                    className={registrationObj != null && registrationObj.userId == user.id ? 'new-participant-button-active' : 'new-participant-button-inactive'}>
                                    {user.photoUrl ?
                                        <img className="profile-img" src={user.photoUrl} />
                                        :
                                        <div className="profile-default-img">
                                            {user.firstName.slice(0, 1)}{user.lastName.slice(0, 1)}
                                        </div>
                                    }
                                    <div style={{ width: "75%", paddingLeft: "15px" }}>
                                        <div>{user.firstName} {user.lastName}</div>
                                        {(user.genderRefId != 0 || user.dateOfBirth != null) && (
                                            <div style={{ fontSize: "15px" }}>
                                                {user.genderRefId != 0 && (user.genderRefId == 1 ? 'Female' : 'Male')}, {user.dateOfBirth != null && moment(user.dateOfBirth).format("DD/MM/YYYY")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                :
                                <div
                                    onClick={() => this.goToTeamRegistrationForm(user.userRegUniqueKey, this.state.registrationId)}
                                    className={registrationObj != null && registrationObj.userId == user.id ? 'new-participant-button-active' : 'new-participant-button-inactive'}>
                                    <div className="defualt-team-logo-style" style={{ height: "80px", width: "80px", minWidth: 80 }}>
                                        <img src={AppImages.teamLoadDefualtWhite} />
                                    </div>
                                    <div style={{ width: "75%", paddingLeft: "15px" }}>
                                        <div>{user.teamName}</div>
                                        <div style={{ fontSize: "15px" }}>{user.totalMembers} {AppConstants.members}</div>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                    <div className='col-sm-6'>
                        <div
                            onClick={() => this.addOrSelectParticipant(-1)}
                            className={registrationObj != null && registrationObj.userId == -1 ? 'new-participant-button-active' : 'new-participant-button-inactive'}
                            style={{ textAlign: "center", padding: "0px 40px" }}>+ {AppConstants.newParticipantRegistration}</div>
                    </div>
                    <div className='col-sm-6'>
                        <div
                            onClick={() => this.goToTeamRegistrationForm(null, this.state.registrationId)}
                            className={registrationObj != null && registrationObj.userId == -2 ? 'new-participant-button-active' : 'new-participant-button-inactive'}
                            style={{ textAlign: "center", padding: "0px 70px" }}>+ {AppConstants.newTeamRegistration}</div>
                    </div>
                </div>

                {registrationObj != null && (registrationObj.userId == -1 || registrationObj.userId == -2) ?
                    <div>
                        <InputWithHead heading={AppConstants.areYouRegisteringYourself} required={"required-field"}></InputWithHead>
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "registeringYourself")}
                            value={registrationObj.registeringYourself}
                        >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={2}>{AppConstants.noRegisteringMyChild}</Radio>
                            <Radio value={3}>{AppConstants.noRegisteringSomeoneElse}</Radio>
                        </Radio.Group>
                    </div>
                    : null}
            </div>
        )
    }

    addedParticipantView = () => {
        return (
            <div className="registration-form-view">
                <div style={{ fontWeight: "600", marginBottom: "5px" }}>{AppConstants.participant}</div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-between' }}>
                    <div className="form-heading" style={{ textAlign: "start", marginRight: 10 }}>{AppConstants.addNewParticipant}</div>
                    <div className="orange-action-txt" style={{ alignSelf: "center", marginBottom: "5px" }}
                        onClick={() => this.selectAnotherParticipant()}>+{AppConstants.selectAnother}</div>
                </div>
                <div style={{ fontWeight: "600" }}>{this.getParticipantType()}</div>
            </div>
        )
    }

    participantAddressView = (getFieldDecorator) => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        let userInfo = deepCopyFunction(userRegistrationstate.userInfo);
        let user = userInfo.find(x => x.id == registrationObj.userId);
        const { stateList, countryList } = this.props.commonReducerState;
        let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
        let hasAddressForExistingUserFlag = (user?.stateRefId) ? true : false;
        return (
            <div>
                {registrationObj.selectAddressFlag && (
                    <div>
                        <div className="form-heading"
                            style={{ paddingBottom: "0px", marginTop: "30px" }}>{AppConstants.address}</div>
                        <InputWithHead heading={AppConstants.selectAddress} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`participantSelectAddress`, {
                                rules: [{ required: true, message: ValidationConstants.selectAddressRequired }],
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.select}
                                    onChange={(e) => this.onChangeSetParticipantValue(e, "addOrRemoveAddressBySelect")}
                                    setFieldsValue={this.getAddress(user)}>
                                    {(this.getSelectAddressDropdown(user) || []).map((item) => (
                                        <Option key={item.userId} value={item.userId}> {this.getAddress(item)}</Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        <div className="orange-action-txt" style={{ marginTop: "10px" }}
                            onClick={() => {
                                this.onChangeSetParticipantValue(true, "addNewAddressFlag")
                                this.onChangeSetParticipantValue(false, "selectAddressFlag");
                                this.onChangeSetParticipantValue(null, "addOrRemoveAddressBySelect");
                            }}
                        >+ {AppConstants.addNewAddress}</div>
                    </div>
                )}

                {registrationObj.addNewAddressFlag && (
                    <div>
                        {!newUser && hasAddressForExistingUserFlag && (
                            <div className="orange-action-txt" style={{ marginTop: "20px", marginBottom: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParticipantValue(true, "selectAddressFlag");
                                    this.onChangeSetParticipantValue(false, "addNewAddressFlag");
                                    setTimeout(() => {
                                        this.setParticipantDetailStepAddressFormFields("selectAddressFlag");
                                    }, 300)
                                }}
                            >{AppConstants.returnToSelectAddress}</div>
                        )}
                        <div className="form-heading"
                            style={(newUser || !hasAddressForExistingUserFlag) ? { marginTop: "20px", marginBottom: "-20px" } : { paddingBottom: "0px", marginBottom: "-20px" }}>{AppConstants.findAddress}</div>
                        <div>
                            <Form.Item name="addressSearch">
                                <PlacesAutocomplete
                                    defaultValue={this.getAddress(registrationObj)}
                                    heading={AppConstants.addressSearch}
                                    required
                                    error={this.state.searchAddressError}
                                    onBlur={() => { this.setState({ searchAddressError: '' }) }}
                                    onSetData={(e) => this.handlePlacesAutocomplete(e, "participant")}
                                />
                            </Form.Item>
                            <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParticipantValue(true, "manualEnterAddressFlag");
                                    this.onChangeSetParticipantValue(false, "addNewAddressFlag");
                                    setTimeout(() => {
                                        this.setParticipantDetailStepAddressFormFields("manualEnterAddressFlag");
                                    }, 300);
                                }}
                            >{AppConstants.enterAddressManually}</div>
                        </div>
                    </div>
                )}

                {registrationObj.manualEnterAddressFlag && (
                    <div>
                        <div className="orange-action-txt" style={{ marginTop: "20px", marginBottom: "10px" }}
                            onClick={() => {
                                this.onChangeSetParticipantValue(false, "manualEnterAddressFlag");
                                this.onChangeSetParticipantValue(true, "addNewAddressFlag");
                                setTimeout(() => {
                                    this.setParticipantDetailStepAddressFormFields("addNewAddressFlag");
                                }, 300);
                            }}
                        >{AppConstants.returnToAddressSearch}</div>
                        <div className="form-heading" style={{ paddingBottom: "0px" }}>{AppConstants.enterAddress}</div>
                        <Form.Item >
                            {getFieldDecorator(`participantStreet1`, {
                                rules: [{ required: true, message: ValidationConstants.addressField }],
                            })(
                                <InputWithHead
                                    required={"required-field pt-0 pb-0"}
                                    heading={AppConstants.addressOne}
                                    placeholder={AppConstants.addressOne}
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street1")}
                                    setFieldsValue={registrationObj.street1}
                                />
                            )}
                        </Form.Item>
                        <InputWithHead
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street2")}
                            value={registrationObj.street2}
                        />
                        <InputWithHead heading={AppConstants.suburb} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`participantSuburb`, {
                                rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                            })(
                                <InputWithHead
                                    // required={"required-field"}
                                    // heading={AppConstants.suburb}
                                    placeholder={AppConstants.suburb}
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "suburb")}
                                    setFieldsValue={registrationObj.suburb}
                                />
                            )}
                        </Form.Item>
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.state} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`participantStateRefId`, {
                                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                    })(
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder={AppConstants.state}
                                            onChange={(e) => this.onChangeSetParticipantValue(e, "stateRefId")}
                                            setFieldsValue={registrationObj.stateRefId}>
                                            {stateList.length > 0 && stateList.map((item) => (
                                                < Option key={item.id} value={item.id}> {item.name}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.postCode} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`participantPostalCode`, {
                                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            placeholder={AppConstants.postcode}
                                            maxLength={4}
                                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "postalCode")}
                                            setFieldsValue={registrationObj.postalCode}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.country} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`participantCountryRefId`, {
                                rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.country}
                                    onChange={(e) => this.onChangeSetParticipantValue(e, "countryRefId")}
                                    setFieldsValue={registrationObj.countryRefId}>
                                    {countryList.length > 0 && countryList.map((item) => (
                                        < Option key={item.id} value={item.id}> {item.description}</Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                )}
            </div>
        )
    }

    participantDetailView = (getFieldDecorator) => {
        let hasErrorParticipitant = this.state.hasErrorParticipitant;
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        const { genderList, stateList, countryList } = this.props.commonReducerState;
        return (
            <div className="registration-form-view">
                <div className="form-heading" style={{ paddingBottom: "0px" }}>{AppConstants.participantDetails}</div>
                <InputWithHead heading={AppConstants.gender} required={"required-field"}></InputWithHead>
                <Form.Item >
                    {getFieldDecorator(`genderRefId`, {
                        rules: [{ required: true, message: ValidationConstants.genderField }],
                    })(
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "genderRefId")}
                            setFieldsValue={registrationObj.genderRefId}
                        >
                            {(genderList || []).map((gender, genderIndex) => (
                                <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>

                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.participant_firstName} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`participantFirstName`, {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    placeholder={AppConstants.participant_firstName}
                                    onChange={(e) => this.onChangeSetParticipantValue(captializedString(e.target.value), "firstName")}
                                    setFieldsValue={registrationObj.firstName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'participantFirstName': captializedString(i.target.value)
                                    })}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.participant_middleName} />
                        <Form.Item >
                            {getFieldDecorator(`participantMiddleName`, {
                                rules: [{ required: false }],
                            })(
                                <InputWithHead
                                    placeholder={AppConstants.participant_middleName}
                                    onChange={(e) => this.onChangeSetParticipantValue(captializedString(e.target.value), "middleName")}
                                    setFieldsValue={registrationObj.middleName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'participantMiddleName': captializedString(i.target.value)
                                    })}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.participant_lastName} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`participantLastName`, {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                                <InputWithHead
                                    placeholder={AppConstants.participant_lastName}
                                    onChange={(e) => this.onChangeSetParticipantValue(captializedString(e.target.value), "lastName")}
                                    setFieldsValue={registrationObj.lastName}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'participantLastName': captializedString(i.target.value)
                                    })}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.dob} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`dateOfBirth`, {
                                rules: [{ required: true, message: ValidationConstants.dateOfBirth }],
                            })(
                                <DatePicker
                                    size="large"
                                    placeholder={"dd-mm-yyyy"}
                                    style={{ width: "100%" }}
                                    onChange={(e, f) => this.dateConversion(f, "dateOfBirth", "participant")}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'dateOfBirth'}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.contactMobile} required={"required-field"} maxLength={10} />
                        <Form.Item
                            name={AppConstants.contactNO}
                            rules={[{ required: true, message: ValidationConstants.contactField }]}
                            help={hasErrorParticipitant && ValidationConstants.mobileLength}
                            validateStatus={hasErrorParticipitant ? "error" : 'validating'}
                        >
                            {getFieldDecorator(`participantMobileNumber`, {
                                rules: [{ required: true, message: ValidationConstants.contactField }]
                            },
                            )(
                                <InputWithHead
                                    placeholder={AppConstants.contactMobile}
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "mobileNumber")}
                                    setFieldsValue={registrationObj.mobileNumber}
                                    maxLength={10}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6"
                        style={registrationObj.referParentEmail ? { alignSelf: "center", marginTop: "25px" } : {}}>
                        {!registrationObj.referParentEmail && (
                            <div>
                                <InputWithHead heading={AppConstants.contactEmail} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`participantEmail`, {
                                        rules: [
                                            { required: true, message: ValidationConstants.emailField[0] },
                                            {
                                                type: "email",
                                                pattern: new RegExp(AppConstants.emailExp),
                                                message: ValidationConstants.email_validation
                                            }
                                        ],
                                    })(
                                        <InputWithHead
                                            disabled={registrationObj.userId == getUserId()}
                                            placeholder={AppConstants.contactEmail}
                                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "email")}
                                            setFieldsValue={registrationObj.email}
                                        />
                                    )}
                                </Form.Item>
                                {registrationObj.isInActive && registrationObj.email == null ?
                                    <div style={{ color: "var(--app-red)" }}>
                                        {AppConstants.userLoginEmailChangeMessage}
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        )}
                        {getAge(registrationObj.dateOfBirth) < 18 && (
                            <Checkbox
                                className="single-checkbox"
                                checked={registrationObj.referParentEmail}
                                onChange={e => this.onChangeSetParticipantValue(e.target.checked, "referParentEmail")} >
                                {AppConstants.useParentsEmailAddress}
                            </Checkbox>
                        )}
                    </div>
                </div>

                <InputWithHead heading={AppConstants.photo} />
                {registrationObj.photoUrl == null ?
                    <div className="upload-default" onClick={() => this.selectImage()}>
                        <div style={{ fontSize: "22px" }}>
                            +
                            </div>
                        <div style={{ marginTop: "-7px" }}>
                            {AppConstants.upload}
                        </div>
                    </div> : null
                }
                {registrationObj.photoUrl ?
                    <img
                        src={registrationObj.photoUrl}
                        alt=""
                        height="80"
                        width="80"
                        style={{ borderRadius: "50%" }}
                        name={'image'}
                        onError={ev => {
                            ev.target.src = AppImages.circleImage;
                        }}
                        onClick={() => this.selectImage()}
                    /> : null
                }
                <input
                    type="file"
                    id={"user-pic"}
                    style={{ display: 'none' }}
                    onChange={(evt) => this.setImage(evt.target, "participantPhoto")}
                />
                <div>{this.participantAddressView(getFieldDecorator)}</div>
            </div>
        )
    }

    parentOrGuardianAddressView = (parent, parentIndex, getFieldDecorator) => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            const { stateList, countryList } = this.props.commonReducerState;
            const { userInfo } = this.props.userRegistrationState;
            let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj.userId);
            let selectAddressDropDownList = user && this.getSelectAddressDropdown(user);
            let selectAddressDropDownUser = selectAddressDropDownList && selectAddressDropDownList.find(x => x.userId == parent.userId);
            let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
            let hasAddressForExistingUserFlag = (selectAddressDropDownUser?.stateRefId) ? true : false;
            return (
                <div>
                    {parent.selectAddressFlag && (
                        <div>
                            <div className="form-heading"
                                style={{ paddingBottom: "0px", marginTop: "30px" }}>{AppConstants.address}</div>
                            <InputWithHead heading={AppConstants.selectAddress} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`parentSelectAddress${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.selectAddressRequired }],
                                })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.select}
                                        onChange={(e) => this.onChangeSetParentValue(e, "addOrRemoveAddressBySelect", parentIndex)}
                                        setFieldsValue={this.getAddress(user)}>
                                        {(selectAddressDropDownList || []).map((item) => (
                                            <Option key={item.userId} value={item.userId}> {this.getAddress(item)}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParentValue(true, "addNewAddressFlag", parentIndex)
                                    this.onChangeSetParentValue(false, "selectAddressFlag", parentIndex);
                                    this.onChangeSetParentValue(null, "addOrRemoveAddressBySelect", parentIndex)
                                }}
                            >+ {AppConstants.addNewAddress}</div>
                        </div>
                    )}
                    {parent.addNewAddressFlag && (
                        <div>
                            {!newUser && hasAddressForExistingUserFlag && (
                                <div className="orange-action-txt" style={{ marginTop: "20px", marginBottom: "10px" }}
                                    onClick={() => {
                                        this.onChangeSetParentValue(true, "selectAddressFlag", parentIndex);
                                        this.onChangeSetParentValue(false, "addNewAddressFlag", parentIndex);
                                        setTimeout(() => {
                                            this.setParticipantDetailStepParentAddressFormFields("selectAddressFlag", parent, parentIndex);
                                        }, 300)
                                    }}
                                >{AppConstants.returnToSelectAddress}</div>
                            )}
                            <div className="form-heading"
                                style={(newUser || !hasAddressForExistingUserFlag) ? { marginTop: "20px", marginBottom: "-20px" } : { paddingBottom: "0px", marginBottom: "-20px" }}>{AppConstants.findAddress}</div>
                            <Form.Item name="addressSearch">
                                <PlacesAutocomplete
                                    defaultValue={this.getAddress(parent)}
                                    heading={AppConstants.addressSearch}
                                    required
                                    error={this.state.searchAddressError}
                                    onBlur={() => {
                                        this.setState({
                                            searchAddressError: ''
                                        })
                                    }}
                                    onSetData={(e) => this.handlePlacesAutocomplete(e, "parent", parentIndex)}
                                />
                            </Form.Item>
                            <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParentValue(true, "manualEnterAddressFlag", parentIndex);
                                    this.onChangeSetParentValue(false, "addNewAddressFlag", parentIndex);
                                    setTimeout(() => {
                                        this.setParticipantDetailStepParentAddressFormFields("manualEnterAddressFlag", parent, parentIndex)
                                    }, 300);
                                }}
                            >{AppConstants.enterAddressManually}</div>
                        </div>
                    )}
                    {parent.manualEnterAddressFlag && (
                        <div>
                            <div className="orange-action-txt"
                                style={{ marginTop: "20px", marginBottom: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParentValue(false, "manualEnterAddressFlag", parentIndex);
                                    this.onChangeSetParentValue(true, "addNewAddressFlag", parentIndex);
                                    setTimeout(() => {
                                        this.setParticipantDetailStepParentAddressFormFields("addNewAddressFlag", parent, parentIndex)
                                    }, 300);
                                }}
                            >{AppConstants.returnToAddressSearch}</div>
                            <div className="form-heading"
                                style={{ paddingBottom: "0px" }}>{AppConstants.enterAddress}</div>
                            <Form.Item>
                                {getFieldDecorator(`parentStreet1${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.addressOne}
                                        placeholder={AppConstants.addressOne}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "street1", parentIndex)}
                                        setFieldsValue={parent.street1}
                                    />
                                )}
                            </Form.Item>
                            <InputWithHead
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "street2", parentIndex)}
                                value={parent.street2}
                            />
                            <InputWithHead heading={AppConstants.suburb} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`parentSuburb${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                    <InputWithHead
                                        // required={"required-field pt-0 pb-0"}
                                        // heading={AppConstants.suburb}
                                        placeholder={AppConstants.suburb}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "suburb", parentIndex)}
                                        setFieldsValue={parent.suburb}
                                    />
                                )}
                            </Form.Item>
                            <div className="row">
                                <div className="col-sm-12 col-lg-6">
                                    <InputWithHead heading={AppConstants.state} required={"required-field"} />
                                    <Form.Item>
                                        {getFieldDecorator(`parentStateRefId${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder={AppConstants.state}
                                                onChange={(e) => this.onChangeSetParentValue(e, "stateRefId", parentIndex)}
                                                setFieldsValue={parent.stateRefId}>
                                                {stateList.length > 0 && stateList.map((item) => (
                                                    < Option key={item.id} value={item.id}> {item.name}</Option>
                                                ))
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-lg-6">
                                    <InputWithHead heading={AppConstants.postCode} required={"required-field"} />
                                    <Form.Item>
                                        {getFieldDecorator(`parentPostalCode${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                placeholder={AppConstants.postcode}
                                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "postalCode", parentIndex)}
                                                setFieldsValue={parent.postalCode}
                                                maxLength={4}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <InputWithHead heading={AppConstants.country} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`parentCountryRefId${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                                })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.country}
                                        onChange={(e) => this.onChangeSetParentValue(e, "countryRefId", parentIndex)}
                                        setFieldsValue={parent.countryRefId}>
                                        {countryList.length > 0 && countryList.map((item) => (
                                            < Option key={item.id} value={item.id}> {item.description}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                    )}
                </div>
            )

        } catch (ex) {
            console.log("Error in parentOrGuardianAddressView" + ex);
        }
    }

    parentOrGuardianView = (getFieldDecorator) => {
        const { registrationObj, parents } = this.props.userRegistrationState;
        let hasErrorParent = this.state.hasErrorParent;
        return (
            <div className="registration-form-view">
                <div className="form-heading" style={{ paddingBottom: "0px" }}>{AppConstants.parentOrGuardianDetail}</div>
                {isArrayNotEmpty(parents) && (
                    <div>
                        <InputWithHead heading={AppConstants.selectParentOrGuardian} />
                        <Select
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(e) => this.onChangeSetParticipantValue(e, "tempParents")} >
                            {parents.length > 0 && parents.map((tParent, tpIndex) => (
                                <Option key={tParent.email} value={tParent.email}>
                                    {tParent.firstName + " " + tParent.lastName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}

                {(registrationObj.parentOrGuardian || []).map((parent, parentIndex) => {
                    let hasErrorParentviaIndex = hasErrorParent.find(element => element.parentIndex == parentIndex);
                    let hasError = false;
                    if (hasErrorParentviaIndex != undefined) {
                        hasError = hasErrorParentviaIndex.error;
                    }
                    return (
                        <div key={"parent" + parentIndex} className="light-grey-border-box">
                            {(registrationObj.parentOrGuardian.length != 1 || isArrayNotEmpty(parents)) && (
                                <div className="orange-action-txt" style={{ marginTop: "30px" }}
                                    onClick={() => { this.addParent("remove", parentIndex) }}
                                >{AppConstants.cancel}
                                </div>
                            )}
                            <div className="form-heading"
                                style={(registrationObj.parentOrGuardian.length != 1 || isArrayNotEmpty(parents)) ?
                                    { paddingBottom: "0px", marginTop: "10px" } :
                                    { paddingBottom: "0px", marginTop: "30px" }}>
                                {AppConstants.newParentOrGuardian}
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentFirstName${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.firstName}
                                                placeholder={AppConstants.firstName}
                                                onChange={(e) => this.onChangeSetParentValue(captializedString(e.target.value), "firstName", parentIndex)}
                                                setFieldsValue={parent.firstName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    [`parentFirstName${parentIndex}`]: captializedString(i.target.value)
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentMiddleName${parentIndex}`, {
                                            rules: [{ required: false }],
                                        })(
                                            <InputWithHead
                                                required={"pt-0 pb-0"}
                                                heading={AppConstants.middleName}
                                                placeholder={AppConstants.middleName}
                                                onChange={(e) => this.onChangeSetParentValue(captializedString(e.target.value), "middleName", parentIndex)}
                                                setFieldsValue={parent.middleName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    [`parentMiddleName${parentIndex}`]: captializedString(i.target.value)
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-md-12">
                                    <Form.Item>
                                        {getFieldDecorator(`parentLastName${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.lastName}
                                                placeholder={AppConstants.lastName}
                                                onChange={(e) => this.onChangeSetParentValue(captializedString(e.target.value), "lastName", parentIndex)}
                                                setFieldsValue={parent.lastName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    [`parentLastName${parentIndex}`]: captializedString(i.target.value)
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6">
                                    <Form.Item
                                        name={AppConstants.contactNO}
                                        rules={[{ required: true, message: ValidationConstants.contactField }]}
                                        help={hasError && ValidationConstants.mobileLength}
                                        validateStatus={hasError ? "error" : 'validating'}
                                    >
                                        {getFieldDecorator(`parentMobileNumber${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.contactField }],

                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.mobile}
                                                placeholder={AppConstants.mobile}
                                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "mobileNumber", parentIndex)}
                                                setFieldsValue={parent.mobileNumber}
                                                maxLength={10}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentEmail${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.emailField[0] },
                                            {
                                                type: "email",
                                                pattern: new RegExp(AppConstants.emailExp),
                                                message: ValidationConstants.email_validation
                                            }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.email}
                                                placeholder={AppConstants.email}
                                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "email", parentIndex)}
                                                setFieldsValue={parent.email}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <Checkbox
                                className="single-checkbox"
                                checked={parent.isSameAddress}
                                onChange={e => this.onChangeSetParentValue(e.target.checked, "isSameAddress", parentIndex)} >
                                {AppConstants.sameAddress}
                            </Checkbox>
                            {!parent.isSameAddress && (
                                <div>{this.parentOrGuardianAddressView(parent, parentIndex, getFieldDecorator)}</div>
                            )}
                        </div>
                    );
                })}
                <div className="orange-action-txt" style={{ marginTop: "10px" }}
                    onClick={() => { this.addParent("add") }}
                >+ {AppConstants.addNewParentGaurdian}</div>
            </div>
        )
    }

    emergencyContactView = (getFieldDecorator) => {
        let hasErrorEmergency = this.state.hasErrorEmergency;
        try {
            let { registrationObj } = this.props.userRegistrationState;
            return (
                <div className="registration-form-view">
                    <div className="form-heading">{AppConstants.emergencyContact}</div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`emergencyFirstName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.firstName}
                                        placeholder={AppConstants.firstName}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyFirstName")}
                                        setFieldsValue={registrationObj.emergencyFirstName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`emergencyFirstName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`emergencyLastName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.lastName}
                                        placeholder={AppConstants.lastName}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyLastName")}
                                        setFieldsValue={registrationObj.emergencyLastName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`emergencyLastName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Form.Item
                                help={hasErrorEmergency && ValidationConstants.mobileLength}
                                validateStatus={hasErrorEmergency ? "error" : 'validating'}
                            >
                                {getFieldDecorator(`emergencyContactNumber`, {
                                    rules: [{ required: true, message: ValidationConstants.pleaseEnterMobileNumber }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.mobileNumber}
                                        placeholder={AppConstants.mobileNumber}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyContactNumber")}
                                        setFieldsValue={registrationObj.emergencyContactNumber}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`emergencyContactNumber`]: captializedString(i.target.value)
                                        })}
                                        maxLength={10}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>
            )
        } catch (ex) {
            console.log("Error in emergencyContactView::" + ex)
        }
    }

    selectCompetitionStepView = (getFieldDecorator) => {
        const { registrationObj, expiredRegistration } = this.props.userRegistrationState;
        return (
            <div>
                <div>{this.addedParticipantWithProfileView()}</div>
                {!this.state.showAddAnotherCompetitionView && (
                    <div>
                        {expiredRegistration == null ?
                            <div>
                                {(registrationObj.competitions || []).map((competition, competitionIndex) => (
                                    <div ref={(ref) => this.ref = ref}>{this.competitionDetailView(competition, competitionIndex, getFieldDecorator)}</div>
                                ))}
                            </div>
                            :
                            <div>{this.expiredRegistrationView()}</div>
                        }
                    </div>
                )}
                {this.state.showAddAnotherCompetitionView ?
                    <div>{this.findAnotherCompetitionView()}</div>
                    :
                    <div>
                        {expiredRegistration == null && (
                            <div className="orange-action-txt"
                                style={{ marginTop: "20px" }}
                                onClick={() => this.setState({ showAddAnotherCompetitionView: true, organisationId: null })}><span className="add-another-button-border">+ {AppConstants.addAnotherCompetition}</span></div>
                        )}
                    </div>
                }
            </div>
        )
    }

    addedParticipantWithProfileView = () => {
        try {
            let userRegistrationstate = this.props.userRegistrationState;
            let registrationObj = userRegistrationstate.registrationObj;
            return (
                <div className="registration-form-view">
                    <div className="row" style={{ alignItems: "center", margin: 0 }}>
                        {registrationObj.photoUrl ?
                            <div className="col-sm-1.5">
                                <img
                                    height="80px"
                                    width="80px"
                                    style={{ borderRadius: "50%" }}
                                    src={registrationObj.photoUrl} />
                            </div>
                            :
                            <div className="profile-default-img">
                                {registrationObj.firstName.slice(0, 1)}{registrationObj.lastName.slice(0, 1)}
                            </div>
                        }
                        <div className="col" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', paddingRight: 0 }}>
                            <div>
                                <div style={{ fontWeight: "600", marginBottom: "5px" }}>{AppConstants.participant}</div>
                                <div className="form-heading" style={{ textAlign: "start", marginRight: 10 }}>{registrationObj.firstName} {registrationObj.lastName}</div>
                                {(registrationObj.genderRefId || registrationObj.dateOfBirth) && (
                                    <div style={{ fontWeight: "600", marginTop: "-5px" }}>
                                        {registrationObj.genderRefId && (registrationObj.genderRefId == 1 ? 'Female' : registrationObj.genderRefId == 2 ? 'Male' : 'Non-Binary')}, {registrationObj.dateOfBirth && moment(registrationObj.dateOfBirth, "MM-DD-YYYY").format("DD/MM/YYYY")}
                                    </div>
                                )}
                            </div>
                            <div className="orange-action-txt" style={{ alignSelf: "center", margin: "5px 0" }}
                                onClick={() => this.selectAnotherParticipant()}>+{AppConstants.selectAnotherUser}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } catch (ex) {
            console.log("Error in addedParticipantWithProfileView::" + ex);
        }
    }

    findAnotherCompetitionView = () => {
        try {
            let { membershipProductInfo } = this.props.userRegistrationState;
            let organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == this.state.organisationId);
            return (
                <div className="registration-form-view">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="form-heading" style={{ marginRight: 10 }}>{AppConstants.findACompetition}</div>
                        <div className="orange-action-txt"
                            style={{ marginLeft: "auto", paddingBottom: "7.5px" }}
                            onClick={() => this.setState({ showAddAnotherCompetitionView: false, organisationId: null })}>{AppConstants.cancel}</div>
                    </div>
                    <div className="light-grey-border-box">
                        <div className="row">
                            <div className="col post-code-input">
                                <InputWithHead
                                    allowClear
                                    heading={AppConstants.postCode}
                                    value={this.state.postalCode}
                                    placeholder={AppConstants.postCode}
                                    onChange={(e) => this.onChangeSetPostalCode(e.target.value)}
                                />
                            </div>
                            <div className="col" style={{ alignSelf: "center" }}>
                                <Button
                                    type="primary"
                                    onClick={() => this.searchOrganisationByPostalCode()}
                                    className="open-reg-button postal-code-button">{AppConstants.search}</Button>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.organisationName} />
                        <Select
                            showSearch
                            optionFilterProp="children"
                            onChange={(e) => this.onChangeSetOrganisation(e)}
                            style={{ width: "100%", paddingRight: 1 }}
                            value={this.state.organisationId ? this.state.organisationId : -1}>
                            {(this.state.organisationId == null || this.state.organisationId == undefined) && (
                                < Option key={"Please select"} value={-1}> {AppConstants.pleaseSelect}</Option>
                            )}
                            {(this.state.organisations || []).map((item) => (
                                < Option key={item.organisationUniqueKey} value={item.organisationUniqueKey}> {item.organisationName}</Option>
                            ))}
                        </Select>
                        {organisationInfo && (
                            <div className="organisation-info-wrapper">
                                {organisationInfo.organisationLogoUrl ?
                                    <img className="profile-img" src={organisationInfo.organisationLogoUrl} />
                                    :
                                    <img className="profile-img" style={{ borderRadius: "20%" }} src={AppImages.compDefaultIcon} />
                                }
                                <div style={{ width: "170px" }}>{organisationInfo.street1} {organisationInfo.street2} {organisationInfo.suburb} {organisationInfo.state} {organisationInfo.postalCode}</div>
                                {organisationInfo.mobileNumber && (
                                    <div style={{ minWidth: 120 }}><img className="icon-size-20" style={{ marginRight: "15px" }} src={AppImages.callAnswer} />{organisationInfo.mobileNumber}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="row" style={{ marginTop: "30px" }}>
                        {(this.state.competitions || []).map((competition, competitionIndex) => (
                            <div
                                className="col-md-6 col-sm-12 pointer"
                                onClick={() => this.addAnotherCompetition(competition)}
                                key={competition.competitionUniqueKey}
                                style={{ marginBottom: "20px" }}
                            >
                                <div style={{ border: "1px solid var(--app-f0f0f2)", borderRadius: "10px", padding: "20px", height: '100%' }}>
                                    <div style={{
                                        height: "150px",
                                        display: "flex",
                                        justifyContent: "center",
                                        borderRadius: "10px 10px 0px 0px",
                                        margin: "-20px -20px -0px -20px",
                                        borderBottom: "1px solid var(--app-f0f0f2)"
                                    }}>
                                        <img
                                            style={{
                                                height: 149,
                                                width: '100%',
                                                borderRadius: "10px 10px 0px 0px",
                                                overflow: "hidden",
                                                objectFit: 'contain'
                                            }}
                                            src={competition.heroImageUrl}
                                        />
                                    </div>
                                    <div className="form-heading" style={{ marginTop: "20px", textAlign: "start" }}>{competition.competitionName}</div>
                                    <div style={{ fontWeight: "600", marginBottom: "10px" }}>{competition.compOrgName}</div>
                                    <div style={{ fontWeight: "600", display: 'flex', alignItems: 'center' }}>
                                        <img className="icon-size-25" style={{ marginRight: "5px" }} src={AppImages.calendarGrey} />
                                        <div>{competition.registrationOpenDate} - {competition.registrationCloseDate}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {this.state.competitions?.length > 0 ?
                        (
                            <Pagination
                                onChange={(e) => this.pagingCompetitions(e)}
                                pageSize={this.state.competitionsCountPerPage}
                                current={this.state.currentCompetitions}
                                style={{ textAlign: "center" }}
                                //total={this.state.organisationId == null ? this.state.allCompetitions.length : this.state.allCompetitionsByOrgId.length}
                                total={this.state.allCompetitionsByOrgId.length}
                                itemRender={this.paginationItems} />
                        )
                        :
                        (
                            <div>
                                {this.state.organisationId && (
                                    <div className="form-heading" style={{ fontSize: "20px", justifyContent: "center" }}>{AppConstants.noCompetitionsForOrganisations}</div>
                                )}
                            </div>
                        )
                    }
                </div>
            )
        } catch (ex) {
            console.log("Error in findAnotherCompetitionView::" + ex)
        }

    }

    competitionDetailView = (competition, competitionIndex, getFieldDecorator) => {
        const { playerPositionList, tShirtSizeList } = this.props.commonReducerState;
        let competitionInfo = competition.competitionInfo;
        let contactDetails = competitionInfo.replyName || competitionInfo.replyPhone || competitionInfo.replyEmail ?
            competitionInfo.replyName + ' ' + competitionInfo.replyPhone + ' ' + competitionInfo.replyEmail : '';
        let organisationPhotos = this.getOrganisationPhotos(competition.organisationInfo.organisationPhotos);
        return (
            <div className="registration-form-view" key={competitionIndex}>
                {competitionInfo.heroImageUrl && (
                    <div className="map-style" style={{ overflow: "hidden" }}>
                        <img style={{ height: "249px", width: '100%', objectFit: 'contain', borderRadius: "10px 10px 0px 0px" }} src={competitionInfo.heroImageUrl} />
                    </div>
                )}
                <div>
                    <div className="row" style={competitionInfo.heroImageUrl ? { marginTop: "30px", marginLeft: "0px", marginRight: "0px" } : { marginLeft: "0px", marginRight: "0px" }}>
                        <div className="col-sm-1.5 mr-4" style={{ display: "flex", alignItems: 'center' }}>
                            {competition.organisationInfo.organisationLogoUrl ?
                                <img className="profile-img" src={competition.organisationInfo.organisationLogoUrl} />
                                :
                                <img className="profile-img" style={{ borderRadius: "20%" }} src={AppImages.compDefaultIcon} />
                            }
                        </div>
                        <div className="col" style={{ padding: 0 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div className="form-heading">{competition.competitionInfo.organisationName}</div>
                                    <div style={{ textAlign: "start", fontWeight: "600", marginRight: 10, marginBottom: 5 }}>{competition.competitionInfo.stateOrgName} - {competition.competitionInfo.competitionName}</div>
                                    <div style={{ fontWeight: "600", display: 'flex', alignItems: 'center' }}>
                                        <img className="icon-size-25" style={{ marginRight: "5px" }} src={AppImages.calendarGrey} />
                                        <div>{competition.competitionInfo.registrationOpenDate} - {competition.competitionInfo.registrationCloseDate}</div>
                                    </div>
                                </div>
                                <div className="orange-action-txt" style={{ margin: "5px 0" }}
                                    onClick={() => this.findAnotherCompetition(competitionIndex)}
                                >
                                    {competitionIndex == 0 ? AppConstants.findAnotherCompetition : AppConstants.cancel}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="light-grey-border-box">
                        <div className="form-heading" style={{ marginTop: '20px' }}>{AppConstants.membershipDetails}</div>
                        <div className="competition-specifics-headings required-field" style={{ paddingTop: '6px' }}>{AppConstants.registeringIndividualTo}</div>
                        {(competitionInfo.membershipProducts.filter(x => x.isIndividualRegistration == 1) || []).map((membershipProduct, membershipProductIndex) => (
                            <Checkbox
                                className="membership-product-checkbox py-2"
                                checked={membershipProduct.isChecked}
                                key={membershipProduct.competitionMembershipProductId + membershipProductIndex}
                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.checked, "products", competitionIndex, membershipProductIndex)}>
                                {membershipProduct.shortName}</Checkbox>
                        ))}

                        {this.isNetSetGo(competition, competitionIndex) && (
                            <div>
                               <div className="input-style-bold required-field">{AppConstants.tShirtSize}</div>
                               <Form.Item>
                               {getFieldDecorator(`tShirtSizeRefId${competitionIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.fillTshirtSizeInformation }],
                                })(
                                    <Select
                                        style={{ width: "30%", paddingRight: 1 }}
                                        placeholder={AppConstants.select}
                                        setFieldsValue={competition.tShirtSizeRefId}
                                        onChange={(e) => this.onChangeSetCompetitionValue(e, "tShirtSizeRefId", competitionIndex)}
                                    >
                                        {(tShirtSizeList || []).map((tShirtSize, tShirtSizeListIndex) => (
                                            <Option key={"division" + tShirtSize.id}
                                                value={tShirtSize.id}>{tShirtSize.name}</Option>
                                        ))}
                                    </Select>
                                )}
                                </Form.Item>
                            </div>
                        )}

                        {this.isPlayerActive(competition) && (
                            <div>
                                <div className="input-style-bold required-field">{AppConstants.registrationDivisions}</div>
                                <div
                                    style={{ marginBottom: "10px" }}>
                                    {(competition.divisions || []).map((division, divisionIndex) => (
                                        // <Tag
                                        // key={division.competitionMembershipProductDivisionId + divisionIndex}
                                        // style={{marginBottom: "10px"}}
                                        // closable
                                        // color="volcano"
                                        // onClose={(e) => this.onChangeSetCompetitionValue(e,"divisions",competitionIndex,divisionIndex)}>{division.divisionName}</Tag>
                                        <span style={{
                                            padding: "3px 5px",
                                            borderRadius: "5px",
                                            backgroundColor: "white",
                                            border: "1px solid var(--app-d9d9d9)",
                                            margin: "0px 10px 10px 0px"
                                        }}>{division.divisionName} <span style={{ cursor: "pointer", marginLeft: "5px", color: "var(--app-color)" }} onClick={(e) => this.onChangeSetCompetitionValue(e, "divisions", competitionIndex, divisionIndex)}>&#10005;</span></span>
                                    ))}
                                </div>
                                {/* <Select
                                    style={{ width: "100%", paddingRight: 1 }}
                                    onChange={(e) => this.onChangeSetCompetitionValue(e, "divisionInfo", competitionIndex)}
                                >
                                    {(competition.divisionInfo || []).map((divisionInfo, divisionInfoIndex) => (
                                        <Option key={divisionInfo.competitionMembershipProductDivisionId + divisionInfoIndex}
                                            value={divisionInfo.competitionMembershipProductDivisionId}>{divisionInfo.divisionName}</Option>
                                    ))}
                                </Select> */}
                                <Select
                                    style={{ width: "100%", paddingRight: 1 }}
                                    // value={competition.divisions.length == 0 ? null : competition.divisionInfoIndex}
                                    value={competition.divisionInfoIndex}
                                    onChange={(index) => this.onChangeDivisionInfo(index, competitionIndex, competition.divisionInfo)}
                                >
                                    {(competition.divisionInfo || []).map((divisionInfo, divisionInfoIndex) => (
                                        <Option key={"division" + divisionInfoIndex}
                                            value={divisionInfoIndex}>{divisionInfo.divisionName}</Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <div className="input-style-bold">{AppConstants.totalsinglegamefees}</div>
                                <div className="form-heading">{!this.props.userRegistrationState.getSeasonalCasualFeesOnLoad ? ('$' + (competition.fees.totalCasualFee)) : (<div style={{ textAlign: "center" }}><Spin /></div>)}
                                    <span style={{ fontSize: "12px", alignSelf: "flex-end", marginBottom: "5px" }}>&#8199;incl.GST</span>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div className="input-style-bold">{AppConstants.totalSeasonalFees}</div>
                                <div className="form-heading">{!this.props.userRegistrationState.getSeasonalCasualFeesOnLoad ? ('$' + (competition.fees.totalSeasonalFee)) : (<div style={{ textAlign: "center" }}><Spin /></div>)}
                                    <span style={{ fontSize: "12px", alignSelf: "flex-end", marginBottom: "5px" }}>&#8199;incl.GST</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="competition-specifics">{AppConstants.competitionSpecifics}</div>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col-sm-12 col-lg-4">
                            {/* <InputWithHead heading={AppConstants.training}/> */}
                            <div className="input-style-bold" style={{ paddingTop: '0px' }}>{AppConstants.training}</div>
                            <div
                                className="competition-specifics-information">
                                {competition.competitionInfo.training ?
                                    competition.competitionInfo.training :
                                    AppConstants.noInformationProvided}
                            </div>
                            {/* <InputWithHead heading={AppConstants.specialNotes}/> */}
                            <div className="input-style-bold">{AppConstants.specialNotes}</div>
                            <div
                                className="competition-specifics-information">
                                {competition.competitionInfo.specialNote ?
                                    competition.competitionInfo.specialNote :
                                    AppConstants.noInformationProvided}
                            </div>
                            {/* <InputWithHead heading={AppConstants.venue}/> */}
                            <div className="input-style-bold">{AppConstants.competitionVenue}</div>
                            <div
                                className="competition-specifics-information">
                                {competitionInfo.venues == null || competitionInfo.venues.length == 0 ? AppConstants.noInformationProvided :
                                    <span>
                                        {(competitionInfo.venues || []).map((v, vIndex) => (
                                            <span>
                                                <span>{v.venueName}</span>
                                                <span>{competitionInfo.venues.length != (vIndex + 1) ? ', ' : ''}</span>
                                            </span>
                                        ))}
                                    </span>
                                }
                            </div>
                            {/* <InputWithHead heading={AppConstants.contactDetails}/> */}
                            <div className="input-style-bold">{AppConstants.contactDetails}</div>
                            <div
                                className="competition-specifics-information">
                                {contactDetails ? contactDetails :
                                    AppConstants.noInformationProvided}
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-8 mt-5">
                            <Carousel autoplay
                                style={{
                                    marginTop: "16px",
                                    height: "160px",
                                    borderRadius: "10px",
                                    display: "flex"
                                }}>
                                {(organisationPhotos || []).map((photo, photoIndex) => (
                                    <div>
                                        <div className="registration-competition-venue-form-wrapper">
                                            <div style={{ marginRight: "25px", marginBottom: "10px" }}>
                                                <div className="font-bold-carosal" style={{ marginBottom: "10px" }}>{photo.photoType1}</div>
                                                <img style={{ height: "158px", margin: "auto", fontWeight: "500" }} src={photo.photoUrl1} />
                                            </div>
                                            <div>
                                                <div className="font-bold-carosal" style={{ marginBottom: "10px" }}>{photo?.photoType2}</div>
                                                <img style={{ height: "158px", margin: "auto", fontWeight: "500" }} src={photo?.photoUrl2} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>

                    {competition.regSetting.nominate_positions == 1 && this.isPlayerActive(competition) && (
                        <div>
                            <div className="form-heading" style={{ marginTop: "30px" }}>{AppConstants.indicatePreferredPlayerPosition}</div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead heading={AppConstants.position1} />
                                    <Select
                                        style={{ width: "100%", paddingRight: 1 }}
                                        onChange={(e) => this.onChangeSetCompetitionValue(e, "positionId1", competitionIndex)}
                                        value={competition.positionId1}
                                    >
                                        {(playerPositionList || []).map((play1, index) => (
                                            <Option key={play1.id} value={play1.id}>{play1.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead heading={AppConstants.position2} />
                                    <Select
                                        style={{ width: "100%", paddingRight: 1 }}
                                        onChange={(e) => this.onChangeSetCompetitionValue(e, "positionId2", competitionIndex)}
                                        value={competition.positionId2}
                                    >
                                        {(playerPositionList || []).map((play2, index) => (
                                            <Option key={play2.id} value={play2.id}>{play2.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {competition.regSetting.play_friend == 1 && this.isPlayerActive(competition) && (
                        <div>
                            <div className="form-heading" style={{ marginTop: "30px" }}>{AppConstants.playWithFriend}</div>
                            <div className="inter-medium-font">{AppConstants.playWithFriendSubtitle}</div>
                            {(competition.friends || []).map((friend, friendIndex) => (
                                <div className="light-grey-border-box">
                                    {competition.friends.length != 1 && (
                                        <div
                                            className="orange-action-txt"
                                            style={{ marginTop: "20px" }}
                                            onClick={e => this.addFriend("remove", competitionIndex, friendIndex)}>
                                            {AppConstants.cancel}
                                        </div>
                                    )}
                                    <div className="form-heading" style={{ marginTop: "20px" }}>{AppConstants.friend} {friendIndex + 1}</div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead
                                                heading={AppConstants.firstName}
                                                placeholder={AppConstants.firstName}
                                                onChange={(e) => this.onChangeSetCompetitionValue(captializedString(e.target.value), "firstName", competitionIndex, friendIndex, "friends")}
                                                value={friend.firstName}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead
                                                heading={AppConstants.middleName}
                                                placeholder={AppConstants.middleName}
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "middleName", competitionIndex, friendIndex, "friends")}
                                                value={friend.middleName}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <InputWithHead
                                                heading={AppConstants.lastName}
                                                placeholder={AppConstants.lastName}
                                                onChange={(e) => this.onChangeSetCompetitionValue(captializedString(e.target.value), "lastName", competitionIndex, friendIndex, "friends")}
                                                value={friend.lastName}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.phone} placeholder={AppConstants.phone}
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "mobileNumber", competitionIndex, friendIndex, "friends")}
                                                value={friend.mobileNumber}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email}
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "email", competitionIndex, friendIndex, "friends")}
                                                value={friend.email}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="orange-action-txt"
                                style={{ marginTop: "15px" }}
                                onClick={e => this.addFriend("add", competitionIndex)}>+ {AppConstants.addfriend}
                            </div>
                        </div>
                    )}

                    {competition.regSetting.refer_friend == 1 && this.isPlayerActive(competition) && (
                        <div>
                            <div className="form-heading" style={{ marginTop: "30px" }}>{AppConstants.referfriend}</div>
                            <div className="inter-medium-font">{AppConstants.referFriendSubTitle}</div>
                            {(competition.referFriends || []).map((referFriend, referFriendIndex) => (
                                <div className="light-grey-border-box">
                                    {competition.referFriends.length != 1 && (
                                        <div
                                            className="orange-action-txt"
                                            style={{ marginTop: "20px" }}
                                            onClick={e => this.addReferFriend("remove", competitionIndex, referFriendIndex)}>
                                            {AppConstants.cancel}
                                        </div>
                                    )}
                                    <div className="form-heading" style={{ marginTop: "20px" }}>{AppConstants.friend} {referFriendIndex + 1}</div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.firstName} placeholder={AppConstants.firstName}
                                                onChange={(e) => this.onChangeSetCompetitionValue(captializedString(e.target.value), "firstName", competitionIndex, referFriendIndex, "referFriends")}
                                                value={referFriend.firstName}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.middleName} placeholder={AppConstants.middleName}
                                                onChange={(e) => this.onChangeSetCompetitionValue(captializedString(e.target.value), "middleName", competitionIndex, referFriendIndex, "referFriends")}
                                                value={referFriend.middleName}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <InputWithHead heading={AppConstants.lastName} placeholder={AppConstants.lastName}
                                                onChange={(e) => this.onChangeSetCompetitionValue(captializedString(e.target.value), "lastName", competitionIndex, referFriendIndex, "referFriends")}
                                                value={referFriend.lastName}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.phone} placeholder={AppConstants.phone}
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "mobileNumber", competitionIndex, referFriendIndex, "referFriends")}
                                                value={referFriend.mobileNumber}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email}
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "email", competitionIndex, referFriendIndex, "referFriends")}
                                                value={referFriend.email}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div
                                className="orange-action-txt"
                                style={{ marginTop: "15px" }}
                                onClick={e => this.addReferFriend("add", competitionIndex)}>+ {AppConstants.addfriend}</div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    expiredRegistrationView = () => {
        const { expiredRegistration } = this.props.userRegistrationState;
        return (
            <div className="registration-form-view">
                {expiredRegistration.heroImageUrl && (
                    <div className="map-style">
                        <img style={{ height: "249px", width: '100%', objectFit: 'contain', borderRadius: "10px 10px 0px 0px" }} src={expiredRegistration.heroImageUrl} />
                    </div>
                )}
                <div className="row" style={expiredRegistration.heroImageUrl ?
                    { marginTop: "30px", marginLeft: "0px", marginRight: "0px" } :
                    { marginLeft: "0px", marginRight: "0px" }}>
                    <div className="col-sm-1.5">
                        <img style={{ height: "60px", width: "60px", borderRadius: "50%" }}
                            src={expiredRegistration.compLogoUrl ? expiredRegistration.compLogoUrl : AppImages.defaultUser} />
                    </div>
                    <div className="col">
                        <div className="form-heading" style={{ paddingBottom: "0px" }}>{expiredRegistration.organisationName}</div>
                        <div style={{ fontWeight: "600", color: "black" }}>{expiredRegistration.stateOrgName} - {expiredRegistration.competitionName}</div>
                        <div style={{ fontWeight: "600", marginTop: "5px", display: 'flex', alignItems: 'center' }}>
                            <img className="icon-size-25" style={{ marginRight: "5px" }} src={AppImages.calendarGrey} />
                            <div>{expiredRegistration.registrationOpenDate} - {expiredRegistration.registrationCloseDate}</div>
                        </div>
                    </div>
                </div>
                <div className="light-grey-border-box" style={{ textAlign: "center" }}>
                    <div className="form-heading"
                        style={{ marginTop: "30px", justifyContent: "center", marginBottom: "5px" }}>{expiredRegistration.validateMessage}</div>
                    <Button
                        type="primary"
                        style={{ color: "white", textTransform: "uppercase" }}
                        onClick={() => this.findAnotherCompetition(0)}
                        className="open-reg-button">{AppConstants.findAnotherCompetition}</Button>
                </div>
            </div>
        )
    }

    additionalInfoStepView = (getFieldDecorator) => {
        const { registrationObj } = this.props.userRegistrationState;
        return (
            <div>
                {registrationObj != null && (<div>{this.addedParticipantWithProfileView()}</div>)}

                {(registrationObj != null && registrationObj.competitions || []).map((competition, competitionIndex) => (
                    <div>{this.additionalInfoAddCompetitionView(competition, competitionIndex)}</div>
                ))}
                <div>{this.additionalPersonalInfoView(getFieldDecorator)}</div>
            </div>
        )
    }

    additionalInfoAddCompetitionView = (competition, competitionIndex) => {
        return (
            <div className="registration-form-view">
                <div className="row" style={{ marginLeft: "0px", marginRight: "0px" }}>
                    <div className="col-sm-1.5 mr-4" style={{ display: "flex", alignItems: 'center' }}>
                        <img style={{ height: "60px", borderRadius: "50%" }} src={competition.competitionInfo.compLogoUrl} />
                    </div>
                    <div className="col" style={{ padding: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="form-heading">{competition.competitionInfo.organisationName}</div>
                                <div style={{ textAlign: "start", fontWeight: "600", marginRight: 10, marginBottom: 5 }}>{competition.competitionInfo.stateOrgName} - {competition.competitionInfo.competitionName}</div>
                                <div style={{
                                    fontWeight: "600",
                                    display: "flex", alignItems: "center"
                                }}>
                                    <img className="icon-size-25" style={{ marginRight: "5px" }} src={AppImages.calendarGrey} />
                                    <div>{competition.competitionInfo.registrationOpenDate} - {competition.competitionInfo.registrationCloseDate}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img className="icon-size-25" style={{ marginRight: "5px", marginLeft: "10px" }} src={AppImages.participant} />
                                        {(competition.products || []).map((product, productIndex) => (
                                            <span>
                                                <span>{product.membershipTypeName}</span>
                                                <span>{competition.products.length != productIndex + 1 ? ',' : ''}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ margin: "5px 0", display: "flex" }}>
                                <div className="orange-action-txt"
                                    onClick={() => this.setState({ currentStep: 1 })}>{AppConstants.edit}</div>
                                <span className="remove-edit-icon"><img src={AppImages.editIcon} /></span>
                                <div className="orange-action-txt" style={{ marginLeft: "20px" }}
                                    onClick={() => this.removeCompetition(competition.competitionId)}>{AppConstants.remove}</div>
                                <span className="remove-edit-icon"><img src={AppImages.removeIcon} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    walkingNetballQuestions = (getFieldDecorator) => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            return (
                <div>
                    <InputWithHead required={"pt-0 required-field"} heading={AppConstants.haveHeartTrouble} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoHeartTrouble`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heartTrouble", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.heartTrouble}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.havePainInHeartOrChest} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoChestPain`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "chestPain", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.chestPain}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.haveSpellsOfServerDizziness} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoFaintOrSpells`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "faintOrSpells", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.faintOrSpells}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.hasBloodPressureHigh} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoBloodPressure`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "bloodPressure", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.bloodPressure}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.hasBoneProblems} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoJointOrBoneProblem`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "jointOrBoneProblem", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.jointOrBoneProblem}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.whyShouldNotTakePhysicalActivity} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPhysicalActivity`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "physicalActivity", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.physicalActivity}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.pregnentInLastSixMonths} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPregnant`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "pregnant", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.pregnant}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.sufferAnyProblems} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoLowerBackProblem`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "lowerBackProblem", "walkingNetball")}
                                setFieldsValue={registrationObj.additionalInfo.walkingNetball.lowerBackProblem}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </div>
            )
        } catch (ex) {
            console.log("Error in walkingNetballQuestions::" + ex);
        }
    }

    additionalPersonalInfoView = (getFieldDecorator) => {
        try {
            const { registrationObj } = this.props.userRegistrationState;
            const { countryList, identifyAsList, disabilityList, favouriteTeamsList,
                firebirdPlayerList, otherSportsList, heardByList, accreditationUmpireList, accreditationCoachList, walkingNetballQuesList, schoolList } = this.props.commonReducerState;
            let yearsOfPlayingList = [{ years: '2' }, { years: '3' }, { years: '4' }, { years: '5' }, { years: '6' }, { years: '7' }, { years: '8' }, { years: '9' }, { years: '10+' }];
            let walkingNetballQuesKeys = Object.keys(registrationObj.additionalInfo.walkingNetball);
            let hasAnyOneYes = walkingNetballQuesKeys.find(key => registrationObj.additionalInfo.walkingNetball[key] == 1);
            let hasOtherParticipantSports = registrationObj.additionalInfo.otherSportsInfo.find(x => x == "14");
            let childrenCheckExpiryDate = registrationObj.additionalInfo.childrenCheckExpiryDate ? moment(registrationObj.additionalInfo.childrenCheckExpiryDate, "MM-DD-YYYY") : null;
            console.log("childrenCheckExpiryDate", childrenCheckExpiryDate)
            let accreditationCoachExpiryDate = registrationObj.additionalInfo.accreditationCoachExpiryDate ? moment(registrationObj.additionalInfo.accreditationCoachExpiryDate, "MM-DD-YYYY") : null;
            let accreditationUmpireExpiryDate = registrationObj.additionalInfo.accreditationUmpireExpiryDate ? moment(registrationObj.additionalInfo.accreditationUmpireExpiryDate, "MM-DD-YYYY") : null;
            return (
                <div className="registration-form-view">
                    <div className="form-heading">{AppConstants.additionalPersonalInformation}</div>
                    <InputWithHead heading={AppConstants.whichCountryWereBorn} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoCountryRefId`, {
                            rules: [{ required: true, message: ValidationConstants.countryField }],
                        })(
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.select}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e, "countryRefId")}
                                setFieldsValue={registrationObj.additionalInfo.countryRefId}>
                                {countryList.length > 0 && countryList.map((item) => (
                                    < Option key={item.id} value={item.id}> {item.description}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.doYouIdentifyAs} required={"required-field"} />
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"identifyRefId")}
                        value={registrationObj.additionalInfo.identifyRefId}>
                        {(identifyAsList || []).map((identification, identificationIndex) => (
                            <Radio key={identification.id} value={identification.id}>{identification.description}</Radio>
                        ))}
                    </Radio.Group>
                    <InputWithHead heading={AppConstants.anyExistingMedicalCondition} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAnyExistingMedialCondition`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[1] }],
                        })(
                            <TextArea
                                placeholder={AppConstants.existingMedConditions}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "existingMedicalCondition")}
                                setFieldsValue={registrationObj.additionalInfo.existingMedicalCondition}
                                allowClear
                            />
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.anyRedularMedicalConditions} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAnyRedularMedicalConditions`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[2] }],
                        })(
                            <TextArea
                                placeholder={AppConstants.redularMedicalConditions}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "regularMedication")}
                                setFieldsValue={registrationObj.additionalInfo.regularMedication}
                                allowClear
                            />
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.injury} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoInjury`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[3] }],
                        })(
                            <TextArea
                                placeholder={AppConstants.anyInjury}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "injuryInfo")}
                                setFieldsValue={registrationObj.additionalInfo.injuryInfo}
                                allowClear
                            />
                        )}
                    </Form.Item>
                    {/* <InputWithHead heading={AppConstants.alergy} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAllergies`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[4] }],
                        })(
                            <TextArea
                                placeholder={AppConstants.anyAllergies}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "allergyInfo")}
                                setFieldsValue={registrationObj.additionalInfo.allergyInfo}
                                allowClear
                            />
                        )}
                    </Form.Item>    */}
                    <InputWithHead heading={AppConstants.haveDisability} required={"required-field"} />
                    {/* <Form.Item>
                        {getFieldDecorator(`additionalInfoHaveDisablity`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[5] }],
                        })(  */}
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isDisability")}
                        value={registrationObj.additionalInfo.isDisability}>
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    {/* )}
                    </Form.Item>    */}
                    {registrationObj.additionalInfo.isDisability == 1 ?
                        <div>
                            <InputWithHead heading={AppConstants.disabilityCareNumber} />
                            <Form.Item>
                                {getFieldDecorator(`additionalInfoDisablityCareNumber`, {
                                    rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[5] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.disabilityCareNumber}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityCareNumber")}
                                        setFieldsValue={registrationObj.additionalInfo.disabilityCareNumber}
                                        style={{ marginBottom: '15px' }} />
                                )}
                            </Form.Item>
                            <InputWithHead heading={AppConstants.typeOfDisability} required={"required-field"} />
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityTypeRefId")}
                                value={registrationObj.additionalInfo.disabilityTypeRefId}>
                                {(disabilityList || []).map((dis, disIndex) => (
                                    <Radio key={dis.id} value={dis.id}>{dis.description}</Radio>
                                ))}
                            </Radio.Group>
                        </div>
                        : null
                    }
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <InputWithHead heading={AppConstants.teamYouFollow} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`additionalInfoTeamYouFollow`, {
                                    rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                                })(
                                    <Select
                                        placeholder={AppConstants.select}
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182, paddingBottom: "10px" }}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteTeamRefId")}
                                        setFieldsValue={registrationObj.additionalInfo.favouriteTeamRefId}>
                                        {(favouriteTeamsList || []).map((fav, index) => (
                                            <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        {registrationObj.additionalInfo.favouriteTeamRefId == 6 && (
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.who_fav_bird} required={"required-field"} />
                                <Form.Item>
                                    {getFieldDecorator(`additionalInfoFavoriteBird`, {
                                        rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[7] }],
                                    })(
                                        <Select
                                            placeholder={AppConstants.select}
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182, paddingBottom: "10px" }}
                                            onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteFireBird")}
                                            setFieldsValue={registrationObj.additionalInfo.favouriteFireBird}
                                        >
                                            {(firebirdPlayerList || []).map((fire, index) => (
                                                <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                        )}
                    </div>

                    {(registrationObj.registeringYourself == 2) && (
                        <InputWithHead heading={AppConstants.childPlayingOtherParticipantSports} required={"required-field"} />
                    )}
                    {(registrationObj.registeringYourself == 1) && (
                        <InputWithHead heading={AppConstants.playingOtherParticipantSports} required={"required-field"} />
                    )}
                    {(registrationObj.registeringYourself == 3) && (
                        <InputWithHead heading={AppConstants.someOnePlayingOtherParticipantSports} required={"required-field"} />
                    )}
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPlayingOtherParticipantSports`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[7] }],
                        })(
                            <Select
                                mode="multiple"
                                showArrow
                                style={{ width: "100%", paddingTop: "-20px", paddingBottom: "10px" }}
                                placeholder={AppConstants.select}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e, "otherSportsInfo")}
                                setFieldsValue={registrationObj.additionalInfo.otherSportsInfo}>
                                {otherSportsList.length > 0 && otherSportsList.map((item) => (
                                    < Option key={item.id} value={item.id}> {item.description}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                    {hasOtherParticipantSports && (
                        <div style={{ marginTop: "20px" }}>
                            <InputWithHead
                                placeholder={AppConstants.pleaseSpecify}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "otherSports")}
                                value={registrationObj.additionalInfo.otherSports}
                            />
                        </div>
                    )}
                    <InputWithHead heading={AppConstants.hearAbouttheCompition} required={"required-field"} />
                    {/* <Form.Item>
                        {getFieldDecorator(`additionalInfoHeardAboutTheCompition`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[8] }],
                        })(  */}
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByRefId")}
                        value={registrationObj.additionalInfo.heardByRefId}>
                        {(heardByList || []).map((heard, index) => (
                            <Radio style={{ marginBottom: "10px" }} key={heard.id} value={heard.id}>{heard.description}</Radio>
                        ))}
                    </Radio.Group>
                    {/* )}
                    </Form.Item>    */}
                    {registrationObj.additionalInfo.heardByRefId == 6 && (
                        <div style={{ marginTop: "10px" }}>
                            <InputWithHead
                                placeholder={AppConstants.pleaseSpecify}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByOther")}
                                value={registrationObj.additionalInfo.heardByOther} />
                        </div>
                    )}
                    {/* <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.checked, "isConsentPhotosGiven")}
                        checked={registrationObj.additionalInfo.isConsentPhotosGiven}>{AppConstants.consentForPhotos}
                    </Checkbox> */}

                    {registrationObj.regSetting.netball_experience == 1 && (
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.firstYearPlayingNetball} />
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isYearsPlayed")}
                                    value={registrationObj.additionalInfo.isYearsPlayed}
                                >
                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                    <Radio value={0}>{AppConstants.no}</Radio>
                                </Radio.Group>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {registrationObj.additionalInfo.isYearsPlayed == 0 && (
                                    <div>
                                        <InputWithHead heading={AppConstants.yearsOfPlayingNetball} />
                                        <Select
                                            placeholder={AppConstants.yearsOfPlaying}
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                            onChange={(e) => this.onChangeSetAdditionalInfo(e, "yearsPlayed")}
                                            defaultValue={registrationObj.additionalInfo.yearsPlayed ? registrationObj.additionalInfo.yearsPlayed : '2'}
                                        >
                                            {(yearsOfPlayingList || []).map((item, index) => (
                                                <Option key={item.years} value={item.years}>{item.years}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(getAge(registrationObj.dateOfBirth) < 18) && (
                        <div>
                            {registrationObj.regSetting.school_standard == 1 && (
                                <div>
                                    {registrationObj.registeringYourself == 3 && (
                                        <InputWithHead heading={AppConstants.schoolSomeoneAttend} />
                                    )}
                                    {registrationObj.registeringYourself == 2 && (
                                        <InputWithHead heading={AppConstants.schoolYourChildAttend} />
                                    )}
                                    {registrationObj.registeringYourself == 1 && (
                                        <InputWithHead heading={AppConstants.schoolYouAttend} />
                                    )}
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "schoolId")}
                                        value={registrationObj.additionalInfo.schoolId}>
                                        {(schoolList || []).map((school, index) => (
                                            <Option key={school.id} value={school.id}>{school.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                            )}

                            {registrationObj.regSetting.school_grade == 1 && (
                                <div>
                                    <InputWithHead heading={(registrationObj.registeringYourself == 2 && AppConstants.yourChildSchoolGrade)
                                        || (registrationObj.registeringYourself == 1 && AppConstants.yourSchoolGrade)} />
                                    <InputWithHead
                                        placeholder={AppConstants.schoolGrade}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "schoolGradeInfo")}
                                        value={registrationObj.additionalInfo.schoolGradeInfo}
                                    />
                                </div>

                            )}

                            {registrationObj.regSetting.school_program == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.participatedSchoolProgram} />
                                    <Radio.Group
                                        className="registration-radio-group"
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isParticipatedInSSP")}
                                        value={registrationObj.additionalInfo.isParticipatedInSSP}
                                    >
                                        <Radio value={1}>{AppConstants.yes}</Radio>
                                        <Radio value={0}>{AppConstants.no}</Radio>
                                    </Radio.Group>
                                </div>
                            )}
                        </div>
                    )}

                    {/* show below when umpire or coach selected */}
                    <div>
                        {registrationObj.umpireFlag == 1 && (
                            <div>
                                <InputWithHead heading={AppConstants.nationalAccreditationLevelUmpire} required={"required-field"} />
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "accreditationLevelUmpireRefId")}
                                    value={registrationObj.additionalInfo.accreditationLevelUmpireRefId}
                                >
                                    {(accreditationUmpireList || []).map((accreditaiton, accreditationIndex) => (
                                        <Radio key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                    ))}
                                </Radio.Group>
                                {(registrationObj.additionalInfo.accreditationLevelUmpireRefId != null) && (
                                    <div>
                                        {registrationObj.additionalInfo.accreditationLevelUmpireRefId == 1 ?
                                            <div>
                                                <InputWithHead heading={AppConstants.newToUmpiring} />
                                                <Radio.Group
                                                    className="registration-radio-group"
                                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "newToUmpiring")}
                                                    value={registrationObj.additionalInfo.newToUmpiring}
                                                >
                                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                                    <Radio value={0}>{AppConstants.no}</Radio>
                                                </Radio.Group>
                                                {(registrationObj.additionalInfo.newToUmpiring == 0) && (
                                                    <div>
                                                        <InputWithHead heading={AppConstants.yourAssociationLevel} />
                                                        <InputWithHead
                                                            // heading={AppConstants.yourAssociationLevel}
                                                            placeholder={AppConstants.associationLevel}
                                                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "associationLevelInfo")}
                                                            value={registrationObj.additionalInfo.associationLevelInfo}
                                                        />
                                                        {(registrationObj.additionalInfo.associationLevelInfo != null && registrationObj.additionalInfo.associationLevelInfo.length > 0) && (
                                                            <DatePicker
                                                                size="large"
                                                                placeholder={AppConstants.expiryDate}
                                                                style={{ width: "100%", marginTop: "20px" }}
                                                                onChange={(e, f) => this.dateConversion(f, "accreditationUmpireExpiryDate", "additionalInfo")}
                                                                format={"DD-MM-YYYY"}
                                                                showTime={false}
                                                                value={accreditationUmpireExpiryDate} />
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                            :
                                            <DatePicker
                                                size="large"
                                                placeholder={AppConstants.expiryDate}
                                                style={{ width: "100%", marginTop: "20px" }}
                                                onChange={(e, f) => this.dateConversion(f, "accreditationUmpireExpiryDate", "additionalInfo")}
                                                format={"DD-MM-YYYY"}
                                                showTime={false}
                                                value={accreditationUmpireExpiryDate}
                                            />
                                        }
                                    </div>
                                )}
                                <InputWithHead heading={AppConstants.haveCompletedPrerequisites} required={"required-field"} />
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isPrerequestTrainingComplete")}
                                    value={registrationObj.additionalInfo.isPrerequestTrainingComplete}
                                >
                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                    <Radio value={0}>{AppConstants.no}</Radio>
                                </Radio.Group>
                            </div>
                        )}

                        {registrationObj.coachFlag == 1 && (
                            <div>
                                <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach} required={"required-field"} />
                                <Radio.Group
                                    style={{ flexDirection: "column" }}
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "accreditationLevelCoachRefId")}
                                    value={registrationObj.additionalInfo.accreditationLevelCoachRefId}
                                >
                                    {(accreditationCoachList || []).map((accreditaiton, accreditationIndex) => (
                                        <Radio style={{ marginBottom: "10px" }} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                    ))}
                                </Radio.Group>
                                {(registrationObj.additionalInfo.accreditationLevelCoachRefId != 1 && registrationObj.additionalInfo.accreditationLevelCoachRefId != null) && (
                                    <DatePicker
                                        size="large"
                                        placeholder={AppConstants.expiryDate}
                                        style={{ width: "100%", marginTop: "20px" }}
                                        onChange={(e, f) => this.dateConversion(f, "accreditationCoachExpiryDate", "additionalInfo")}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        value={accreditationCoachExpiryDate}
                                    />
                                )}
                            </div>
                        )}

                        {(registrationObj.umpireFlag == 1 || registrationObj.coachFlag == 1) && (
                            <div>
                                <InputWithHead heading={AppConstants.workingWithChildrenCheckNumber} />
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 media-input-mb">
                                        <InputWithHead
                                            placeholder={AppConstants.childrenNumber}
                                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "childrenCheckNumber")}
                                            value={registrationObj.additionalInfo.childrenCheckNumber}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                            <DatePicker
                                                size="large"
                                                placeholder={AppConstants.expiryDate}
                                                style={{ width: "100%" }}
                                                onChange={(e, f) => this.dateConversion(f, "childrenCheckExpiryDate", "additionalInfo")}
                                                format={"DD-MM-YYYY"}
                                                showTime={false}
                                                setFieldsValue={childrenCheckExpiryDate}
                                            />
                                    </div>
                                </div>
                            </div>
                        )}

                        {registrationObj.walkingNetballFlag == 1 && (
                            <div>
                                <div className="form-heading" style={{ marginTop: "40px", paddingBottom: "20px" }}>{AppConstants.walkingNetball2}</div>
                                {/* <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "walkingNetballRefId")}
                                    value={registrationObj.additionalInfo.walkingNetballRefId}
                                    >
                                    {(walkingNetballQuesList || []).map((ques,quesIndex) => (
                                        <Radio key={ques.id} value={ques.id}>{ques.description}</Radio>
                                    ))}
                                </Radio.Group> */}
                                {this.walkingNetballQuestions(getFieldDecorator)}
                                {hasAnyOneYes && (
                                    <div>
                                        <InputWithHead heading={AppConstants.provideFurtherDetails} required={"required-field"} />
                                        <Form.Item>
                                            {getFieldDecorator(`additionalInfoProvideFurtherDetails`, {
                                                rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                                            })(
                                                <InputWithHead
                                                    placeholder={AppConstants.walkingNetball2}
                                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "walkingNetballInfo")}
                                                    setFieldsValue={registrationObj.additionalInfo.walkingNetballInfo}
                                                />
                                            )}
                                        </Form.Item>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
        } catch (ex) {
            console.log("Error in additionalPersonalInfoView" + ex);
        }
    }

    stepsContentView = (getFieldDecorator) => {
        return (
            <div>
                {this.state.currentStep == 0 &&
                    <div>{this.participantDetailsStepView(getFieldDecorator)}</div>
                }
                {this.state.currentStep == 1 &&
                    <div>{this.selectCompetitionStepView(getFieldDecorator)}</div>
                }
                {this.state.currentStep == 2 &&
                    <div>{this.additionalInfoStepView(getFieldDecorator)}</div>
                }
            </div>
        )
    }

    contentView = (getFieldDecorator) => {
        let { registrationObj } = this.props.userRegistrationState;
        return (
            <div className="pt-0 registration-form-wrapper">
                {this.state.registrationId && (
                    <div className="orange-action-txt"
                        onClick={() => this.goToRegistrationProducts()}
                        style={{ marginBottom: "20px" }}>{AppConstants.returnToShoppingCart}
                        <img className="icon-size-20" style={{ marginLeft: "7px" }} src={AppImages.shoppingCartIcon} />
                    </div>
                )}
                {(registrationObj == null || registrationObj.registeringYourself == undefined) && (
                    <div>{this.addOrSelectParticipantView()}</div>
                )}
                {registrationObj != null && registrationObj.registeringYourself && (
                    <div>
                        <Steps className="registration-steps" current={this.state.currentStep} onChange={this.changeStep}>
                            <Step status={this.state.completedSteps.includes(0) && "finish"} title={AppConstants.participantDetails} />
                            <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && "finish"} title={AppConstants.selectCompetition} />
                            <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && this.state.completedSteps.includes(2) && "finish"} title={AppConstants.additionalInformation} />
                        </Steps>
                        {this.stepsContentView(getFieldDecorator)}
                        {this.singleCompModalView()}
                        {this.registrationCapValidationModal()}
                        {this.sameEmailValidationModal()}
                        {this.sameSomeOneEmailValidationModal()}
                    </div>
                )}
            </div>
        )
    }

    actionView = () => {
        let { registrationObj, expiredRegistration } = this.props.userRegistrationState;
        let expiredRegistrationExist = (this.state.currentStep == 1 && expiredRegistration != null) ? true : false;
        let showAddAnotherCompetitionViewTemp = (this.state.currentStep == 1 && this.state.showAddAnotherCompetitionView) ? true : false;
        return (
            <div>
                {registrationObj != null && registrationObj.registeringYourself &&
                    !showAddAnotherCompetitionViewTemp && !expiredRegistrationExist && (
                        <div className="form-registration-action">
                            <Button
                                htmlType="submit"
                                type="primary"
                                style={{ float: "right", color: "white", textTransform: "uppercase" }}
                                disabled={this.disabledOrNot()}
                                className="open-reg-button">{this.state.submitButtonText}</Button>
                        </div>
                    )}
            </div>
        )
    }

    singleCompModalView = () => {
        let { saveValidationErrorMsg } = this.props.userRegistrationState;
        let { saveValidationErrorCode } = this.props.userRegistrationState;
        let errorMsg = saveValidationErrorMsg != null ? saveValidationErrorMsg : [];
        let title = saveValidationErrorCode == 1 ? AppConstants.singleCompetition : AppConstants.userDetailsInvalid;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={title}
                    visible={this.state.singleCompModalVisible}
                    onCancel={() => this.setState({ singleCompModalVisible: false })}
                    footer={[
                        <Button onClick={() => this.setState({ singleCompModalVisible: false })}>
                            {AppConstants.ok}
                        </Button>
                    ]}
                >
                    {(errorMsg || []).map((item, index) => (
                        <p key={index}> {item}</p>
                    ))}
                </Modal>
            </div>
        )
    }

    registrationCapValidationModal = () => {
        const { registrationCapValidationMessage } = this.props.commonReducerState;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.warning}
                    visible={this.state.registrationCapModalVisible}
                    onCancel={() => this.setState({ registrationCapModalVisible: false })}
                    footer={[
                        <Button onClick={() => this.setState({ registrationCapModalVisible: false })}>
                            {AppConstants.ok}
                        </Button>
                    ]}
                >
                    <p> {registrationCapValidationMessage}</p>
                </Modal>
            </div>
        )
    }

    sameEmailValidationModal = () => {
        const { registrationObj, expiredRegistration } = this.props.userRegistrationState;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.warning}
                    visible={this.state.sameEmailValidationModalVisible}
                    onCancel={() => this.setState({ sameEmailValidationModalVisible: false })}
                    footer={[
                        <Button onClick={() => this.setState({ sameEmailValidationModalVisible: false })}>
                            {AppConstants.cancel}
                        </Button>,
                        <Button
                            // htmlType="submit"
                            // type="primary"
                            className="other-info-btn color-white"
                            onClick={() => {
                                this.onChangeSetParticipantValue(true, "referParentEmail");
                                this.setState({ sameEmailValidationModalVisible: false, hasChecked: false })
                                this.stepNavigation(registrationObj, expiredRegistration);
                                setTimeout(() => {
                                    this.setState({ submitButtonText: AppConstants.addCompetitionAndMembership });
                                }, 100);
                            }}
                        >
                            {AppConstants.continue}
                        </Button>
                    ]}
                >
                    <p> {registrationObj.registeringYourself != 3 ? AppConstants.sameEmailValidationMessage : AppConstants.sameSomeoneEmailValidationMessage2}</p>
                </Modal>
            </div>
        )
    }

    sameSomeOneEmailValidationModal = () => {
        try {
            return (
                <div>
                    <Modal
                        className="add-membership-type-modal"
                        title={AppConstants.warning}
                        visible={this.state.sameSomeoneEmailValidationModalVisible}
                        onCancel={() => this.setState({ sameSomeoneEmailValidationModalVisible: false })}
                        footer={[
                            <Button onClick={() => this.setState({ sameSomeoneEmailValidationModalVisible: false })}>
                                {AppConstants.ok}
                            </Button>
                        ]}
                    >
                        <p> {AppConstants.sameSomeoneEmailValidationMessage}</p>
                    </Modal>
                </div>
            )
        } catch (ex) {
            console.log("Error in sameSomeOneEmailValidationModal::" + ex);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout>
                    {this.headerView()}
                    {/* <a onClick="javascript:window.open('mailto:mail@domain.com', 'mail');event.preventDefault()" href="mailto:example@example.com" target="_blank">Email</a> */}
                    <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveRegistrationForm}
                        noValidate="noValidate"
                        className="mb-4"
                    >
                        <Content>
                            <div>
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>
                        <div>{this.actionView()}</div>
                        <Loader visible={
                            this.props.userRegistrationState.onMembershipLoad ||
                            this.props.userRegistrationState.userInfoOnLoad ||
                            this.props.userRegistrationState.onParticipantByIdLoad ||
                            this.props.userRegistrationState.onSaveLoad
                        } />
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserRegistrationUserInfoAction,
        selectParticipantAction,
        updateUserRegistrationObjectAction,
        genderReferenceAction,
        countryReferenceAction,
        getCommonRefData,
        membershipProductEndUserRegistrationAction,
        updateParticipantCompetitionAction,
        playerPositionReferenceAction,
        updateUserRegistrationStateVarAction,
        identificationReferenceAction,
        disabilityReferenceAction,
        favouriteTeamReferenceAction,
        firebirdPlayerReferenceAction,
        otherSportsReferenceAction,
        heardByReferenceAction,
        updateParticipantAdditionalInfoAction,
        accreditationUmpireReferenceAction,
        accreditationCoachReferenceAction,
        walkingNetballQuesReferenceAction,
        saveParticipantInfo,
        getParticipantInfoById,
        orgRegistrationRegSettingsEndUserRegAction,
        registrationExpiryCheckAction,
        getSeasonalAndCasualFees,
        getSchoolListAction,
        validateRegistrationCapAction,
        netSetGoTshirtSizeAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        registrationProductState: state.RegistrationProductState,
        userRegistrationState: state.UserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(AppRegistrationFormNew));
