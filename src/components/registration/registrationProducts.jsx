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
    Radio, Form, Modal, message
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
import { liveScore_formateDate } from "../../themes/dateformate";
import {
    getRegistrationReviewAction, saveRegistrationReview, updateReviewInfoAction,
    deleteRegistrationProductAction, deleteRegistrationParticipantAction,
    getTermsAndConditionsAction, getRegParticipantUsersAction, getRegistrationShopProductAction
} from
    '../../store/actions/registrationAction/registrationProductsAction';
import ValidationConstants from "../../themes/validationConstant";
import { isArrayNotEmpty, isNullOrEmptyString } from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {
    getCommonRefData,
    countryReferenceAction
} from '../../store/actions/commonAction/commonAction';
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import { captializedString } from "../../util/helpers";
import Tooltip from 'react-png-tooltip';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;


class RegistrationProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonPressed: null,
            registrationUniqueKey: null,
            productModalVisible: false,
            participantModalVisible: false,
            id: null,
            agreeTerm: false,
            loading: false,
            //    newYourDetails: false,
            searchAddressFlag: true,
            manualEnterAddressFlag: false,
            onLoading: false,
            deleteOnLoad: false,
            organisationUniqueKey: null,
            competitionUniqueKey: null,
            teamName: null,
            isAgreed: false,
            sameSomeoneEmailValidationModalVisible: false
        };
        this.props.getCommonRefData();
        this.props.countryReferenceAction();

    }

    componentDidMount() {
        let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        console.log("registrationUniqueKey"+registrationUniqueKey);
        // let registrationUniqueKey = "8862bfb9-411e-480b-982e-7a3116628b8c";
        this.setState({ registrationUniqueKey: registrationUniqueKey });
        this.getApiInfo(registrationUniqueKey);
    }

    componentDidUpdate(nextProps) {
        let registrationProductState = this.props.registrationProductState
        if (this.state.loading == true && registrationProductState.onRegReviewLoad == false) {
            if (this.state.buttonPressed == "save") {
                if (isArrayNotEmpty(registrationProductState.shopProductList)) {
                    this.goToShop();
                } else {
                    this.goToRegistrationPayments();
                }
            }
        }
        if (this.state.onLoading == true && registrationProductState.onRegReviewLoad == false) {
            this.setYourInfoFormFields()
            this.setState({ onLoading: false });
        }
        if (registrationProductState.deleteOnLoad == false && this.state.deleteOnLoad == true) {
            this.getRegistrationProducts(this.state.registrationUniqueKey, 1, -1, -1);
            let registrationReviewList = registrationProductState.registrationReviewList;
            let compParticipants = registrationReviewList != null ? isArrayNotEmpty(registrationReviewList.compParticipants) ?
                registrationReviewList.compParticipants : [] : [];
            if (compParticipants.length == 0) {
                this.clickAddAnotherParticipant(null, this.state.registrationUniqueKey);
            }
            this.setState({ loading: true });
            this.setState({ deleteOnLoad: false })
        }
    }

    goToRegistrationPayments = () => {
        history.push({ pathname: '/registrationPayment', state: { registrationId: this.state.registrationUniqueKey } })
    }

    getApiInfo = (registrationUniqueKey) => {
        this.setState({ onLoading: true });
        let payload = {
            registrationId: registrationUniqueKey
        }
        this.props.getRegistrationReviewAction(payload);
        this.props.getTermsAndConditionsAction(payload);
        this.props.getRegParticipantUsersAction(payload);
        this.getRegistrationProducts(registrationUniqueKey, 1, -1, -1);
    }

    getRegistrationProducts = (registrationId, page, typeId, organisationUniqueKey) => {
        let payload = {
            registrationId: registrationId,
            typeId: typeId,
            organisationUniqueKey: organisationUniqueKey,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }
        this.props.getRegistrationShopProductAction(payload);
    }

    getOrdinalString = (position) => {
        try {
            if ((position % 10) == 1) {
                return 'st';
            } else if ((position % 10) == 2 && position != 12) {
                return 'nd';
            } else if ((position % 10) == 3 && position != 13) {
                return 'rd';
            } else {
                return 'th';
            }
        } catch (ex) {
            console.log("Error in getOrdinalString::" + ex);
        }
    }

    checkIsSameEmail = () => {
        try {
            let registrationReview = this.props.registrationProductState.registrationReviewList;
            if (isArrayNotEmpty(registrationReview.compParticipants)) {
                let sameUser = registrationReview.compParticipants.find(x => x.email == registrationReview.yourInfo.email && x.registeringYourselfRefId == 3);
                if (sameUser) {
                    this.setState({ sameSomeoneEmailValidationModalVisible: true })
                    return false;
                }
            }
            return true;
        } catch (ex) {
            console.log("Error in checkIsSameEmail::" + ex)
        }
    }


    saveReviewForm = (e) => {
        e.preventDefault();
        let registrationState = this.props.registrationProductState;
        let registrationReviewList = registrationState.registrationReviewList;
        let incompletePaymentMessage = this.checkPayment(registrationReviewList);
        let yourInfo = registrationReviewList ? registrationReviewList.yourInfo : null;
        const { termsAndConditions } = this.props.registrationProductState;
        let participantUsers = this.props.registrationProductState.participantUsers;
        if (incompletePaymentMessage != '') {
            incompletePaymentMessage = "Payment Options are not configured for " + incompletePaymentMessage + ". Please contact administrator.";
            message.error(incompletePaymentMessage);
            return;
        } else {
            incompletePaymentMessage = null;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if (!err) {
                if (termsAndConditions.length > 0) {
                    if (this.state.agreeTerm == false) {
                        this.setState({ isAgreed: true })
                        return;
                    }
                }

                let isSame = this.checkIsSameEmail();
                if (!isSame) {
                    return;
                }

                console.log(this.state.searchAddressFlag, yourInfo.stateRefId);
                if (isArrayNotEmpty(participantUsers) && this.state.searchAddressFlag && yourInfo.stateRefId == null) {
                    message.error(ValidationConstants.addressDetailsIsRequired);
                    return;
                }
                let registrationReview = this.props.registrationProductState.registrationReviewList;
                registrationReview["registrationId"] = this.state.registrationUniqueKey;
                console.log("registrationReview", registrationReview);
                this.callSaveRegistrationProducts("save", registrationReview);
            }
        });
    }

    checkPayment = (regReviewData) => {
        try {
            let competitionNames = '';
            let competitionNameMap = new Map();
            regReviewData.compParticipants.map((participant, index) => {
                let paymentOptionTemp = participant.paymentOptions != null ? participant.paymentOptions.find((paymentOption) => paymentOption.paymentOptionRefId <= 5) : undefined;
                if (paymentOptionTemp == undefined) {
                    if (competitionNameMap.get(participant.competitionName) == undefined) {
                        competitionNameMap.set(participant.competitionName, index);
                        if (index == regReviewData.compParticipants.length - 1 && competitionNameMap.size != 1) {
                            competitionNames = competitionNames.slice(0, -2);
                            competitionNames += " and " + participant.competitionName + ', ';
                        } else {
                            competitionNames += participant.competitionName + ', ';
                        }
                    }
                }
            });
            console.log("comp name::" + competitionNames);
            return competitionNames.slice(0, -2);
        } catch (error) {
            throw error;
        }
    }

    getPaymentOptionText = (paymentOptionRefId, isTeamRegistration) => {
        let paymentOptionTxt =
            paymentOptionRefId == 2 ? AppConstants.gameVoucher :
                (paymentOptionRefId == 3 ? AppConstants.allMatches :
                    (paymentOptionRefId == 4 ? AppConstants.firstInstalment :
                        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration :
                            (paymentOptionRefId == 1 ? (isTeamRegistration == 1 ? AppConstants.payEachMatch : AppConstants.oneMatchOnly) : ""
                            ))));

        return paymentOptionTxt;
    }

    setReviewInfo = (value, key, index, subkey, subIndex) => {
        let registrationReview = this.props.registrationProductState.registrationReviewList;
        registrationReview["registrationId"] = this.state.registrationUniqueKey;
        registrationReview["index"] = index;
        this.props.updateReviewInfoAction(value, key, index, subkey, subIndex);
        if (key == "paymentOptionRefId" || key == "discount" || key == "nominationPayOptionRefId") {
            this.callSaveRegistrationProducts(key, registrationReview)
        }
        else if (key == "removeDiscount") {
            this.callSaveRegistrationProducts("discount", registrationReview)
        }
        else if (key == "isSchoolRegCodeApplied" || subIndex == "removeSchoolRegCode") {
            this.callSaveRegistrationProducts("school", registrationReview)
        }
        else if (key == "voucher") {
            this.callSaveRegistrationProducts(key, registrationReview, 1)
        }
        else if (key == "removeVoucher") {
            this.callSaveRegistrationProducts("voucher", registrationReview);
        }
        else if (key == "charityRoundUpRefId") {
            this.callSaveRegistrationProducts("charity", registrationReview);
        }
    }

    callSaveRegistrationProducts = (key, registrationReview, govtVoucherFlag) => {
        try {
            registrationReview["key"] = key;
            console.log("registrationReview", registrationReview);
            this.props.saveRegistrationReview(registrationReview, govtVoucherFlag);
            this.setState({ loading: true, buttonPressed: key });
        } catch (ex) {
            console.log("Error in callSaveRegistrationProducts::" + ex);
        }
    }

    removeProductModal = (key, id, teamName) => {
        if (key == "show") {
            this.setState({ productModalVisible: true, id: id, teamName: teamName });
        }
        else if (key == "ok") {
            this.setState({ productModalVisible: false });
            let payload = {
                registrationId: this.state.registrationUniqueKey,
                orgRegParticipantId: this.state.id
            }
            console.log("teamName", this.state.teamName)
            if (this.state.teamName) {
                payload["teamName"] = this.state.teamName;
            }

            this.props.deleteRegistrationProductAction(payload);
            this.setState({ deleteOnLoad: true, teamName: null })
            // this.getRegistrationProducts(this.state.registrationUniqueKey, 1, -1);
            // this.setState({loading: true});
        }
        else if (key == "cancel") {
            this.setState({ productModalVisible: false });
        }
    }

    removeParticipantModal = (key, id, competitionId, organisationId, teamName) => {
        console.log(teamName)
        if (key == "show") {
            this.setState({ participantModalVisible: true, id: id, competitionUniqueKey: competitionId, organisationUniqueKey: organisationId, teamName: teamName });
        }
        else if (key == "ok") {
            this.setState({ participantModalVisible: false });
            let payload = {
                registrationId: this.state.registrationUniqueKey,
                participantId: this.state.id,
                competitionUniqueKey: this.state.competitionUniqueKey,
                organisationUniqueKey: this.state.organisationUniqueKey
            }
            console.log("teamName", this.state.teamName)
            if (this.state.teamName) {
                payload["teamName"] = this.state.teamName;
            }

            this.props.deleteRegistrationParticipantAction(payload);
            this.setState({ deleteOnLoad: true, teamName: null });
            // this.setState({loading: true});
        }
        else if (key == "cancel") {
            this.setState({ participantModalVisible: false });
        }
    }

    redirect = (participantId, registrationId, isTeamRegistration) => {
        if (isTeamRegistration == 0) {
            history.push({ pathname: '/appRegistrationForm', state: { participantId: participantId, registrationId: registrationId } })
        } else {
            history.push({ pathname: '/appTeamRegistrationForm', state: { participantId: participantId, registrationId: registrationId } })
        }
    }

    clickAddAnotherParticipant = (participantId, registrationId) => {
        history.push({ pathname: '/appRegistrationForm', state: { participantId: participantId, registrationId: registrationId } })
    }

    goToShop = () => {
        history.push({ pathname: '/registrationShop', state: { registrationId: this.state.registrationUniqueKey } })
    }

    removeFromCart = (index, key, subKey) => {
        this.props.updateReviewInfoAction(null, key, index, subKey, null);
    }

    setYourInfoFormFields = () => {
        try {
            const { registrationReviewList } = this.props.registrationProductState;
            let yourInfo = registrationReviewList.yourInfo;
            if (yourInfo.email != null) {
                // this.setState({newYourDetails: true});
                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        [`yourDetailsFirstName`]: yourInfo.firstName,
                        [`yourDetailsLastName`]: yourInfo.lastName,
                        [`yourDetailsMobileNumber`]: yourInfo.mobileNumber,
                        [`yourDetailsEmail`]: yourInfo.email,
                    });
                    if (this.state.searchAddressFlag) {
                        this.setYourInfoAddressFormFields("searchAddressFlag")
                    }
                }, 300);
            }
        } catch (ex) {
            console.log("Error in setYourInfoFormFields" + ex);
        }
    }

    setYourInfoAddressFormFields = (key) => {
        try {
            const { registrationReviewList } = this.props.registrationProductState;
            let yourInfo = registrationReviewList.yourInfo;
            if (key == 'searchAddressFlag') {
                this.props.form.setFieldsValue({
                    [`yourDetailsAddressSearch`]: this.getYourInfoAddress(yourInfo)
                });
            } else if (key == 'manualEnterAddressFlag') {
                this.props.form.setFieldsValue({
                    [`yourDetailsStreet1`]: yourInfo.street1,
                    [`yourDetailsSuburb`]: yourInfo.suburb,
                    [`yourDetailsPostalCode`]: yourInfo.postalCode,
                    [`yourDetailsStateRefId`]: yourInfo.stateRefId,
                    [`yourDetailsCountryRefId`]: yourInfo.countryRefId,
                });
            }
        } catch (ex) {
            console.log("Error in setYourInfoAddressFormFields" + ex);
        }
    }

    getYourInfoAddress = (yourInfo) => {
        try {
            const { stateList, countryList } = this.props.commonReducerState;
            const state = stateList.length > 0 && yourInfo.stateRefId > 0
                ? stateList.find((state) => state.id === yourInfo.stateRefId).name
                : null;
            const country = countryList.length > 0 && yourInfo.countryRefId > 0
                ? countryList.find((country) => country.id === yourInfo.countryRefId).name
                : null;

            let defaultAddress = '';
            if (state) {
                defaultAddress = (yourInfo.street1 ? yourInfo.street1 + ',' : '') +
                    (yourInfo.suburb ? yourInfo.suburb + ',' : '') +
                    (state ? state + ',' : '') +
                    (yourInfo.postalCode ? yourInfo.postalCode + ',' : '') +
                    (country ? country + ',' : '');
            }
            return defaultAddress;
        } catch (ex) {
            console.log("Error in getYourInfoAddress" + ex);
        }
    }

    yourInfoAddressSearch = (addressData) => {
        try {
            const { stateList, countryList } = this.props.commonReducerState;
            const address = addressData;
            if (address) {
                const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address?.state).id : null;
                const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address?.country).id : null;
                this.setReviewInfo(address.addressOne, "street1", null, "yourInfo", null);
                this.setReviewInfo(address.suburb, "suburb", null, "yourInfo", null);
                this.setReviewInfo(stateRefId ? stateRefId : null, "stateRefId", null, "yourInfo", null);
                this.setReviewInfo(countryRefId ? countryRefId : null, "countryRefId", null, "yourInfo", null);
                this.setReviewInfo(address.postcode, "postalCode", null, "yourInfo", null);
            }
        } catch (ex) {
            console.log("Error in yourInfoAddressSearch" + ex);
        }
    }

    updateYourInfo = (key) => {
        try {
            if (key == "new") {
                this.setReviewInfo(null, "firstName", null, "yourInfo", null);
                this.setReviewInfo(null, "lastName", null, "yourInfo", null);
                this.setReviewInfo(null, "email", null, "yourInfo", null);
                this.setReviewInfo(null, "mobileNumber", null, "yourInfo", null);
                this.setReviewInfo(null, "street1", null, "yourInfo", null);
                this.setReviewInfo(null, "suburb", null, "yourInfo", null);
                this.setReviewInfo(null, "stateRefId", null, "yourInfo", null);
                this.setReviewInfo(null, "countryRefId", null, "yourInfo", null);
                this.setReviewInfo(null, "postalCode", null, "yourInfo", null);
            }
        } catch (ex) {
            console.log("Error in updateYourInfo" + ex);
        }
    }


    headerView = (isTeamRegistration) => {
        return (
            <div className="col-sm-12 col-md-7 col-lg-8 d-flex flex-wrap justify-content-between p-0">
                <div className="headline-text-common" style={{ padding: 0, marginRight: 10 }}> {AppConstants.participants}</div>
                {!isTeamRegistration && <div className="add-another-button-border pointer reg-products-add-participant"
                    onClick={() => this.clickAddAnotherParticipant(null, this.state.registrationUniqueKey)}>
                    <div className="link-text-common ">+ {AppConstants.addAnotherParticipant}</div>
                </div>}
            </div>
        );

    }

    participantDetailView = (isSchoolRegistration) => {
        const { registrationReviewList } = this.props.registrationProductState;
        //console.log("registrationReviewList", this.props.registrationProductState);
        let compParticipants = registrationReviewList != null ?
            isArrayNotEmpty(registrationReviewList.compParticipants) ?
                registrationReviewList.compParticipants : [] : [];
        return (
            <div>
                {(compParticipants || []).map((item, index) => (
                    <div style={{ marginBottom: "40px" }} key={item.participantId + "#" + index}>
                        {this.userInfoView(item, index)}
                        {this.productsView(item, index)}
                        {this.discountcodeView(item, index, isSchoolRegistration)}
                        {item.selectedOptions.paymentOptionRefId == 5 && this.schoolRegistrationView(item, index)}
                        {item.isTeamRegistration == 0 && this.governmentVoucherView(item, index)}
                    </div>
                ))}

            </div>
        )
    }

    editRemoveView = item => (
        <div style={{ display: 'flex', marginLeft: 5 }}>
            <div className="transfer-image-view pointer" style={{ paddingRight: "15px", marginLeft: "auto" }} onClick={() => this.redirect(item.participantId, this.state.registrationUniqueKey, item.isTeamRegistration)}>
                <span className="link-text-common" style={{ margin: "0px 15px 0px 10px" }}>
                    {AppConstants.edit}
                </span>
                <span className="user-remove-btn" ><img class="marginIcon" src={AppImages.editIcon} /></span>
            </div>
            <div className="transfer-image-view pointer" onClick={() => this.removeParticipantModal('show', item.participantId, item.competitionUniqueKey, item.organisationUniqueKey, item.teamName)}>
                <span className="link-text-common" style={{ marginRight: "15px" }}>
                    {AppConstants.remove}
                </span>
                <span className="user-remove-btn" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
            </div>
        </div>
    )

    userInfoView = (item, index) => {
        return (
            <div>
                <div style={{ display: "flex", flexWrap: 'wrap' }}>

                    {item.isTeamRegistration == 1 ?
                        (
                            <div style={{ display: "flex", alignItems: "center", width: '100%' }}>
                                <div className="defualt-team-logo-style">
                                    <img src={AppImages.teamLoadDefualtWhite} />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', width: 'calc(100% - 67px)' }}>
                                    <div class="pl-2" style={{ marginLeft: 10, marginRight: "auto" }}>
                                        <div className="headline-text-common">{item.teamName}</div>
                                        <div className="body-text-common">{AppConstants.team + ',' + item.totalMembers + ' ' + AppConstants.members}</div>
                                    </div>
                                    {this.editRemoveView(item)}
                                </div>
                            </div>
                        )

                        :
                        (
                            <div style={{ display: "flex", alignItems: "center", width: '100%' }}>
                                <div className="circular--landscape" style={{ height: "67px", width: "67px", minWidth: 67 }}>
                                    {
                                        item.photoUrl ? (
                                            <img src={item.photoUrl} />
                                        ) :
                                            (
                                                <div className="profile-default-img" style={{ height: "67px", width: "67px", minWidth: 67 }}>
                                                    {item.firstName?.slice(0, 1)}{item.lastName?.slice(0, 1)}
                                                </div>
                                            )
                                    }
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', width: 'calc(100% - 67px)' }}>
                                    <div class="pl-2" style={{ marginLeft: 10, marginRight: "auto" }}>
                                        <div className="headline-text-common">{item.firstName + ' ' + item.lastName}</div>
                                        <div className="body-text-common">{item.gender}
                                            {liveScore_formateDate(item.dateOfBirth) == "Invalid date" ? "" : ',' + liveScore_formateDate(item.dateOfBirth)}
                                        </div>
                                    </div>
                                    {this.editRemoveView(item)}
                                </div>
                            </div>
                        )

                    }
                </div>
                <div style={{ display: "flex", alignItems: 'center', marginTop: 30 }}>
                    <div className="circular--landscape" style={{ height: "67px", width: "67px", minWidth: 67 }}>
                        {
                            item.competitionLogoUrl ? (
                                <img src={item.competitionLogoUrl} alt="" />
                            ) :
                                (
                                    <img src={AppImages.userIcon} alt="" />
                                )
                        }
                    </div>
                    <div class="pl-2" style={{ marginLeft: 10 }}>
                        <div className="body-text-common">Competition</div>
                        <div className="headline-text-common">{item.competitionName}</div>
                        <div className="body-text-common">{item.organisationName}</div>
                    </div>
                </div>
            </div>
        )
    }

    getValueOfTeamFeeWillPay = (item) => {
        try {
            if (item.selectedOptions.paymentOptionRefId == 1) {
                if (item.selectedOptions.teamRegChargeTypeRefId == 2) {
                    return 1;
                } else if (item.selectedOptions.teamRegChargeTypeRefId == 3) {
                    return 2;
                }
            } else {
                return item.selectedOptions.nominationPayOptionRefId;
            }
        } catch (ex) {
            console.log("Error in getValueOfTeamFeeWillPay::" + ex);
        }
    }

    //payment options
    getUpdatedPaymentOptions = (paymentOption) => {

        let matchIndex = paymentOption.findIndex((x) => x.paymentOptionRefId == 1)

        if (matchIndex > -1) {
            let newObj = paymentOption[matchIndex]
            paymentOption.splice(matchIndex, 1)

            paymentOption.push(newObj)
        }

        return paymentOption

    }

    productsView = (item, index) => {
        try {
            let currentDate = moment();
            // let instalmentCount = 1;
            // if(item.isTeamRegistration) {
            //     if(item.isTeamSeasonalUponReg){
            //         instalmentCount = 2;
            //     }
            // }else{
            //     if(item.isSeasonalUponReg){
            //         instalmentCount = 2;
            //     }
            // }
            if ((item.isTeamRegistration == 1 && item.isTeamSeasonalUponReg == 1) || item.isSeasonalUponReg == 1) {
                let currentDateExist = item.instalmentDates.find(x => moment(x.instalmentDate).format("DD/MM/YYYY") === moment(currentDate).format("DD/MM/YYYY"));
                if (!currentDateExist) {
                    let obj = {
                        competitionId: item.instalmentDates.length > 0 ? item.instalmentDates[0].competitionId : null,
                        instalmentDate: moment(currentDate)
                    }
                    item.instalmentDates.push(obj);
                }
                const sortedArray = item.instalmentDates.sort((a, b) => moment(a.instalmentDate).format('YYYYMMDD') - moment(b.instalmentDate).format('YYYYMMDD'))
                item.instalmentDates = sortedArray;
            }
            return (
                <div className="innerview-outline">
                    {item.isTeamRegistration == 1 && (isArrayNotEmpty(item.teamMembers.payingForList) || isArrayNotEmpty(item.teamMembers.notPayingForList)) ?
                        <div>
                            <div className="subtitle-text-common" style={{ marginTop: '5px' }}>{AppConstants.howWillTheTeamFeeBePaid}</div>
                            <div className="product-line">
                                <Radio.Group
                                    value={this.getValueOfTeamFeeWillPay(item)}
                                    onChange={(e) => this.setReviewInfo(e.target.value, "nominationPayOptionRefId", index, "selectedOptions")}>
                                    {item.selectedOptions.paymentOptionRefId == 1 ? (
                                        <div>
                                            {item.selectedOptions.teamRegChargeTypeRefId == 2 && (
                                                <Radio key={1} value={1}>{AppConstants.payCompetitionAndNominationFeesForAll}</Radio>
                                            )}
                                            {item.selectedOptions.teamRegChargeTypeRefId == 3 && (
                                                <Radio key={2} value={2}>{AppConstants.payAllFeesForSelectedTeamMembers}</Radio>
                                            )}
                                        </div>
                                    ) : (
                                            <div style={{ display: "flex" }}>
                                                <Radio key={1} value={1} className="team-reg-radio-custom-style" style={{ width: "50%" }}>{AppConstants.payCompetitionAndNominationFeesForAll}</Radio>
                                                <Radio key={2} value={2} className="team-reg-radio-custom-style" style={{ width: "50%" }}>{AppConstants.payAllFeesForSelectedTeamMembers}</Radio>
                                            </div>
                                        )}
                                </Radio.Group>
                            </div>
                            <div className="product-line">
                                {isArrayNotEmpty(item.teamMembers.payingForList) && (
                                    <div className="body-text-common">{AppConstants.registration + "(s), " + AppConstants.payingFor}</div>
                                )}
                                {(item.teamMembers.payingForList || []).map((payingFor, payigForIndex) => (
                                    <div className="subtitle-text-common" style={{ fontFamily: "inherit", fontSize: 16, marginTop: "5px" }}>
                                        {payingFor.membershipProductTypeName + ' ' + payingFor.name}
                                    </div>
                                ))}
                                {isArrayNotEmpty(item.teamMembers.notPayingForList) && (
                                    <div style={{ marginTop: "10px" }} className="body-text-common">{AppConstants.registration + "(s), " + AppConstants.notPayingFor}</div>
                                )}
                                {(item.teamMembers.notPayingForList || []).map((notPlayingFor, notPayigForIndex) => (
                                    <div className="subtitle-text-common" style={{ fontFamily: "inherit", fontSize: 16, marginTop: "5px" }}>
                                        {notPlayingFor.membershipProductTypeName + ' ' + notPlayingFor.name}
                                    </div>
                                ))}
                                {item.selectedOptions.nominationPayOptionRefId == 1 ?
                                    <div style={{ color: "var(--app-red)", marginTop: "10px" }}
                                        className="body-text-common">
                                        {AppConstants.teamRegistrationNote}
                                    </div>
                                    : isArrayNotEmpty(item.teamMembers.notPayingForList) &&
                                    <div style={{ color: "var(--app-red)", marginTop: "10px" }}
                                        className="body-text-common">
                                        {AppConstants.teamRegistrationNote}
                                    </div>
                                }

                            </div>
                            {item.selectedOptions.nominationPayOptionRefId == 2 && isArrayNotEmpty(item.teamMembers.notPayingForList) &&
                                <div className="body-text-common product-border-line" style={{ color: " var(--app-red)", marginTop: '16px' }}>{AppConstants.ifAllTeamMemberHaveNotRegistered}</div>
                            }
                        </div>
                        :
                        <div className="product-border-line">
                            <div className="body-text-common">
                                {AppConstants.registration}{"(s)"}
                            </div>
                            {(item.membershipProducts || []).map((mem, memIndex) => (
                                <div key={mem.competitionMembershipProductTypeId + "#" + memIndex} className="subtitle-text-common"
                                    style={{ fontFamily: "inherit", fontSize: 16, marginTop: "5px" }}>
                                    {mem.membershipTypeName + (mem.divisionId != null ? ' - ' + mem.divisionName : "")}
                                </div>
                            ))}
                        </div>
                    }
                    {item.paymentOptions.length > 1 && (
                        <div className="subtitle-text-common" style={{ marginTop: "16px" }}>
                            {AppConstants.whatWouldYouLikeToPay}
                        </div>
                    )
                    }
                    <div style={item.paymentOptions.length > 1 ? { marginTop: 6 } : { marginTop: 12 }}>
                        <Radio.Group className="body-text-common"
                            value={item.selectedOptions.paymentOptionRefId}
                            onChange={(e) => this.setReviewInfo(e.target.value, "paymentOptionRefId", index, "selectedOptions")}
                            style={{ display: "flex" }}>
                            {(this.getUpdatedPaymentOptions(item.paymentOptions) || []).map((p, pIndex) => {
                                return (
                                    <span key={p.paymentOptionRefId}>

                                        {p.paymentOptionRefId == 3 &&
                                            <div className="contextualHelp-RowDirection">
                                                <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.allMatches}</Radio>
                                                <div style={{ marginLeft: -20, marginRight: 17 }}>
                                                    <Tooltip placement='bottom' background="#ff8237">
                                                        <span>{AppConstants.allMatchesTipMsg}</span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        }
                                        {p.paymentOptionRefId == 4 &&
                                            <div className="contextualHelp-RowDirection">
                                                <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.weeklyInstalment}</Radio>

                                                <div style={{ marginLeft: -20, marginRight: 17 }}>
                                                    <Tooltip placement='bottom' background="#ff8237">
                                                        <span>{AppConstants.instalmentTipMessage}</span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        }
                                        {p.paymentOptionRefId == 5 &&
                                            <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.schoolRegistration}</Radio>
                                        }
                                        {p.paymentOptionRefId == 1 &&
                                            <div className="contextualHelp-RowDirection">
                                                <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{item.isTeamRegistration == 1 ? AppConstants.payEachMatch : AppConstants.oneMatchOnly}</Radio>
                                                {item.isTeamRegistration == 0 ?
                                                    <div style={{ marginLeft: -20, marginRight: 17 }}>
                                                        <Tooltip placement='bottom' background="#ff8237">
                                                            <span>{AppConstants.oneMatchOnlyTipMsg}</span>
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        }

                                    </span>
                                )
                            })}
                        </Radio.Group>
                    </div>
                    {item.selectedOptions.paymentOptionRefId == 1 &&
                        <div className="row" style={{ borderTop: "1px solid var(--app-d9d9d9)", paddingTop: "16px", marginTop: "16px" }}>
                            <div className="col-sm-3">
                                <div className="subtitle-text-common">{AppConstants.payNow}</div>
                                <div>{"$" + item.payNow}</div>
                            </div>
                            {item.isTeamRegistration == 1 ?
                                <div className="col-sm-3">
                                    <div className="subtitle-text-common">{AppConstants.payNow}</div>
                                    <div>{"$" + item.payNow}</div>
                                </div>

                                :
                                null
                            }
                        </div>
                    }
                    {item.selectedOptions.paymentOptionRefId == 4 &&
                        <div>
                            <div className="row" style={{ marginTop: '20px' }}>
                                {/* {item.isTeamRegistration ? item.isTeamSeasonalUponReg &&
                            <div className="col-sm-3">
                                <div>{AppConstants.firstInstalment}</div>
                                <div>{moment(currentDate).format("DD/MM/YYYY")}</div>
                            </div>
                            : item.isSeasonalUponReg &&
                                <div className="col-sm-3">
                                    <div>{AppConstants.firstInstalment}</div>
                                    <div>{moment(currentDate).format("DD/MM/YYYY")}</div>
                                </div>
                            }*/}
                                {(item.instalmentDates || []).map((i, iIndex) => (
                                    <div className="col-sm-3" key={iIndex}>
                                        <div>{(iIndex + 1) + this.getOrdinalString(iIndex + 1) + " instalment"}</div>
                                        <div>{(i.instalmentDate != null ? moment(i.instalmentDate).format("DD/MM/YYYY") : "")}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="row" style={{ borderTop: "1px solid var(--app-d9d9d9)", paddingTop: "16px", marginTop: "16px" }}>
                                <div className="col-sm-3">
                                    <div className="subtitle-text-common">{AppConstants.payNow}</div>
                                    <div>{"$" + item.payNow}</div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="subtitle-text-common">{AppConstants.payPerInstalment}</div>
                                    <div>{"$" + item.payPerInstalment}</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            )
        }
        catch (ex) {
            console.log("Error in products view" + ex)
        }

    }

    discountcodeView = (item, index, isSchoolRegistration) => {
        let discountCodes = item.selectedOptions.discountCodes;
        return (
            <div>
                {isArrayNotEmpty(discountCodes) && (
                    <div className="headline-text-common" style={{ marginTop: "21px" }}>
                        {AppConstants.discountCode}
                    </div>
                )}
                {(discountCodes || []).map((dis, disIndex) => (
                    <div key={index + "#" + disIndex} style={{ display: "flex", marginTop: "15px", justifyContent: "space-between", marginRight: 26 }}>
                        <div style={{ width: "100%" }}>
                            <InputWithHead
                                style={{ width: "97%" }}
                                required={"required-field pt-0 pb-0"}
                                placeholder={AppConstants.discountCode}
                                value={dis.discountCode}
                                onChange={(e) => this.setReviewInfo(e.target.value, "discountCode", index, "selectedOptions", disIndex)}
                            />
                        </div>

                        <div className="transfer-image-view pointer" style={{ paddingLeft: '15px', }}>
                            <span className="user-remove-btn"
                                onClick={() => this.setReviewInfo(null, "removeDiscount", index, "selectedOptions", disIndex)}>
                                <img class="marginIcon" src={AppImages.removeIcon} />
                            </span>
                        </div>
                        {dis.isValid == 0 &&
                            <div className="ml-4 discount-validation" style={{ alignSelf: "center" }}>
                                Invalid code
                        </div>
                        }
                    </div>
                ))
                }

                {!isSchoolRegistration &&
                    <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "space-between", width: "99%" }}>
                        <div style={{ marginTop: "13px", alignSelf: "center" }}>
                            <span className="btn-text-common pointer" style={{ paddingTop: 7 }}
                                onClick={(e) => this.setReviewInfo(null, "addDiscount", index, "selectedOptions")}>
                                + {AppConstants.addDiscountCode}
                            </span>
                        </div>
                        {discountCodes && discountCodes.length > 0 &&
                            <div style={{ padding: "15px 0px 0px 0px" }}>
                                <Button className="open-reg-button"
                                    onClick={(e) => this.setReviewInfo(null, "discount", index, null, null)}
                                    type="primary">
                                    {AppConstants.applyCode}
                                </Button>
                            </div>
                        }
                    </div>}
            </div >
        )
    }

    schoolRegistrationView_1 = (item, index) => {
        return (
            <div>
                <div>
                    <div className="inputfield-style">
                        <div className="row" style={{ marginLeft: 0, marginTop: 12 }}>
                            <div className="" style={{ paddingLeft: 9, alignSelf: "center", marginRight: 30 }}>
                                {AppConstants.registrationCode}
                            </div>
                            <div style={{ marginRight: 30 }}>
                                <InputWithHead
                                    placeholder={AppConstants.code}
                                    onChange={(e) => this.setReviewInfo(e.target.value, "selectedSchoolRegCode", index, "selectedOptions", null)}
                                    value={item.selectedOptions.selectedSchoolRegCode} />
                            </div>
                            <div className="" style={{ alignSelf: "center" }}>
                                {item.selectedOptions.isSchoolRegCodeApplied == 1 ?
                                    <Button className="open-reg-button"
                                        onClick={(e) => this.setReviewInfo(null, "selectedSchoolRegCode", index, "selectedOptions", "removeSchoolRegCode")}
                                        type="primary">
                                        {AppConstants.removeCode}
                                    </Button> :
                                    <Button className="open-reg-button"
                                        onClick={(e) => this.setReviewInfo(null, "isSchoolRegCodeApplied", index, "selectedOptions")}
                                        type="primary">
                                        {AppConstants.applyCode}
                                    </Button>}
                            </div>
                            {item.selectedOptions.invalidSchoolRegCode == 1 &&
                                <div className="ml-4 discount-validation" style={{ alignSelf: "center" }}>
                                    Invalid code
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    schoolRegistrationView = (item, index) => {
        return (
            <div>
                <div className="headline-text-common" style={{ marginTop: "21px" }}>
                    {AppConstants.invoiceCode}
                </div>
                <div style={{ display: "flex", marginTop: "15px", justifyContent: "space-between", marginRight: 26 }}>
                    <div style={{ width: "100%" }}>
                        <InputWithHead
                            style={{ width: "97%" }}
                            required={"required-field pt-0 pb-0"}
                            placeholder={AppConstants.invoiceCode}
                            value={item.selectedOptions.selectedSchoolRegCode}
                            onChange={(e) => this.setReviewInfo(e.target.value, "selectedSchoolRegCode", index, "selectedOptions", null)}
                        />
                    </div>
                    <div className="transfer-image-view pointer" style={{ paddingLeft: '15px', }}>
                        <span className="user-remove-btn"
                            onClick={(e) => this.setReviewInfo(null, "selectedSchoolRegCode", index, "selectedOptions", "removeSchoolRegCode")}>
                            <img class="marginIcon" src={AppImages.removeIcon} />
                        </span>
                    </div>
                    {item.selectedOptions.invalidSchoolRegCode == 1 &&
                        <div className="ml-4 discount-validation" style={{ alignSelf: "center" }}>
                            Invalid code
                    </div>
                    }
                </div>
                <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "flex-end", width: "99%" }}>
                    <div style={{ padding: "15px 0px 0px 0px" }}>
                        <Button className="open-reg-button"
                            onClick={(e) => this.setReviewInfo(null, "isSchoolRegCodeApplied", index, "selectedOptions")}
                            type="primary">
                            {AppConstants.applyCode}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    governmentVoucherView = (item, index) => {
        let selectedVouchers = item.selectedOptions.vouchers;
        return (
            <div>
                {isArrayNotEmpty(selectedVouchers) && (
                    <div className="headline-text-common" style={{ marginTop: "30px" }}>
                        {AppConstants.governmentVouchers}
                    </div>
                )}
                {(selectedVouchers || []).map((gov, govIndex) => (
                    <div className="row">
                        <div class="col-sm-11 col-lg-6" style={{ width: "100%", margin: "15px 0px 0px 0px" }}>
                            <div className="subtitle-text-common" style={{ marginBottom: 7 }}>{AppConstants.voucherType}</div>
                            <div>
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    required={"required-field pt-0 pb-0"}
                                    className="input-inside-table-venue-court"
                                    onChange={(e) => this.setReviewInfo(e, "governmentVoucherRefId", index, "selectedOptions", govIndex)}
                                    value={gov.governmentVoucherRefId}
                                    placeholder={'Code'}>
                                    {(item.governmentVouchers || []).map((gv, gvIndex) => (
                                        <Option key={gv.governmentVoucherRefId + "#" + gvIndex}
                                            value={gv.governmentVoucherRefId} >{gv.description}</Option>
                                    ))
                                    }

                                </Select>
                            </div>
                        </div>
                        <div class="col-sm-11 col-lg-5 col-9" style={{ width: "100%", margin: "15px 0px 0px 0px" }} >
                            <div className="subtitle-text-common" style={{ marginBottom: 7 }}>{AppConstants.code}</div>
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                placeholder={AppConstants.code}
                                value={gov.voucherCode}
                                onChange={(e) => this.setReviewInfo(e.target.value, "voucherCode", index, "selectedOptions", govIndex)}
                            />
                        </div>
                        <div className="transfer-image-view pointer" style={{ paddingLeft: '15px', paddingTop: 44 }}
                            onClick={() => this.setReviewInfo(null, "removeVoucher", index, "selectedOptions", govIndex)}>
                            <span className="user-remove-btn" >
                                <img class="marginIcon" src={AppImages.removeIcon} />
                            </span>
                        </div>
                        {gov.isValid == 0 &&
                            <div className="ml-4 discount-validation" style={{ alignSelf: "center" }}>
                                {gov.message}
                            </div>
                        }
                    </div >
                ))
                }
                <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "space-between", width: "99%" }}>
                    {isArrayNotEmpty(item.governmentVouchers) && (
                        <div style={{ marginTop: "13px", alignSelf: "center" }}>
                            <span className="btn-text-common pointer" style={{ paddingTop: 7 }}
                                onClick={() => this.setReviewInfo(null, "addVoucher", index, "selectedOptions", null)}>
                                + {AppConstants.addGovernmentVoucher}
                            </span>
                        </div>
                    )}
                    {selectedVouchers && selectedVouchers.length > 0 &&
                        <div style={{ paddingTop: '15px' }}>
                            <Button className="open-reg-button"
                                onClick={(e) => this.setReviewInfo(null, "voucher", index, null, null)}
                                type="primary">
                                {AppConstants.applyCode}
                            </Button>
                        </div>
                    }
                </div>
            </div>
        )
    }

    charityView = () => {
        const { registrationReviewList } = this.props.registrationProductState;
        let charity = registrationReviewList != null ? registrationReviewList.charity : null;
        let charityRoundUp = registrationReviewList != null ? registrationReviewList.charityRoundUp : [];

        return (
            <div style={{ marginTop: "23px" }}>
                {charity != null &&
                    <div className="headline-text-common" style={{ fontSize: 21, marginTop: "5px" }}>
                        {charity.name}
                    </div>}
                {charity != null &&
                    <div className="product-text-common" style={{ fontWeight: 500, marginTop: "8px", width: "92%" }}>
                        {charity.description}
                    </div>
                }
                {charityRoundUp.length > 0 &&
                    <div style={{ marginTop: 6 }}>
                        <Radio.Group className="product-radio-group"
                            value={registrationReviewList.charityRoundUpRefId}
                            onChange={(e) => this.setReviewInfo(e.target.value, "charityRoundUpRefId", null, "charity")}>
                            {(charityRoundUp || []).map((x, cIndex) => (
                                <Radio key={x.charityRoundUpRefId} value={x.charityRoundUpRefId}>{x.description}</Radio>
                            ))}
                        </Radio.Group>
                    </div>}
            </div>
        )
    }

    otherinfoView = () => {
        const { registrationReviewList } = this.props.registrationProductState;
        let otherInfo = registrationReviewList != null ? registrationReviewList.volunteerInfo : [];
        return (
            <div style={{ marginTop: "23px" }}>
                <div className="headline-text-common" style={{ marginTop: "5px" }}>
                    {AppConstants.otherInformation}
                </div>
                <div className="product-text-common" style={{ fontWeight: 500, marginTop: "8px", width: "92%", textAlign: "left" }}>
                    {AppConstants.continuedSuccessOfOurClub}
                </div>
                <div style={{ marginTop: 6 }} className="row">
                    {(otherInfo || []).map((item, index) => (
                        <Checkbox className="col-sm-12 col-lg-4 single-checkbox" key={item.id} checked={item.isActive}
                            onChange={(e) => this.setReviewInfo(e.target.checked, "isActive", index, "volunteerInfo", null)} style={{ marginLeft: "8px" }}>
                            {item.description}
                        </Checkbox>
                    ))}

                </div>
            </div>
        )
    }

    yourDetailsView = (getFieldDecorator) => {
        const { stateList, countryList } = this.props.commonReducerState;
        const { participantUsers, registrationReviewList } = this.props.registrationProductState;
        let yourInfo = registrationReviewList ? registrationReviewList.yourInfo : null;
        return (
            <div>
                <div className="headline-text-common">{AppConstants.yourDetails}</div>
                {!this.state.newYourDetails ?
                    <div>
                        <InputWithHead heading={AppConstants.selectFromParticipantAndParentDetails}
                            required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator(`yourDetailsSelectUser`, {
                                rules: [{ required: true }],
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.select}
                                    setFieldsValue={yourInfo ? yourInfo.email : null}
                                    onChange={(e) => this.setReviewInfo(e, "emailSelection", null, "yourInfo", null)}>
                                    {(participantUsers || []).map((item, index) => (
                                        < Option key={"ParticipantUser" + index} value={index}> {item.firstName + ' ' + item.lastName}</Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                        <div className="btn-text-common pointer" style={{ marginTop: "20px" }}
                            onClick={() => {
                                this.setState({ newYourDetails: true });
                                this.updateYourInfo("new");
                            }}>
                            + {AppConstants.addNewDetails}
                        </div>
                    </div>
                    :
                    <div className="light-grey-border-box" style={{ paddingTop: "30px" }}>
                        <div className="btn-text-common pointer"
                            onClick={() => {
                                this.setState({
                                    newYourDetails: false
                                });
                            }}>
                            {AppConstants.selectFromParticipantAndParentDetails}
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.firstName} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`yourDetailsFirstName`, {
                                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                    })(
                                        <InputWithHead
                                            placeholder={AppConstants.firstName}
                                            onChange={(e) => this.setReviewInfo(captializedString(e.target.value), "firstName", null, "yourInfo", null)}
                                            setFieldsValue={yourInfo ? yourInfo.firstName : null}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                ['yourDetailsFirstName']: captializedString(i.target.value)
                                            })}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.lastName} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`yourDetailsLastName`, {
                                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                    })(
                                        <InputWithHead
                                            placeholder={AppConstants.lastName}
                                            onChange={(e) => this.setReviewInfo(e.target.value, "lastName", null, "yourInfo", null)}
                                            setFieldsValue={yourInfo ? yourInfo.lastName : null}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                ['yourDetailsLastName']: captializedString(i.target.value)
                                            })}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.phone} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`yourDetailsMobileNumber`, {
                                        rules: [{ required: true, message: ValidationConstants.contactField }],
                                    })(
                                        <InputWithHead
                                            placeholder={AppConstants.phone}
                                            onChange={(e) => this.setReviewInfo(e.target.value, "mobileNumber", null, "yourInfo", null)}
                                            setFieldsValue={yourInfo ? yourInfo.mobileNumber : null}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.email} required={"required-field"} />
                                <Form.Item >
                                    {getFieldDecorator(`yourDetailsEmail`, {
                                        rules: [{ required: true, message: ValidationConstants.emailField[0] },
                                        {
                                            type: "email",
                                            pattern: new RegExp(AppConstants.emailExp),
                                            message: ValidationConstants.email_validation
                                        }],
                                    })(
                                        <InputWithHead
                                            placeholder={AppConstants.email}
                                            onChange={(e) => this.setReviewInfo(e.target.value, "email", null, "yourInfo", null)}
                                            setFieldsValue={yourInfo ? yourInfo.email : null}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>

                        <div>
                            {/* {this.state.selectAddressFlag && (
                                <div>
                                    <div className="headline-text-common"
                                    style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.address}</div>
                                    <InputWithHead heading={AppConstants.selectAddress} required={"required-field"}/>
                                    <Form.Item >
                                        {getFieldDecorator(`yourDetailsSelectAddress`, {
                                            rules: [{ required: true, message: ValidationConstants.selectAddressRequired}],
                                        })(
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder={AppConstants.select}>
                                             < Option key={item.id} value={item.id}> {item.name}</Option>
                                        </Select>
                                        )}
                                    </Form.Item>
                                    <div className="btn-text-common pointer" style={{marginTop: "10px"}}
                                    onClick={() => {
                                        this.setState({
                                            selectAddressFlag: false,
                                            searchAddressFlag: true
                                        });
                                    }}
                                    >+ {AppConstants.addNewAddress}</div>
                                </div>
                            )}  */}

                            {this.state.searchAddressFlag && (
                                <div>
                                    {/* <div className="btn-text-common pointer" style={{marginTop: "20px",marginBottom: "10px"}}
                                    onClick={() => {
                                        this.setState({
                                            selectAddressFlag: true,
                                            searchAddressFlag: false
                                        });
                                    }}
                                    >{AppConstants.returnToSelectAddress}</div> */}
                                    <div className="headline-text-common"
                                        style={{ paddingBottom: "0px", marginBottom: "-20px", marginTop: "20px" }}>{AppConstants.findAddress}</div>
                                    <div>
                                        <Form.Item name="addressSearch">
                                            {/* {getFieldDecorator(`yourDetailsAddressSearch`, {
                                                rules: [{ required: true, message: ValidationConstants.addressField}],
                                            })( */}
                                            <PlacesAutocomplete
                                                defaultValue={this.getYourInfoAddress(yourInfo)}
                                                heading={AppConstants.addressSearch}
                                                error={this.state.searchAddressError}
                                                onBlur={() => { this.setState({ searchAddressError: '' }) }}
                                                onSetData={(e) => this.yourInfoAddressSearch(e)}
                                            />
                                            {/* )} */}
                                        </Form.Item>
                                        <div className="btn-text-common pointer" style={{ marginTop: "10px" }}
                                            onClick={() => {
                                                this.setState({
                                                    manualEnterAddressFlag: true,
                                                    searchAddressFlag: false
                                                });
                                                setTimeout(() => {
                                                    this.setYourInfoAddressFormFields("manualEnterAddressFlag")
                                                }, 300);
                                            }}
                                        >{AppConstants.enterAddressManually}</div>
                                    </div>
                                </div>
                            )}

                            {this.state.manualEnterAddressFlag && (
                                <div>
                                    <div className="btn-text-common pointer" style={{ marginTop: "20px", marginBottom: "10px" }}
                                        onClick={() => {
                                            this.setState({
                                                manualEnterAddressFlag: false,
                                                searchAddressFlag: true
                                            });
                                            setTimeout(() => {
                                                this.setYourInfoAddressFormFields("searchAddressFlag")
                                            }, 300);
                                        }}
                                    >{AppConstants.returnToAddressSearch}</div>
                                    <div className="headline-text-common"
                                        style={{ paddingBottom: "0px" }}>{AppConstants.enterAddress}</div>
                                    <Form.Item >
                                        {getFieldDecorator(`yourDetailsStreet1`, {
                                            rules: [{ required: true, message: ValidationConstants.addressField }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.addressOne}
                                                placeholder={AppConstants.addressOne}
                                                onChange={(e) => this.setReviewInfo(e.target.value, "street1", null, "yourInfo", null)}
                                                setFieldsValue={yourInfo ? yourInfo.street1 : null}
                                            />
                                        )}
                                    </Form.Item>
                                    <InputWithHead
                                        heading={AppConstants.addressTwo}
                                        placeholder={AppConstants.addressTwo}
                                        onChange={(e) => this.setReviewInfo(e.target.value, "street2", null, "yourInfo", null)}
                                        value={yourInfo.street2}
                                    />
                                    <Form.Item >
                                        {getFieldDecorator(`yourDetailsSuburb`, {
                                            rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.suburb}
                                                placeholder={AppConstants.suburb}
                                                onChange={(e) => this.setReviewInfo(e.target.value, "suburb", null, "yourInfo", null)}
                                                setFieldsValue={yourInfo ? yourInfo.suburb : null}
                                            />
                                        )}
                                    </Form.Item>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <InputWithHead heading={AppConstants.state} required={"required-field"} />
                                            <Form.Item >
                                                {getFieldDecorator(`yourDetailsStateRefId`, {
                                                    rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                                })(
                                                    <Select
                                                        style={{ width: "100%" }}
                                                        placeholder={AppConstants.state}
                                                        onChange={(e) => this.setReviewInfo(e, "stateRefId", null, "yourInfo", null)}
                                                        setFieldsValue={yourInfo ? yourInfo.stateRefId : null}>
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
                                                {getFieldDecorator(`yourDetailsPostalCode`, {
                                                    rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                                })(
                                                    <InputWithHead
                                                        required={"required-field pt-0 pb-0"}
                                                        placeholder={AppConstants.postcode}
                                                        onChange={(e) => this.setReviewInfo(e.target.value, "postalCode", null, "yourInfo", null)}
                                                        maxLength={4}
                                                        setFieldsValue={yourInfo ? yourInfo.postalCode : null}
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <InputWithHead heading={AppConstants.country} required={"required-field"} />
                                    <Form.Item >
                                        {getFieldDecorator(`yourDetailsCountryRefId`, {
                                            rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder={AppConstants.country}
                                                onChange={(e) => this.setReviewInfo(e, "countryRefId", null, "yourInfo", null)}
                                                setFieldsValue={yourInfo ? yourInfo.countryRefId : null}>
                                                {countryList.length > 0 && countryList.map((item) => (
                                                    < Option key={item.id} value={item.id}> {item.description}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                            )}
                        </div>
                    </div >
                }
            </div >
        )
    }

    contentView = (getFieldDecorator) => {
        return (
            <div className="row" style={{ margin: 0 }}>
                {this.productLeftView(getFieldDecorator)}
                {this.productRightView(getFieldDecorator)}
            </div>
        );
    }

    productLeftView = (getFieldDecorator) => {
        const { registrationReviewList, participantUsers } = this.props.registrationProductState;
        let isSchoolRegistration = registrationReviewList != null ? registrationReviewList.isSchoolRegistration : 0;
        let hasClubVolunteer = registrationReviewList != null ? registrationReviewList.hasClubVolunteer : 0;
        let compParticipants = registrationReviewList != null ? registrationReviewList.compParticipants : [];
        let hasTeamRegistration = compParticipants.find(x => x.isTeamRegistration == 1);
        return (
            <div className="col-sm-12 col-md-7 col-lg-8 p-0" style={{ marginBottom: 23 }}>
                <div className="product-left-view outline-style">
                    {this.participantDetailView(isSchoolRegistration)}
                    {isSchoolRegistration == 0 && this.charityView()}
                    {hasClubVolunteer == 1 && this.otherinfoView()}
                </div>
                {!hasTeamRegistration && isArrayNotEmpty(participantUsers) ?
                    <div className="product-left-view outline-style">
                        {this.yourDetailsView(getFieldDecorator)}
                    </div>
                    : null}
            </div>
        )
    }

    productRightView = (termsAndConditionsView) => {
        const { termsAndConditions } = this.props.registrationProductState;
        return (
            <div className="col-lg-4 col-md-4 col-sm-12 product-right-view px-0">
                {this.yourOrderView()}
                {termsAndConditions.length > 0 && this.termsAndConditionsView(termsAndConditionsView)}
                {this.buttonView()}
            </div>
        )
    }

    yourOrderView = () => {
        const { registrationReviewList } = this.props.registrationProductState;
        let compParticipants = registrationReviewList != null ?
            isArrayNotEmpty(registrationReviewList.compParticipants) ?
                registrationReviewList.compParticipants : [] : [];
        let total = registrationReviewList != null ? registrationReviewList.total : null;
        let shopProducts = registrationReviewList != null ?
            isArrayNotEmpty(registrationReviewList.shopProducts) ?
                registrationReviewList.shopProducts : [] : [];
        return (
            <div className="outline-style " style={{ padding: "36px 20px" }}>
                <div className="headline-text-common">
                    {AppConstants.yourOrder}
                </div>
                {(compParticipants || []).map((item, index) => {
                    let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId, item.isTeamRegistration)
                    return (
                        <div style={{ paddingBottom: 12 }} key={item.participantId + "#" + index}>
                            {item.isTeamRegistration == 1 ?
                                <div className="inter-medium-w500" style={{ marginTop: "17px" }}>
                                    {item.teamName + ' - ' + item.competitionName}
                                </div> :
                                <div className="inter-medium-w500" style={{ marginTop: "17px" }}>
                                    {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                                </div>
                            }
                            {(item.membershipProducts || []).map((mem, memIndex) => (
                                <div key={mem.competitionMembershipProductTypeId + "#" + memIndex}>
                                    {item.isTeamRegistration == 1 ?
                                        <div>
                                            <div className="subtitle-text-common mt-10" > {mem.firstName + ' ' + mem.lastName}</div>
                                            <div className="subtitle-text-common" style={{ display: "flex" }}>
                                                <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{mem.membershipTypeName + (mem.divisionId != null ? ' - ' + mem.divisionName : '')}</div>
                                                <div className="alignself-center pt-2" style={(mem.email !== item.email) ? { marginRight: 10 } : { marginRight: 30 }}>${mem.feesToPay}</div>
                                                {(mem.email !== item.email) && (
                                                    <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId, item.teamName)}>
                                                        <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        <div className="subtitle-text-common mt-10" style={{ display: "flex" }}>
                                            <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{mem.membershipTypeName + (mem.divisionId != null ? ' - ' + mem.divisionName : '')}</div>
                                            <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${mem.feesToPay}</div>
                                            <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId, null)}>
                                                <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                                            </div>
                                        </div>
                                    }

                                    {mem.discountsToDeduct != "0.00" &&
                                        <div className="body-text-common mr-4" style={{ display: "flex" }}>
                                            <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.discount}</div>
                                            <div className="alignself-center pt-2" style={{ marginRight: 10 }}>- ${mem.discountsToDeduct}</div>
                                        </div>
                                    }
                                    {mem.childDiscountsToDeduct != "0.00" &&
                                        <div className="body-text-common mr-4" style={{ display: "flex" }}>
                                            <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.familyDiscount}</div>
                                            <div className="alignself-center pt-2" style={{ marginRight: 10 }}>- ${mem.childDiscountsToDeduct}</div>
                                        </div>
                                    }

                                </div>
                            ))}

                            <div className="payment-option-txt">
                                {paymentOptionTxt}
                            </div>
                            {item.governmentVoucherAmount != "0.00" &&
                                <div className="product-text-common mr-4 pb-4" style={{ display: "flex", fontWeight: 500, }}>
                                    <div className="alignself-center pt-2" style={{ marginRight: "auto" }}> {AppConstants.governmentSportsVoucher}</div>
                                    <div className="alignself-center pt-2" style={{ marginRight: 10 }}>- ${item.governmentVoucherAmount}</div>
                                </div>
                            }
                        </div>
                    )
                }
                )}
                {(shopProducts).map((shop, index) => (
                    <div className="inter-medium-w500" style={{ display: "flex", fontWeight: 500, borderBottom: "1px solid var(--app-e1e1f5)", borderTop: "1px solid var(--app-e1e1f5)" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto", display: "flex", marginTop: "12px", padding: "8px" }}>
                            <div>
                                <img style={{ width: '50px' }} src={shop.productImgUrl ? shop.productImgUrl : AppImages.userIcon} />
                            </div>
                            <div style={{ marginLeft: "6px" }}>
                                <div>
                                    {shop.productName}
                                </div>
                                <div>{shop.optionName && `(${shop.optionName})`}</div>
                            </div>
                        </div>
                        <div className="alignself-center pt-5 subtitle-text-common" style={{ fontWeight: 600, marginRight: 10 }}>${shop.totalAmt ? shop.totalAmt.toFixed(2) : '0.00'}</div>
                        <div style={{ paddingTop: 26 }} onClick={() => this.removeFromCart(index, 'removeShopProduct', 'shopProducts')}>
                            <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                        </div>
                    </div>
                ))}
                <div className="subtitle-text-common mt-10 mr-4" style={{ display: "flex" }}>
                    <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.total}</div>
                </div>
            </div>
        )
    }

    deleteParticiantModalView = () => {
        const { registrationReviewList } = this.props.registrationProductState;
        let compParticipants = registrationReviewList != null ?
            isArrayNotEmpty(registrationReviewList.compParticipants) ?
                registrationReviewList.compParticipants : [] : [];
        let competitions = compParticipants.filter(x => x.participantId == this.state.id);
        let participantHasMoreCompetitions = competitions.length > 1 ? true : false;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title="Registration Participant"
                    visible={this.state.participantModalVisible}
                    onOk={() => this.removeParticipantModal("ok")}
                    onCancel={() => this.removeParticipantModal("cancel")}>
                    <p>{participantHasMoreCompetitions ? AppConstants.deleteCompetition : AppConstants.deleteParticipantMsg}</p>
                </Modal>
            </div>
        );
    }

    deleteProductModalView = () => {
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title="Registration Product"
                    visible={this.state.productModalVisible}
                    onOk={() => this.removeProductModal("ok")}
                    onCancel={() => this.removeProductModal("cancel")}>
                    <p>{AppConstants.deleteProductMsg}</p>
                </Modal>
            </div>
        );
    }

    termsAndConditionsCheck = (e) => {
        this.setState({ agreeTerm: e.target.checked });
        if (e.target.checked) {
            this.setState({ isAgreed: false })
        }
    }

    termsAndConditionsView = (getFieldDecorator) => {
        const { termsAndConditions } = this.props.registrationProductState;
        return (
            <div className="termsView-main outline-style" style={{ padding: "36px 20px 36px 20px" }}>
                <div className="headline-text-common mb-4" style={{ textAlign: "left" }}>{AppConstants.termsAndConditionsHeading}</div>
                <div className="pt-2">
                    {(termsAndConditions || []).map((item, index) => (
                        <div className="pb-4 link-text-common" style={{ marginLeft: 0 }}>
                            <a className="userRegLink" href={item.termsAndConditions} target='_blank' >
                                Terms and Conditions for {item.name}
                            </a>
                        </div>
                    ))}
                </div>
                <div className="body-text-common mt-0" style={{ display: "flex" }}>
                    <div>
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={this.state.agreeTerm}
                            onChange={e => this.termsAndConditionsCheck(e)}
                        >
                            <span className="required-field">{AppConstants.agreeTerm}</span>
                            <span style={{ marginLeft: "5px" }} ></span>
                        </Checkbox>
                    </div>
                    {/* <span style={{marginLeft:"5px"}}> {AppConstants.agreeTerm}</span>                    */}
                </div>
                {this.state.isAgreed &&
                    <div style={{ color: "var(--app-red)" }}>
                        {ValidationConstants.termsAndCondition[0]}
                    </div>
                }

            </div>
        )
    }

    buttonView = () => {
        return (
            <div style={{ marginTop: 23 }}>
                <Button className="open-reg-button link-text-common"
                    htmlType="submit"
                    type="primary"
                    style={{ width: "100%", textTransform: "uppercase" }}>
                    {AppConstants.continue}
                </Button>
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
        const { registrationReviewList } = this.props.registrationProductState;
        const compParticipants = registrationReviewList !== null ?
            isArrayNotEmpty(registrationReviewList.compParticipants) ?
                registrationReviewList.compParticipants : [] : [];
        const isTeamRegistration = compParticipants[0] ? compParticipants[0].isTeamRegistration : true;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout className="layout-margin">
                    {this.headerView(isTeamRegistration)}
                    <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveReviewForm}
                        noValidate="noValidate"
                    >
                        <Content>
                            <Loader visible={this.props.registrationProductState.onRegReviewLoad ||
                                this.props.registrationProductState.deleteOnLoad} />
                            <div>
                                {this.contentView(getFieldDecorator)}
                                {this.deleteParticiantModalView()}
                                {this.deleteProductModalView()}
                                {this.sameSomeOneEmailValidationModal()}
                            </div>
                        </Content>
                    </Form>
                </Layout>
            </div >
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getRegistrationReviewAction,
        saveRegistrationReview,
        updateReviewInfoAction,
        deleteRegistrationProductAction,
        deleteRegistrationParticipantAction,
        getTermsAndConditionsAction,
        getCommonRefData,
        countryReferenceAction,
        getRegParticipantUsersAction,
        getRegistrationShopProductAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        registrationProductState: state.RegistrationProductState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationProducts));
