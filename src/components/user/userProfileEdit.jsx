import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Input,
    Radio,
    Form,
    message,
    Modal,
    Table,
    Typography
} from "antd";
import moment from "moment";

import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";
import { regexNumberExpression } from "../../util/helpers";
import { getOrganisationData, setTempUserId, getUserId } from "../../util/sessionStorage";
import {
    getCommonRefData, countryReferenceAction, nationalityReferenceAction,
    genderReferenceAction, disabilityReferenceAction, combinedAccreditationUmpieCoachRefrence
} from "../../store/actions/commonAction/commonAction";
import UserAxiosApi from "../../store/http/userHttp/userAxiosApi";
import { getUserParentDataAction, teamMemberUpdateAction, userProfileUpdateAction } from "../../store/actions/userAction/userAction";
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from "../../customComponents/loader";
import PlacesAutocomplete from "../registration/elements/PlaceAutoComplete";
import DashboardLayout from "../../pages/dashboardLayout";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
const { Text } = Typography;

const columns = [
    {
        title: AppConstants.id,
        dataIndex: "id",
        key: "key",
    }, {
        title: AppConstants.firstName,
        dataIndex: "firstName",
        key: "firstName",
    }, {
        title: AppConstants.lastName,
        dataIndex: "lastName",
        key: "lastName",
    }, {
        title: AppConstants.dateOfBirth,
        dataIndex: "dob",
        key: "dob",
    }, {
        title: AppConstants.emailAdd,
        dataIndex: "maskedEmail",
        key: "maskedEmail",
    }, {
        title: AppConstants.contactNumber,
        dataIndex: "maskedMobileNumber",
        key: "maskedMobileNumber",
    }, {
        title: AppConstants.affiliate,
        dataIndex: "affiliate",
        key: "affiliate",
    },
];

class UserProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            userRegistrationId: '',
            displaySection: "0",
            loadValue: false,
            saveLoad: false,
            tabKey: "4",
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            userData: {
                genderRefId: 0,
                firstName: "",
                lastName: "",
                mobileNumber: "",
                email: "",
                middleName: "",
                dateOfBirth: null,
                street1: "",
                street2: "",
                suburb: "",
                stateRefId: 0,
                postalCode: "",
                statusRefId: 0,
                emergencyFirstName: "",
                emergencyLastName: "",
                emergencyContactNumber: "",
                existingMedicalCondition: "",
                regularMedication: "",
                disabilityCareNumber: '',
                isDisability: 0,
                disabilityTypeRefId: 0,
                countryRefId: null,
                nationalityRefId: null,
                languages: "",
                childrenCheckNumber: "",
                childrenCheckExpiryDate: "",
                parentUserId: 0,
                childUserId: 0,
                accreditationLevelUmpireRefId: null,
                accreditationLevelCoachRefId: null,
                accreditationUmpireExpiryDate: null,
                accreditationCoachExpiryDate: null
            },
            isSameEmail: false,
            showSameEmailOption: false,
            showParentEmailSelectbox: false,
            enableEmailInputbox: true,
            showEmailInputbox: true,
            titleLabel: "",
            section: "",
            isSameUserEmailChanged: false,
            hasErrorAddressEdit: false,
            hasErrorEmergency: false,
            hasErrorAddressNumber: false,
            venueAddressError: '',
            manualAddress: false,
            storedEmailAddress: null,
            isAdding: false,
            // possible matches
            possibleMatches: [],
            isPossibleMatchShow: false,
            isLoading: false,
            parentMatchingId: 0,
        };
        this.confirmOpend = false;
        // this.props.getCommonRefData();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();
        this.props.genderReferenceAction();
        this.props.disabilityReferenceAction();
        this.formRef = React.createRef();
        this.props.combinedAccreditationUmpieCoachRefrence();
    }

    async componentDidMount() {
        if (this.props.history.location.state) {
            let titleLabel = "";
            let section = "";
            let data = this.props.history.location.state.userData;
            let moduleFrom = this.props.history.location.state.moduleFrom;

            if (moduleFrom == "1") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.address;
                section = "address";
            } else if (moduleFrom == "2") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.parentOrGuardianDetail;
                section = "primary";
            } else if (moduleFrom == "3") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.emergencyContacts;
                section = "emergency";
            } else if (moduleFrom == "4") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.otherInformation;
                section = "other";
            } else if (moduleFrom == "5") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.medical;
                section = "medical";
                this.setState({ tabKey: "5" });
                if (data != null) {
                    if (data.disability != null && data.disability.length > 0) {
                        data["isDisability"] = data.disability[0]["isDisability"];
                        data["disabilityTypeRefId"] = data.disability[0]["disabilityTypeRefId"];
                        data["disabilityCareNumber"] = data.disability[0]["disabilityCareNumber"];
                        delete data.disability;
                    }
                }
            } else if (moduleFrom == "6") {
                titleLabel = AppConstants.edit + ' ' + AppConstants.child;
                section = "child";
            } else if (moduleFrom == "7") {
                titleLabel = AppConstants.addChild;
                section = "child";
            } else if (moduleFrom == "8") {
                titleLabel = AppConstants.addParent_guardian;
                section = "primary";
            }
            let userDataTemp = this.state.userData;
            if (moduleFrom == 7 || moduleFrom == 8) {
                userDataTemp.userId = data.userId;
            }

            const showSameEmailOption = !!data.dateOfBirth && (moment().year() - moment(data.dateOfBirth).year() <= 18)
                                        && ((titleLabel === AppConstants.edit + ' ' + AppConstants.address)
                                        || (titleLabel === AppConstants.edit + ' ' + AppConstants.child)
                                        || (titleLabel === AppConstants.addChild));

            await this.props.getUserParentDataAction();
            const { parentData } = this.props.userState;
            let additionalSettings = {};
            if (showSameEmailOption) {
                const matchingData = parentData.find((parent) => {
                    return (parent.email?.toLowerCase() + '.' + data.firstName?.toLowerCase() === data.email?.toLowerCase());
                });

                if (matchingData) {
                    additionalSettings = {
                        ...additionalSettings,
                        showParentEmailSelectbox: true,
                        enableEmailInputbox: false,
                        showEmailInputbox: false,
                        isSameEmail: true,
                        parentMatchingId: matchingData.id,
                    };
                }
            }

            const personalEmail = this.props.userState.personalData.email;
            if ((personalEmail?.toLowerCase() + '.' + data.firstName?.toLowerCase()) === data.email?.toLowerCase()) {
                data['email'] = personalEmail;
                additionalSettings = {
                    ...additionalSettings,
                    isSameEmail: true,
                    enableEmailInputbox: false,
                };
            }

            await this.setState({
                displaySection: moduleFrom,
                userData: (moduleFrom != "7" && moduleFrom != "8") ? data : userDataTemp,
                showSameEmailOption,
                titleLabel: titleLabel,
                section: section,
                loadValue: true,
                ...additionalSettings,
            });
            setTempUserId(data.userId);
        }
    }

    componentDidUpdate(nextProps) {
        if (this.state.loadValue) {
            this.setState({ loadValue: false });
            if (this.state.displaySection == "1") {
                this.setAddressFormFields();
            } else if (this.state.displaySection == "2") {
                this.setPrimaryContactFormFields();
            } else if (this.state.displaySection == "3") {
                this.setEmergencyFormField();
            } else if (this.state.displaySection == "4") {
                this.setOtherInfoFormField();
            } else if (this.state.displaySection == "6") {
                this.setPrimaryContactFormFields();
            }
        }
        let userState = this.props.userState;
        if (userState.onUpUpdateLoad == false && this.state.saveLoad == true) {
            this.setState({ saveLoad: false });
            if (userState.status == 1) {
                if (this.state.isSameUserEmailChanged) {
                    this.logout();
                } else {
                    history.push({
                        pathname: '/userPersonal',
                        state: { tabKey: this.state.tabKey, userId: this.state.userData.userId }
                    });
                }
            } else if (userState.status == 4) {
                message.config({ duration: 1.5, maxCount: 1, });
                message.error(userState.userProfileUpdate);
            }
        }
    }

    logout = () => {
        try {
            localStorage.clear();
            history.push("/login");
        } catch (error) {
            console.log("Error" + error);
        }
    };

    setAddressFormFields = () => {
        let userData = this.state.userData;
        this.setState({ storedEmailAddress: userData.email });
        this.props.form.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            dateOfBirth: ((userData.dateOfBirth != null && userData.dateOfBirth != '')
                ? moment(userData.dateOfBirth, "YYYY-MM-DD")
                : null),
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
        })
    };

    setPrimaryContactFormFields = () => {
        let userData = this.state.userData;
        this.props.form.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
        });
    };

    setEmergencyFormField = () => {
        let userData = this.state.userData;
        this.props.form.setFieldsValue({
            emergencyFirstName: userData.emergencyFirstName,
            emergencyLastName: userData.emergencyLastName,
            emergencyContactNumber: userData.emergencyContactNumber,
        });
    };

    setOtherInfoFormField = () => {
        let userData = this.state.userData;
        let personalData = this.props.location.state ? this.props.location.state.personalData ? this.props.location.state.personalData : null : null;

        if (personalData) {
            userData.accreditationCoachExpiryDate = personalData.accreditationCoachExpiryDate;
            userData.accreditationLevelCoachRefId = personalData.accreditationLevelCoachRefId;
            userData.accreditationLevelUmpireRefId = personalData.accreditationLevelUmpireRefId;
            userData.accreditationUmpireExpiryDate = personalData.accreditationUmpireExpiryDate;

            setTimeout(() => {
                this.props.form.setFieldsValue({
                    accreditationLevelUmpireRefId: personalData.accreditationLevelUmpireRefId,
                    accreditationLevelCoachRefId: personalData.accreditationLevelCoachRefId,
                    accreditationUmpireExpiryDate: personalData.accreditationUmpireExpiryDate && moment(personalData.accreditationUmpireExpiryDate),
                    accreditationCoachExpiryDate: personalData.accreditationCoachExpiryDate && moment(personalData.accreditationCoachExpiryDate),
                });
            }, 1000);
        }
        this.props.form.setFieldsValue({
            genderRefId: userData.genderRefId ? parseInt(userData.genderRefId) : null,
        });
    };

    setUserDataContactEmailDefault = () => {
        const personalEmail = this.props.userState.personalData.email;
        this.setUserDataContactEmail(personalEmail);
    }

    setUserDataContactEmail = async (email) => {
        let data = {...this.state.userData};
        data['email'] = email;
        await this.setState({ userData: data });
        await this.props.form.setFieldsValue({ email });
    }

    onChangeSetValue = async (value, key) => {
        let data = {...this.state.userData};
        let additionalSettings = {};
        if (key === "isDisability") {
            if (value == 0) {
                data["disabilityCareNumber"] = null;
                data["disabilityTypeRefId"] = null;
            }
        } else if (key === "dateOfBirth") {
            value = value && (moment(value).format("YYYY-MM-DD"));
            const age = moment().year() - moment(value).year();
            if (age < 18) {
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.child)
                || this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)
                || this.state.titleLabel === AppConstants.addChild) {
                    await this.setState({ showSameEmailOption: true });
                }
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.child)
                || this.state.titleLabel === AppConstants.addChild) {
                    data['email'] = this.props.userState.personalData.email;
                    await this.props.form.setFieldsValue({ "email": data["email"] });
                    additionalSettings = { ...additionalSettings, isSameEmail: true, enableEmailInputbox: false };
                }
            } else {
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.child)
                || this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)
                || this.state.titleLabel === AppConstants.addChild) {
                    await this.setState({
                        showSameEmailOption: false,
                        enableEmailInputbox: true,
                        isSameEmail: false
                    });
                }
            }
        } else if (key === "email" && this.state.section === "address") {
            if (data.userId == getUserId()) {
                this.setState({ isSameUserEmailChanged: true });
            } else {
                this.setState({ isSameUserEmailChanged: false });
            }
        } else if (key === "mobileNumber" && this.state.section === "address") {
            if (value.length === 10) {
                this.setState({
                    hasErrorAddressEdit: false
                });
                value = regexNumberExpression(value);
            } else if (value.length < 10) {
                this.setState({
                    hasErrorAddressEdit: true
                });

                value = regexNumberExpression(value);

                if (regexNumberExpression(value) == undefined) {
                    setTimeout(() => {
                        this.props.form.setFieldsValue({
                            mobileNumber: this.state.userData.mobileNumber,
                        })
                    }, 300);
                }
            }
        } else if (key === "emergencyContactNumber") {
            if (value.length === 10) {
                this.setState({
                    hasErrorEmergency: false
                });
                value = regexNumberExpression(value)
            } else if (value.length < 10) {
                this.setState({
                    hasErrorEmergency: true
                });

                value = regexNumberExpression(value);

                if (regexNumberExpression(value) == undefined) {
                    setTimeout(() => {
                        this.props.form.setFieldsValue({
                            emergencyContactNumber: this.state.userData.emergencyContactNumber,
                        });
                    }, 300);
                }
            }
        } else if (key === "parentEmail") {
            if (value === -1) {
                await this.setState({ enableEmailInputbox: true, showEmailInputbox: true });
                return;
            } else {
                const { parentData } = this.props.userState;
                const parent = parentData.find((item) => item.id === value);
                const updatedEmail = parent.email + '.' + data.firstName;
                await this.setState({ enableEmailInputbox: false, showEmailInputbox: false });
                key = "email";
                value = updatedEmail;
            }
        }

        if (key === 'accreditationLevelUmpireRefId') {
            data.accreditationUmpireExpiryDate = null;
            this.props.form.setFieldsValue({
                accreditationUmpireExpiryDate: null,
            });
        }

        if (key === 'accreditationLevelCoachRefId') {
            data.accreditationCoachExpiryDate = null;
            this.props.form.setFieldsValue({
                accreditationCoachExpiryDate: null,
            });
        }
        data[key] = value;

        this.setState({ userData: data, ...additionalSettings });
    };

    headerView = () => (
        <div className="header-view">
            <Header
                className="form-header-view"
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Breadcrumb separator=" > ">
                    <Breadcrumb.Item className="breadcrumb-add">
                        {this.state.titleLabel}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Header>
        </div>
    );

    handlePlacesAutocomplete = (data) => {
        const { stateListData } = this.props.commonReducerState;
        const address = data;
        let userData = this.state.userData;
        // this.props.checkVenueDuplication(address);

        if (!address || !address.suburb) {
            this.setState({
                venueAddressError: ValidationConstants.venueAddressDetailsError,
            });
        } else {
            this.setState({
                venueAddressError: ''
            });
        }

        this.setState({
            venueAddress: address,
        });
        const stateRefId = stateListData.length > 0 && address.state
            ? stateListData.find((state) => state.name === address.state).id
            : null;

        // this.formRef.current.setFieldsValue({
        //     state: address.state,
        //     addressOne: address.addressOne || null,
        //     suburb: address.suburb || null,
        //     postcode: address.postcode || null,
        // });
        if (address) {
            userData['street1'] = address.addressOne;
            userData['stateRefId'] = stateRefId;
            userData['suburb'] = address.suburb;
            userData['postalCode'] = address.postcode;
        }
    };

    addressEdit = (getFieldDecorator) => {
        let userData = this.state.userData;
        const { stateListData } = this.props.commonReducerState;
        let hasErrorAddressEdit = this.state.hasErrorAddressEdit;

        let state = (stateListData.length > 0 && userData.stateRefId)
            ? stateListData.find((state) => state.id == userData.stateRefId).name
            : null;

        let defaultVenueAddress = null;
        if (userData.street1) {
            defaultVenueAddress = `${userData.street1 && `${userData.street1},`} ${userData.suburb && `${userData.suburb},`} ${state && `${state},`} `;
        }

        const { parentData } = this.props.userState;

        return (
            <div className="pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: ValidationConstants.firstName }],
                            })(
                                <InputWithHead
                                    required="required-field pb-0"
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.firstName}
                                    name="firstName"
                                    setFieldsValue={userData.firstName}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                                />
                            )}
                        </Form.Item>
                    </div>

                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator('lastName', {
                                rules: [{ required: false }],
                            })(
                                <InputWithHead
                                    required="required-field pb-0"
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    name="lastName"
                                    setFieldsValue={userData.lastName}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            // style={{ marginTop: "9px" }}
                            heading={AppConstants.middleName}
                            placeholder={AppConstants.middleName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "middleName")}
                            value={userData.middleName}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dob} />
                        <DatePicker
                            size="large"
                            placeholder="dd-mm-yyyy"
                            style={{ width: "100%" }}
                            onChange={e => this.onChangeSetValue(e, "dateOfBirth")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            name="dateOfBirth"
                            value={userData.dateOfBirth ? moment(userData.dateOfBirth) : null}
                        />
                    </div>
                </div>

                {/* todo: below needs to be properly handled. hiding it now */}
                {/*
                {(this.state.titleLabel === AppConstants.addParent_guardian || this.state.titleLabel === AppConstants.addChild) && (
                    <Checkbox
                        className="single-checkbox"
                        checked={this.state.isSameEmail}
                        onChange={(e) => this.setState({ isSameEmail: e.target.checked })}
                    >
                        {this.state.titleLabel === AppConstants.addParent_guardian
                            ? AppConstants.useChildEmail : AppConstants.useParentEmail}
                    </Checkbox>
                )}
                */}

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.contactMobile} />
                        <Form.Item
                            help={hasErrorAddressEdit && ValidationConstants.mobileLength}
                            validateStatus={hasErrorAddressEdit ? "error" : 'validating'}
                        >
                            {getFieldDecorator('mobileNumber', {
                                rules: [{ required: true, message: ValidationConstants.contactField }],
                            })(
                                <InputWithHead
                                    required="required-field pb-0 pt-3"
                                    placeholder={AppConstants.contactMobile}
                                    name="mobileNumber"
                                    setFieldsValue={userData.mobileNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                                    maxLength={10}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.contactEmail} />
                        {this.state.showParentEmailSelectbox && (
                            <Select
                                placeholder={AppConstants.selectParentEmail}
                                name="parentEmail"
                                onSelect={(e) => this.onChangeSetValue(e, "parentEmail")}
                                defaultValue={this.state.parentMatchingId ? this.state.parentMatchingId: parentData[0].id}
                            >
                                {parentData?.map((item) => (
                                    <Option key={item.id} value={item.id}>{item.firstName + " " + item.lastName}</Option>
                                ))}
                            </Select>
                        )}
                        {this.state.showEmailInputbox && (
                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [
                                        !this.state.isSameEmail && { required: true, message: ValidationConstants.emailField[0] },
                                        !this.state.isSameEmail && {
                                            type: "email",
                                            pattern: new RegExp(AppConstants.emailExp),
                                            message: ValidationConstants.email_validation
                                        }
                                    ],
                                })(
                                    <InputWithHead
                                        required="required-field pb-0 pt-3"
                                        style={{ marginTop: this.state.showParentEmailSelectbox && "10px" }}
                                        placeholder={AppConstants.contactEmail}
                                        name="email"
                                        setFieldsValue={userData.email}
                                        disabled={!this.state.enableEmailInputbox}
                                        onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                                    />
                                )}
                            </Form.Item>
                        )}
                        {(userData.userId == getUserId() && this.state.isSameUserEmailChanged) && (
                            <div className="same-user-validation">
                                {ValidationConstants.emailField[2]}
                            </div>
                        )}
                        {this.state.showSameEmailOption && (
                            <Checkbox
                                className="single-checkbox"
                                checked={this.state.isSameEmail}
                                onChange={async (e) => {
                                    if (e.target.checked) {
                                        if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)) {
                                            await this.setState({
                                                showParentEmailSelectbox: true,
                                                showEmailInputbox: false,
                                                enableEmailInputbox: false,
                                            });
                                            await this.setUserDataContactEmail(parentData[0].email + '.' + this.state.userData.firstName);
                                        } else {
                                            await this.setUserDataContactEmailDefault();
                                            await this.setState({
                                                enableEmailInputbox: false,
                                            });
                                        }
                                    } else {
                                        if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)) {
                                            await this.setUserDataContactEmailDefault();
                                            await this.setState({
                                                showParentEmailSelectbox: false,
                                                showEmailInputbox: true,
                                                enableEmailInputbox: true,
                                            });
                                        } else {
                                            await this.setState({
                                                enableEmailInputbox: true,
                                            })
                                        }
                                    }
                                    this.setState({ isSameEmail: e.target.checked });
                                }}
                            >
                                {AppConstants.useParentsEmailAddress}
                            </Checkbox>
                        )}
                    </div>
                </div>
                {!this.state.manualAddress && (
                    <PlacesAutocomplete
                        defaultValue={defaultVenueAddress && `${defaultVenueAddress}Australia`}
                        heading={AppConstants.addressSearch}
                        required
                        error={this.state.venueAddressError}
                        onSetData={this.handlePlacesAutocomplete}
                    />
                )}

                <div
                    className="orange-action-txt" style={{ marginTop: "10px" }}
                    onClick={() => this.setState({ manualAddress: !this.state.manualAddress })}
                >
                    {this.state.manualAddress ? AppConstants.returnToSelectAddress : AppConstants.enterAddressManually}
                </div>

                {this.state.manualAddress && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="new-addressOne"
                                // required="required-field"
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                name="street1"
                                value={userData?.street1}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
                                // readOnly
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="new-addressTwo"
                                // style={{ marginTop: 9 }}
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                name="street2"
                                value={userData?.street2}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
                            />
                        </div>
                    </div>
                )}

                {this.state.manualAddress && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                // style={{ marginTop: 9 }}
                                heading={AppConstants.suburb}
                                placeholder={AppConstants.suburb}
                                // required="required-field"
                                name="suburb"
                                value={userData?.suburb}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
                                // readOnly
                            />
                        </div>
                        <div className="col-sm">
                            <div>
                                <InputWithHead heading={AppConstants.stateHeading} />
                            </div>
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                placeholder={AppConstants.select}
                                // required="required-field"
                                value={userData?.stateRefId}
                                name="stateRefId"
                                onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                                // readOnly
                                // disabled
                            >
                                {stateListData.map((item) => (
                                    <Option key={'state_' + item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}
                {this.state.manualAddress && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.postCode}
                                placeholder={AppConstants.postCode}
                                name="postalCode"
                                value={userData?.postalCode}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode")}
                                maxLength={4}
                                // readOnly
                            />
                        </div>
                        <div className="col-sm" />
                    </div>
                )}
            </div>
        );
    };

    primaryContactEdit = (getFieldDecorator) => {
        let userData = this.state.userData;
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: ValidationConstants.firstName }],
                            })(
                                <InputWithHead
                                    required="required-field"
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.firstName}
                                    name="firstName"
                                    setFieldsValue={userData.firstName}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator('lastName', {
                                rules: [{ required: false }],
                            })(
                                <InputWithHead
                                    required="required-field"
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    name="lastName"
                                    setFieldsValue={userData.lastName}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" style={{ paddingTop: "11px" }}>
                        <InputWithHead
                            style={{ marginTop: "9px" }}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            name={'street1'}
                            value={userData.street1}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
                        />
                    </div>
                    <div className="col-sm" style={{ paddingTop: "11px" }}>
                        <InputWithHead
                            style={{ marginTop: "9px" }}
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            name={'street2'}
                            value={userData.street2}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" style={{ paddingTop: "11px" }}>
                        <InputWithHead
                            style={{ marginTop: "9px" }}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            name={'suburb'}
                            value={userData.suburb}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
                        />
                    </div>
                    <div className="col-sm">
                        <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                            <InputWithHead heading={AppConstants.stateHeading} />
                        </div>
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.select_state}
                            // onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                            value={userData.stateRefId}
                            name={'stateRefId'}
                            onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                        >
                            {stateList.length > 0 && stateList.map((item) => (
                                <Option value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row">
                    <div className="col-sm" style={{ paddingTop: "11px" }}>
                        <InputWithHead
                            style={{ marginTop: "9px" }}
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.enterPostCode}
                            name={'postalCode'}
                            value={userData.postalCode}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode")}
                        />
                    </div>
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                            })(
                                <InputWithHead
                                    heading={AppConstants.contactEmail}
                                    placeholder={AppConstants.contactEmail}
                                    name={'email'}
                                    setFieldsValue={userData.email}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator('mobileNumber', {
                                rules: [{ required: true, message: ValidationConstants.contactField }],
                            })(
                                <InputWithHead
                                    heading={AppConstants.contactMobile}
                                    placeholder={AppConstants.contactMobile}
                                    name={'mobileNumber'}
                                    setFieldsValue={userData.mobileNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm" />
                </div>
            </div>
        );
    };

    emergencyContactEdit = (getFieldDecorator) => {
        let userData = this.state.userData;
        let hasErrorEmergency = this.state.hasErrorEmergency;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <Form.Item>
                            {getFieldDecorator('emergencyFirstName', {
                                rules: [{ required: true, message: ValidationConstants.emergencyContactName[0] }],
                            })(
                                <InputWithHead
                                    required="required-field"
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.firstName}
                                    name={'emergencyFirstName'}
                                    setFieldsValue={userData.emergencyFirstName}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyFirstName")}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Form.Item>
                            {getFieldDecorator('emergencyLastName', {
                                rules: [{ required: true, message: ValidationConstants.emergencyContactName[1] }],
                            })(
                                <InputWithHead
                                    required="required-field"
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    name={'emergencyLastName'}
                                    setFieldsValue={userData.emergencyLastName}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyLastName")}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Form.Item
                            help={hasErrorEmergency && ValidationConstants.mobileLength}
                            validateStatus={hasErrorEmergency ? "error" : 'validating'}
                        >
                            {getFieldDecorator('emergencyContactNumber', {
                                rules: [{ required: true, message: ValidationConstants.emergencyContactNumber[0] }],
                            })(
                                <InputWithHead
                                    required="required-field"
                                    heading={AppConstants.mobileNumber}
                                    placeholder={AppConstants.mobileNumber}
                                    name={'emergencyContactNumber'}
                                    setFieldsValue={userData.emergencyContactNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyContactNumber")}
                                    maxLength={10}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>
            </div>
        );
    };

    otherInfoEdit = (getFieldDecorator) => {
        let userData = this.state.userData;
        const { countryList, nationalityList, genderList, umpireAccreditation, coachAccreditation } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <div style={{ paddingTop: "11px", paddingBottom: "10px" }}>
                            <InputWithHead heading={AppConstants.gender} required="required-field" />
                            <Form.Item>
                                {getFieldDecorator(`genderRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.genderField }],
                                })(
                                    <Radio.Group
                                        className="reg-competition-radio"
                                        onChange={(e) => this.onChangeSetValue(e.target.value, "genderRefId")}
                                        setFieldsValue={userData.genderRefId}
                                    >
                                        {(genderList || []).map((gender) => (
                                            <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                                        ))}
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelUmpire} required="required-field" />
                            <Form.Item>
                                {getFieldDecorator(`accreditationLevelUmpireRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.accreditationLevelUmpire }],
                                })(
                                    <Radio.Group
                                        className="registration-radio-group"
                                        onChange={(e) => this.onChangeSetValue(e.target.value, "accreditationLevelUmpireRefId")}
                                        // setFieldsValue={userData.accreditationLevelUmpireRefId}
                                    >
                                        {(umpireAccreditation || []).map((accreditation) => (
                                            <Radio style={{ marginBottom: "10px" }} key={accreditation.id} value={accreditation.id}>
                                                {accreditation.description}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                )}
                            </Form.Item>

                            {(userData.accreditationLevelUmpireRefId != 1 && userData.accreditationLevelUmpireRefId != null) && (
                                <Form.Item>
                                    {getFieldDecorator(`accreditationUmpireExpiryDate`, {
                                        rules: [{ required: true, message: ValidationConstants.expiryDateRequire }],
                                    })(
                                        <DatePicker
                                            size="large"
                                            placeholder={AppConstants.expiryDate}
                                            style={{ width: "100%", marginTop: "20px" }}
                                            onChange={(e, f) => this.onChangeSetValue((moment(e).format("YYYY-MM-DD")), "accreditationUmpireExpiryDate")}
                                            format="DD-MM-YYYY"
                                            showTime={false}
                                            value={userData.accreditationUmpireExpiryDate && moment(userData.accreditationUmpireExpiryDate)}
                                            disabledDate={d => !d || d.isSameOrBefore(new Date())}
                                        />
                                    )}
                                </Form.Item>
                            )}
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach} required="required-field" />
                            <Form.Item>
                                {getFieldDecorator(`accreditationLevelCoachRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.accreditationLevelCoach }],
                                })(
                                    <Radio.Group
                                        style={{ display: "flex", flexDirection: "column" }}
                                        className="registration-radio-group"
                                        onChange={(e) => this.onChangeSetValue(e.target.value, "accreditationLevelCoachRefId")}
                                        // setFieldsValue={userData.accreditationLevelCoachRefId}
                                    >
                                        {(coachAccreditation || []).map((accreditation) => (
                                            <Radio style={{ marginBottom: "10px" }} key={accreditation.id} value={accreditation.id}>{accreditation.description}</Radio>
                                        ))}
                                    </Radio.Group>
                                )}
                            </Form.Item>

                            {(userData.accreditationLevelCoachRefId != 1 && userData.accreditationLevelCoachRefId != null) && (
                                <Form.Item>
                                    {getFieldDecorator(`accreditationCoachExpiryDate`, {
                                        rules: [{ required: true, message: ValidationConstants.expiryDateRequire }],
                                    })(
                                        <DatePicker
                                            size="large"
                                            placeholder={AppConstants.expiryDate}
                                            style={{ width: "100%", marginTop: "20px" }}
                                            // onChange={(e, f) => this.onChangeSetValue(e, "accreditationCoachExpiryDate")}
                                            onChange={(e, f) => this.onChangeSetValue((moment(e).format("YYYY-MM-DD")), "accreditationCoachExpiryDate")}
                                            format="DD-MM-YYYY"
                                            showTime={false}
                                            value={userData.accreditationCoachExpiryDate && moment(userData.accreditationCoachExpiryDate)}
                                            disabledDate={d => !d || d.isSameOrBefore(new Date())}
                                        />
                                    )}
                                </Form.Item>
                            )}
                        </div>
                    </div>
                </div>
                {userData.userRegistrationId != null && (
                    <div>
                        <div className="row">
                            <div className="col-sm">
                                <div style={{ paddingTop: "11px", paddingBottom: "10px" }}>
                                    <InputWithHead heading={AppConstants.childCountry} />
                                </div>
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.childCountry}
                                    onChange={(e) => this.onChangeSetValue(e, "countryRefId")}
                                    value={userData.countryRefId}
                                    name={'countryRefId'}
                                >
                                    {countryList.length > 0 && countryList.map((country) => (
                                        <Option key={country.id} value={country.id}>{country.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/*
                        <div className="row">
                            <div className="col-sm">
                                <div style={{ paddingTop: "11px", paddingBottom: "10px" }}>
                                    <InputWithHead heading={AppConstants.nationalityReference} />
                                </div>
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.nationalityReference}
                                    onChange={(e) => { this.onChangeSetValue(e, "nationalityRefId") }}
                                    value={userData.nationalityRefId}
                                    name={"nationalityRefId"}
                                >
                                    {nationalityList.length > 0 && nationalityList.map((nation) => (
                                        <Option key={nation.id} value={nation.id}>{nation.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    heading={AppConstants.childLangSpoken}
                                    placeholder={AppConstants.childLangSpoken}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "languages")}
                                    value={userData.languages}
                                    name={'languages'}
                                />
                            </div>
                        </div>
                        */}

                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    heading={AppConstants.childrenNumber}
                                    placeholder={AppConstants.childrenNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "childrenCheckNumber")}
                                    value={userData.childrenCheckNumber}
                                    name={'childrenCheckNumber'}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.checkExpiryDate} />
                                <DatePicker
                                    size="large"
                                    style={{ width: '100%', marginTop: 9, }}
                                    onChange={e => this.onChangeSetValue(e, "childrenCheckExpiryDate")}
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    value={userData.childrenCheckExpiryDate !== null && moment(userData.childrenCheckExpiryDate)}
                                    placeholder="dd-mm-yyyy"
                                    name={'childrenCheckExpiryDate'}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    medicalEdit = (getFieldDecorator) => {
        let userData = this.state.userData;
        let { disabilityList } = this.props.commonReducerState;

        return (
            <div className="formView pt-5" style={{ paddingBottom: "40px" }}>
                {/* <span className="form-heading">{AppConstants.additionalInfoReqd}</span> */}
                <InputWithHead heading={AppConstants.existingMedConditions} />
                <TextArea
                    placeholder={AppConstants.existingMedConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "existingMedicalCondition")}
                    value={userData.existingMedicalCondition}
                    allowClear
                />

                <InputWithHead heading={AppConstants.redularMedicalConditions} />
                <TextArea
                    placeholder={AppConstants.redularMedicalConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "regularMedication")}
                    value={userData.regularMedication}
                    allowClear
                />

                <div>
                    <InputWithHead heading={AppConstants.haveDisability} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onChangeSetValue(e.target.value, "isDisability")}
                        value={userData.isDisability}
                    >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        {userData.isDisability == 1 && (
                            <div style={{ marginLeft: '25px' }}>
                                <InputWithHead
                                    heading={AppConstants.disabilityCareNumber}
                                    placeholder={AppConstants.disabilityCareNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityCareNumber")}
                                    value={userData.disabilityCareNumber}
                                />
                                <InputWithHead heading={AppConstants.typeOfDisability} required="required-field" />
                                <Radio.Group
                                    className="reg-competition-radio"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityTypeRefId")}
                                    value={userData.disabilityTypeRefId}
                                >
                                    {(disabilityList || []).map((dis) => (
                                        <Radio key={dis.id} value={dis.id}>{dis.description}</Radio>
                                    ))}
                                </Radio.Group>
                            </div>
                        )}
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    };

    contentView = (getFieldDecorator) => {
        const { displaySection } = this.state;

        return (
            <div className="content-view pt-0">
                {/* {this.state.displaySection == "1" && (
                    <div>{this.addressEdit(getFieldDecorator)}</div>
                )} */}

                {/* {(this.state.displaySection == "2" || this.state.displaySection == "6") && (
                    <div>{this.primaryContactEdit(getFieldDecorator)}</div>
                )} */}

                {(displaySection === "1" || displaySection === "2" || displaySection === "6" || displaySection === "7" || displaySection === "8") && (
                    <div>{this.addressEdit(getFieldDecorator)}</div>
                )}

                {displaySection == "3" && (
                    <div>{this.emergencyContactEdit(getFieldDecorator)}</div>
                )}

                {displaySection == "4" && (
                    <div>{this.otherInfoEdit(getFieldDecorator)}</div>
                )}

                {displaySection == "5" && (
                    <div>{this.medicalEdit(getFieldDecorator)}</div>
                )}
            </div>
        );
    };

    // possible matches view
    // ideally this should be separate from the user profile view

    maskMobileNumber = (number = 0) => {
        const maskedNumber = number.toString().replace(/([0-9]{2})([0-9]{4})([0-9]{4})/, ($0, $1, $2, $3) => { return $1 + $2.replace(/\d/g, '*') + $3; });
        return maskedNumber;
    };

    maskEmail = (email = '') => {
        const [name, domain] = email.split('@');
        let maskedName = '';
        for (let i = 0; i < name.length; i ++) {
            maskedName += i === 0 ? name[i] : '*';
        }
        const [mailType, portion] = domain.split('.');
        let maskedMailType = '';
        for (let i = 0; i < mailType.length; i ++) {
            maskedMailType += i === 0 ? mailType[i] : '*';
        }
        const maskedEmail = maskedName + '@' + maskedMailType + '.' + portion;
        return maskedEmail;
    };

    possibleMatchesDetailView = (matches) => {
        let selectedMatch = null;

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                selectedMatch = selectedRows;
            },
            getCheckboxProps: (record) => ({
                name: record.name,
            }),
        };

        const dataSource = matches.map((u) => ({
            key: u.id,
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastname,
            dob: moment(u.dateOfBirth).format('DD/MM/YYYY'),
            email: u.email,
            maskedEmail: this.maskEmail(u.email),
            mobile: u.mobileNumber,
            maskedMobileNumber: this.maskMobileNumber(u.mobileNumber),
            affiliate: u.affiliates && u.affiliates.length ? u.affiliates.join(', ') : '',
        }));

        // actual function to call saving a child / parent
        const addChildOrParent = async () => {
            // if match is not selected, save the user data from the form
            const userToAdd = {...this.state.userData, ...selectedMatch};
            const { userId } = this.props.history.location.state.userData;
            const sameEmail = (this.state.isSameEmail || this.state.userData.email === this.props.history.location.state.userData.email) ? 1 : 0;

            this.setState({ isLoading: true });
            if (this.state.titleLabel === AppConstants.addChild) {
                try {
                    const { status } = await UserAxiosApi.addChild({ userId, sameEmail, body: userToAdd });
                    if ([1, 4].includes(status)) {
                        history.push({
                            pathname: '/userPersonal',
                            state: { tabKey: this.state.tabKey, userId: this.props.history.location.state.userData.userId },
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            } else if (this.state.titleLabel === AppConstants.addParent_guardian) {
                try {
                    const { status } = await UserAxiosApi.addParent({ userId, sameEmail, body: userToAdd });
                    if ([1, 4].includes(status)) {
                        history.push({
                            pathname: '/userPersonal',
                            state: { tabKey: this.state.tabKey, userId: this.props.history.location.state.userData.userId },
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            this.setState({ isLoading: false });
            // this.setState({ saveLoad: true });
        };

        const onCancel = () => {
            this.confirmOpend = false;
            this.setState({ isPossibleMatchShow: false });
        };

        return (
            <div className="comp-dash-table-view mt-5">
                <Loader visible={this.state.isLoading} />
                <h2>{AppConstants.possibleMatches}</h2>
                <Text type="secondary">
                    {AppConstants.possibleMatchesDescription}
                </Text>
                <div className="table-responsive home-dash-table-view mt-3">
                    <Table
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                        className="home-dashboard-table"
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between mt-4">
                    <Button onClick={onCancel}>{AppConstants.cancel}</Button>
                    <Button type="primary" onClick={addChildOrParent}>{AppConstants.next}</Button>
                </div>
            </div>
        );
    };

    onSaveClick = (e) => {
        try {
            e.preventDefault();

            this.props.form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    message.error(AppConstants.pleaseReview)
                }
                if (!err) {
                    if (this.confirmOpend) return;

                    this.confirmOpend = true;

                    const { saveAction } = this;
                    if (this.state.isSameEmail || this.state.userData.email === this.props.history.location.state.userData.email) {
                        let electionMsg = '';
                        if (this.state.titleLabel === AppConstants.addChild) {
                            electionMsg = AppConstants.childMsg2Parent;
                        } else if (this.state.titleLabel === AppConstants.addParent_guardian) {
                            electionMsg = AppConstants.parentMsg2Child;
                        }
                        if (electionMsg !== '') {
                            confirm({
                                content: electionMsg,
                                okText: 'Continue',
                                okType: 'primary',
                                cancelText: 'Cancel',
                                onOk: () => {
                                    saveAction();
                                    this.confirmOpend = false;
                                },
                                onCancel: () => {
                                    this.confirmOpend = false;
                                },
                            });
                        } else {
                            saveAction();
                            this.confirmOpend = false;
                        }
                    } else {
                        saveAction();
                        this.confirmOpend = false;
                    }
                }
            });
        } catch (ex) {
            console.log("Exception occurred in saveRegistrationForm" + ex);
        }
    };

    // global save action
    saveAction = async () => {
        let userState = this.props.userState;
        let data = this.state.userData;
        const { storedEmailAddress } = this.state;

        if (!this.state.isSameEmail && data.mobileNumber != null && data.mobileNumber.length < 10) {
            message.error(AppConstants.pleaseReview);
            return false;
        }

        if (this.state.displaySection === 3 && data.emergencyContactNumber != null && data.emergencyContactNumber.length < 10) {
            message.error(AppConstants.pleaseReview);
            return false;
        }

        data["section"] = this.state.section;
        data["organisationId"] = this.state.organisationId;
        // add child / add parent functions (?)
        if (this.state.displaySection == 8 && !data.parentUserId) {
            data["parentUserId"] = 0;
        } else if (this.state.displaySection == 7 && !data.childUserId) {
            data["childUserId"] = 0;
        }

        if (this.state.titleLabel === AppConstants.addChild || this.state.titleLabel === AppConstants.edit + ' ' + AppConstants.child ) {
            if (this.state.isSameEmail) {
                data["email"] = this.props.userState.personalData.email + '.' + data.firstName;
            }
        }

        if (this.state.titleLabel === AppConstants.addChild || this.state.titleLabel === AppConstants.addParent_guardian) {
            const { status, result: { data: possibleMatches } } = await UserAxiosApi.findPossibleMerge(data);
            if ([1, 4].includes(status)) {
                this.setState({ isPossibleMatchShow: true, possibleMatches });
            }
        } else {
            if (this.state.displaySection === "1") {
                data['emailUpdated'] = storedEmailAddress === data.email ? 0 : 1;
                this.props.userProfileUpdateAction(data);
            } else {
                this.props.userProfileUpdateAction(data);
            }
            this.setState({ saveLoad: true });
        }
    };

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to={{ pathname: `/userPersonal`, state: { tabKey: this.state.tabKey, userId: this.state.userData.userId } }}>
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Form.Item>
                                    <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                        {AppConstants.save}
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.user}
                    menuName={AppConstants.user}
                    onMenuHeadingClick={() => history.push("./userTextualDashboard")}
                />
                <Layout>
                    {!this.state.isPossibleMatchShow ? (
                        <>
                            {this.headerView()}
                            <Form
                                onSubmit={this.onSaveClick}
                                noValidate="noValidate"
                                ref={this.formRef}
                            >
                                <Content>
                                    <div className="formView">{this.contentView(getFieldDecorator)}</div>
                                    <Loader visible={this.props.userState.onUpUpdateLoad || this.props.commonReducerState.onLoad || this.state.isAdding} />
                                </Content>

                                <Footer>{this.footerView()}</Footer>
                            </Form>
                        </>
                    ) : (
                        this.possibleMatchesDetailView(this.state.possibleMatches)
                    )}
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        userProfileUpdateAction,
        getCommonRefData,
        countryReferenceAction,
        nationalityReferenceAction,
        genderReferenceAction,
        disabilityReferenceAction,
        combinedAccreditationUmpieCoachRefrence,
        getUserParentDataAction,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        userState: state.UserState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserProfileEdit));


