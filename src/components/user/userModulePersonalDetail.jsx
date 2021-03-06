import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Pagination, Button, Menu, Dropdown, Checkbox, Icon, Modal, Spin, message } from 'antd';

import './user.css';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { setOrganisationData } from "../../util/sessionStorage";
import {
    getUserModulePersonalDetailsAction,
    getUserModulePersonalByCompetitionAction, getUserModuleRegistrationAction,
    getUserModuleMedicalInfoAction, getUserModuleActivityPlayerAction,
    getUserModuleActivityParentAction, getUserModuleActivityScorerAction,
    getUserModuleActivityManagerAction, getUserHistoryAction, getUserRole, getScorerData, getUmpireActivityListAction,
    userPhotoUpdateAction,
    registrationResendEmailAction,
    userProfileUpdateAction,
    getUserModuleTeamMembersAction,
    teamMemberUpdateAction,
    getUserOrganisationAction,
    cancelDeRegistrationAction,
    liveScorePlayersToPayRetryPaymentAction,
    registrationRetryPaymentAction,
    getUserPurchasesAction
} from "../../store/actions/userAction/userAction";
import { getReferenceOrderStatus } from "../../store/actions/shopAction/orderStatusAction";
import { clearRegistrationDataAction } from
    '../../store/actions/registrationAction/endUserRegistrationAction';
import { getOnlyYearListAction, } from '../../store/actions/appAction'
import {
    getUserId,
    setUserId,
    getTempUserId,
    setTempUserId,
    getOrganisationData,
    getStripeAccountId,
    getStripeAccountConnectId,
    setOrganistaionId,
    setCompetitionID,
    setSourceSystemFlag,
    setAuthToken,
    getAuthToken,
    setIsUserRegistration
} from "../../util/sessionStorage";
import { getAge, isArrayNotEmpty } from "../../util/helpers";
import moment from 'moment';
import history from '../../util/history'
import { liveScore_formateDate, getTime } from '../../themes/dateformate';
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';
import TableWithScrollArrows from '../../customComponents/tableWithScrollArrows';
import StripeKeys from "../stripe/stripeKeys";
import { saveStripeAccountAction, getStripeLoginLinkAction } from '../../store/actions/stripeAction/stripeAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;
let section = null;

function umpireActivityTableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    const payload = {
        "paging": {
            "limit": 10,
            "offset": this_Obj.state.umpireActivityOffset
        }
    }
    this_Obj.setState({ UmpireActivityListSortBy: sortBy, UmpireActivityListSortOrder: sortOrder });

    this_Obj.props.getUmpireActivityListAction(payload, JSON.stringify([15]), this_Obj.state.userId, sortBy, sortOrder);
}

const columns = [
    {
        title: "",
        dataIndex: "regData",
        key: "regData",
        render: (regData, record, index) => {
            const { expiryDate, competitionName, affiliate, membershipType, paymentStatus } = record;
            return (
                <div>
                    <div className="d-flex flex-wrap" style={{ marginBottom: 19 }}>
                        <span className='year-select-heading mr-3'>{AppConstants.validUntil}</span>
                        <span className="user-details-info-text">
                            {expiryDate != null ? (expiryDate !== 'Single Use' && expiryDate !== 'Single Game' && expiryDate !== 'Pay each Match' ? moment(expiryDate).format("DD/MM/YYYY") : expiryDate) : moment(record.competitionEndDate).format("DD/MM/YYYY")}
                        </span>
                    </div>
                    <div className="d-flex flex-wrap">
                        {/* TODO logo is not in the existing backend data now but in the design */}
                        {/* <div className="circular--landscape" style={{ marginRight: 17, minWidth: 64 }}>
                            {
                                logo ?
                                    <img src={logo} alt="" />
                                    :
                                    <span className="user-heading p-0" style={{ fontSize: 10 }} >{AppConstants.noImage}</span>

                            }
                        </div> */}
                        <div
                        // style={{ marginTop: 13 }}
                        >
                            <div className="form-heading p-0">{affiliate}</div>
                            <div style={{ textAlign: "start" }}>{competitionName}</div>
                            <div className="d-flex flex-wrap align-items-center">
                                {/* TODO add dates when backend is ready */}
                                {/* <div className="d-flex align-items-center py-3" style={{ marginRight: 42 }}>
                                    <img className="icon-size-25" style={{ marginRight: "5px" }} src={AppImages.calendarGrey} />
                                    <div>01/01/1970 - 01/01/1970</div>
                                </div> */}
                                <div className="d-flex align-items-center py-3">
                                    <span>{membershipType}</span>
                                    <div className="status-indicator">{paymentStatus}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {membershipType === "Umpire" && typeof(getStripeAccountConnectId()) !== 'undefined' && getStripeAccountConnectId().length === 0 && (
                        <div className="d-flex flex-row">
                            <img src={AppImages.ringing} alt="" width="22" height="22" />
                            <InputWithHead required="pt-0 pl-3" heading={AppConstants.umpireAvailabilityMessage} />
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        title: "Action",
        dataIndex: "regForm",
        key: "regForm",
        width: 52,
        render: (regForm, e) => {
            let compEndDate = moment(e.competitionEndDate).format("DD/MM/YYYY");
            let currentDate = moment().format("DD/MM/YYYY");
            return (
                ((e.expiryDate === "Single Game" && compEndDate >= currentDate) ||
                    (e.alreadyDeRegistered == 0 && e.paymentStatusFlag == 1) ||
                    e.paymentStatus == "Pending De-registration" ||
                    e.paymentStatus == "Pending Transfer" ||
                    e.paymentStatus == "Failed Registration") && (
                    <Menu
                        className="action-triple-dot-submenu"
                        theme="light"
                        mode="horizontal"
                        style={{ lineHeight: "8px" }}
                    >
                        <SubMenu
                        key="sub1"
                        title={
                            <img
                            className="dot-image"
                            src={AppImages.moreTripleDotActive}
                            alt=""
                            width="16"
                            height="16"
                            />
                        }
                        >
                        {e.expiryDate === "Single Game" && compEndDate >= currentDate && (
                            <Menu.Item key="2" onClick={() => this_Obj.goToSigleGamePayment(e)}>
                            <span>Purchase Single Game(s)</span>
                            </Menu.Item>
                        )}
                        {e.alreadyDeRegistered == 0 && e.paymentStatus != "Failed Registration" && (
                            <Menu.Item
                            key="3"
                            onClick={() =>
                                history.push("/deregistration", {
                                regData: e,
                                personal: this_Obj.props.userState.personalData,
                                sourceFrom: AppConstants.ownRegistration
                                })
                            }
                            >
                            <span>{AppConstants.registrationChange}</span>
                            </Menu.Item>
                        )}
                        {(e.paymentStatus == "Pending De-registration" ||
                            e.paymentStatus == "Pending Transfer") && (
                            <Menu.Item
                            key="4"
                            onClick={() => this_Obj.cancelDeRegistrtaion(e.deRegisterId)}
                            >
                            <span>
                                {e.paymentStatus == "Pending De-registration"
                                ? AppConstants.cancelDeRegistrtaion
                                : AppConstants.cancelTransferReg}
                            </span>
                            </Menu.Item>
                        )}
                        { e.paymentStatusFlag == 2 ? (
                            <Menu.Item key="6" onClick={() => this_Obj.setFailedRegistrationRetry(e)}>
                                <span>{AppConstants.retryPayment}</span>
                            </Menu.Item>
                        )
                        :
                        e.paymentStatus == "Failed Registration" && (
                            <Menu.Item key="5" onClick={() => this_Obj.setFailedInstalmentRetry(e)}>
                                <span>{AppConstants.retryPayment}</span>
                            </Menu.Item>
                        )

                        }
                        {/* {e.teamId &&
                            <Menu.Item key="3" onClick={() => this_Obj.props.registrationResendEmailAction(e.teamId)}>
                                <span>Resend Email</span>
                            </Menu.Item>
                        } */}
                        </SubMenu>
                    </Menu>
                )
            )
        }
    }
];

const teamRegistrationColumns = [{
    title: "",
    dataIndex: "regData",
    key: "regData",
    render: (regData, record, index) => {
        const { registeredBy, competitionName, teamName, productName, status, organisationName } = record;
        return (
            <div>
                <div className="d-flex flex-wrap" style={{ marginBottom: 19 }}>
                    <span className='year-select-heading mr-3'>{AppConstants.registeredBy}</span>
                    <span className="user-details-info-text">{registeredBy} </span>
                </div>
                <div className="d-flex flex-wrap">
                    <div>
                        <div className="form-heading p-0">{teamName}</div>
                        <div style={{ textAlign: "start" }}>{competitionName}</div>
                        <div className="d-flex flex-wrap align-items-center">
                            <div className="d-flex align-items-center py-3">
                                <span>{productName}</span>
                                <div className="status-indicator">{status}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
},
{
    title: 'Action',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (data, record) => {
        return(
            <div>
                {record.status == "Registered" ?
                    <Menu
                        className="action-triple-dot-submenu" theme="light" mode="horizontal"
                        style={{ lineHeight: "25px" }}>
                        <SubMenu
                            key="sub1"
                            title={<img className="dot-image" src={AppImages.moreTripleDotActive}
                                alt="" width="16" height="16" />}
                        >
                            <Menu.Item
                            key="1"
                            onClick={() =>this_Obj.showTeamMembers(record, 0)}
                            >
                            <span>{AppConstants.view}</span>
                            </Menu.Item>
                            <Menu.Item
                            key="2"
                            onClick={() =>
                                history.push("/deregistration", {
                                regData: record,
                                personal: this_Obj.props.userState.personalData,
                                sourceFrom: AppConstants.teamRegistration
                                })
                            }
                            >
                            <span>{AppConstants.registrationChange}</span>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                    :
                    null
                }
            </div>
        )
    }
}
];

const teamMembersColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
    },
    {
        title: "Paid Fee",
        dataIndex: "paidFee",
        key: "paidFee",
        render: r => new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2
        }).format(r)
    },
    {
        title: "Pending Fee",
        dataIndex: "pendingFee",
        key: "pendingFee",
        render: r => new Intl.NumberFormat('en-AU', {
            style: 'currency', currency: 'AUD', minimumFractionDigits: 2
        }
        ).format(r)
    },
    {
        title: "Action",
        key: "action",
        dataIndex: "isActive",
        render: (data, record) => {
            return(
                <div>
                    {record.actionFlag == 1 &&
                        <Menu
                            className="action-triple-dot-submenu"
                            theme="light"
                            mode="horizontal"
                            style={{ lineHeight: "25px" }}
                        >
                            <SubMenu
                                key="sub1"
                                title={(
                                    <img
                                        className="dot-image"
                                        src={AppImages.moreTripleDot}
                                        alt=""
                                        width="16"
                                        height="16"
                                    />
                                )}
                            >
                                {record.isRemove == 1 &
                                    <Menu.Item key="1">
                                        <span onClick={() => this_Obj.removeTeamMember(record)}>{record.isActive ? AppConstants.removeFromTeam : AppConstants.addToTeam}</span>
                                    </Menu.Item>
                                }
                                {record.paymentStatus != "Pending De-registration" ?
                                    <Menu.Item
                                        key="2"
                                        onClick={() =>
                                            history.push("/deregistration", {
                                            regData: record,
                                            personal: this_Obj.props.userState.personalData,
                                            sourceFrom: AppConstants.teamMembers
                                            })
                                        }
                                    >
                                        <span>{AppConstants.registrationChange}</span>
                                    </Menu.Item>
                                    :
                                    <Menu.Item
                                        key="3"
                                        onClick={() => this_Obj.cancelTeamMemberDeRegistrtaion(record.deRegisterId)}
                                    >
                                        <span>{AppConstants.cancelDeRegistrtaion}</span>
                                    </Menu.Item>
                                }
                            </SubMenu>
                        </Menu>
                    }
                </div>
            )
        },
    },
]

const childOrOtherRegistrationColumns = [{
    title: "",
    dataIndex: "regData",
    key: "regData",
    render: (regData, record, index) => {
        const { dateOfBirth, name, email, feePaid } = record;
        return (
            <div>
                <div className="d-flex flex-wrap" style={{ marginBottom: 19 }}>
                    <span className='year-select-heading mr-3'>{AppConstants.dateOfBirth}</span>
                    <span className="user-details-info-text">{moment(dateOfBirth).format("DD/MM/YYYY")}</span>
                </div>
                <div className="d-flex flex-wrap">
                    <div>
                        <div className="form-heading p-0">{name}</div>
                        <div style={{ textAlign: "start" }}>{email}</div>
                        <div className="d-flex flex-wrap align-items-center">
                            <div className="d-flex align-items-center py-3">
                                <span>{AppConstants.feePaid}</span>
                                <div className="status-indicator">{feePaid}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
},
{
        title: "Action",
        dataIndex: "regForm",
        key: "regForm",
        width: 52,
        render: (action, record) => {
        return(
            <div>
                {(record.invoiceFailedStatus == 1 || record.transactionFailedStatus == 2) ?
                    <Menu
                        className="action-triple-dot-submenu"
                        theme="light"
                        mode="horizontal"
                        style={{ lineHeight: "25px" }}
                    >
                        <SubMenu
                            key="sub1"
                            title={(
                                <img
                                    className="dot-image"
                                    src={AppImages.moreTripleDot}
                                    alt=""
                                    width="16"
                                    height="16"
                                />
                            )}
                        >
                            {record.invoiceFailedStatus == 1 ?
                                <Menu.Item key="1">
                                    <span onClick={() => this_Obj.setFailedRegistrationRetry(record)}>{AppConstants.retryPayment}</span>
                                </Menu.Item>
                                :
                                record.transactionFailedStatus == 1 &&
                                <Menu.Item key="2">
                                    <span onClick={() => this_Obj.setFailedInstalmentRetry(record)}>{AppConstants.retryPayment}</span>
                                </Menu.Item>
                            }
                        </SubMenu>
                    </Menu>
                : <div></div>}
            </div>
            )
        }
}
];

const columnsPlayer = [
    {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: 'Date',
        dataIndex: 'stateDate',
        key: 'stateDate',
        sorter: (a, b) => a.stateDate.localeCompare(b.stateDate),
        render: (stateDate, record, index) => {
            return (
                <div>
                    {stateDate != null ? moment(stateDate).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Home',
        dataIndex: 'home',
        key: 'home',
        sorter: (a, b) => a.home.localeCompare(b.home),
    },
    {
        title: 'Away',
        dataIndex: 'away',
        key: 'away',
        sorter: (a, b) => a.away.localeCompare(b.away),
    },
    {
        title: 'Result',
        dataIndex: 'teamScore',
        key: 'teamScore',
        sorter: (a, b) => a.teamScore.localeCompare(b.teamScore),
    },
    {
        title: 'Game time',
        dataIndex: 'gameTime',
        key: 'gameTime',
        sorter: (a, b) => a.gameTime.localeCompare(b.gameTime),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsParent = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
        title: 'DOB',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        sorter: (a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth),
        render: (dateOfBirth, record, index) => {
            return (
                <div>
                    {dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
        title: 'Div',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsScorer = [
    {
        title: 'Start',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => {
            return (
                <div>
                    {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => a.teamName.localeCompare(b.teamName),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsManager = [
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: 'Date',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => {
            return (
                <div>
                    {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Home',
        dataIndex: 'home',
        key: 'home',
        sorter: (a, b) => a.home.localeCompare(b.home),
    },
    {
        title: 'Away',
        dataIndex: 'away',
        key: 'away',
        sorter: (a, b) => a.away.localeCompare(b.away),
    },
    {
        title: 'Results',
        dataIndex: 'teamScore',
        key: 'teamScore',
        sorter: (a, b) => a.teamScore.localeCompare(b.teamScore),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsPersonalAddress = [
    {
        title: 'Street',
        dataIndex: 'street',
        key: 'street'
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    },
    {
        title: 'Postcode',
        dataIndex: 'postalCode',
        key: 'postalCode'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Action',
        dataIndex: 'isUsed',
        key: 'isUsed',
        width: 80,
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu" theme="light" mode="horizontal"
                style={{ lineHeight: "25px" }}>
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image" src={AppImages.moreTripleDotActive}
                        alt="" width="16" height="16" />}
                >
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/userProfileEdit`, state: { userData: record, moduleFrom: "1" } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

const columnsPersonalPrimaryContacts = [
    {
        title: 'Name',
        dataIndex: 'parentName',
        key: 'parentName',
        render: (parentName, record) => (
            <div>
                {record.status === "Linked" ?
                    <span className="input-heading-add-another pt-0 pointer" onClick={() => this_Obj.loadAnotherUser(record.parentUserId)}>
                        {parentName}</span>
                    :
                    <span>{parentName}</span>
                }
            </div>
        )
    },
    {
        title: 'Street',
        dataIndex: 'street',
        key: 'street'
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    },
    {
        title: 'Postcode',
        dataIndex: 'postalCode',
        key: 'postalCode'
    },
    {
        title: 'Phone Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Action',
        dataIndex: 'isUser',
        key: 'isUser',
        width: 80,
        render: (data, record) => (
            <Menu className="action-triple-dot-submenu" theme="light" mode="horizontal" style={{ lineHeight: "25px" }}>
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image" src={AppImages.moreTripleDotActive}
                        alt="" width="16" height="16" />
                    }>
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/userProfileEdit`, state: { userData: record, moduleFrom: "2" } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <span onClick={() => this_Obj.unlinkCheckParent(record)}>{record.status === "Linked" ? "Unlink" : "Link"}</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

const columnsPersonalChildContacts = [
    {
        title: 'Name',
        dataIndex: 'childName',
        key: 'childName',
        render: (childName, record) => (
            <div>
                {record.status === "Linked" ?
                    <span className="input-heading-add-another pt-0 pointer" onClick={() => this_Obj.loadAnotherUser(record.childUserId)}>
                        {childName}</span>
                    :
                    <span>{childName}</span>
                }
            </div>
        )
    },
    {
        title: 'Street',
        dataIndex: 'street',
        key: 'street'
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    },
    {
        title: 'Postcode',
        dataIndex: 'postalCode',
        key: 'postalCode'
    },
    {
        title: 'Phone Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: 'Action',
        dataIndex: 'isUser',
        key: 'isUser',
        width: 80,
        render: (data, record) => (
            <Menu className="action-triple-dot-submenu" theme="light" mode="horizontal" style={{ lineHeight: "25px" }}>
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image" src={AppImages.moreTripleDotActive}
                        alt="" width="16" height="16" />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/userProfileEdit`, state: { userData: record, moduleFrom: "6" } }}>
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <span onClick={() => this_Obj.unlinkCheckChild(record)}>{record.status === "Linked" ? "Unlink" : "Link"}</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

const columnsPersonalEmergency = [
    {
        title: 'First Name',
        dataIndex: 'emergencyFirstName',
        key: 'emergencyFirstName',
    },
    {
        title: 'Last Name',
        dataIndex: 'emergencyLastName',
        key: 'emergencyLastName',
    },
    {
        title: 'Phone Number',
        dataIndex: 'emergencyContactNumber',
        key: 'emergencyContactNumber'
    },
    {
        title: 'Action',
        dataIndex: 'isUser',
        key: 'isUser',
        width: 80,
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu" theme="light"
                mode="horizontal" style={{ lineHeight: "25px" }}>
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image"
                        src={AppImages.moreTripleDotActive} alt="" width="16" height="16" />
                    }>
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/userProfileEdit`, state: { userData: record, moduleFrom: "3" } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

const columnsFriends = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Phone Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
    },
];

const columnsPlayedBefore = [
    {
        title: 'Played Before',
        dataIndex: 'playedBefore',
        key: 'playedBefore'
    },
    {
        title: 'Played Club',
        dataIndex: 'playedClub',
        key: 'playedClub',
    },
    {
        title: 'Played Grade',
        dataIndex: 'playedGrade',
        key: 'playedGrade',
    },
    {
        title: 'Played Year',
        dataIndex: 'playedYear',
        key: 'playedYear',
    },
    {
        title: 'Last Captain',
        dataIndex: 'lastCaptainName',
        key: 'lastCaptainName',
    },
];

const columnsFav = [
    {
        title: 'Favourite Netball Team',
        dataIndex: 'favouriteTeam',
        key: 'favouriteTeam'
    },
    {
        title: 'Who is your favourite Firebird?',
        dataIndex: 'favouriteFireBird',
        key: 'favouriteFireBird',
    }
];

const columnsVol = [
    {
        title: 'Volunteers',
        dataIndex: 'description',
        key: 'description'
    }
];

const columnsMedical = [
    {
        title: 'Disability Type',
        dataIndex: 'disabilityType',
        key: 'disabilityType'
    },
    {
        title: 'Disability Care Number',
        dataIndex: 'disabilityCareNumber',
        key: 'disabilityCareNumber'
    }
];

const columnsHistory = [
    // {
    //     title: 'Competition Name',
    //     dataIndex: 'competitionName',
    //     key: 'competitionName'
    // },
    // {
    //     title: 'Team Name',
    //     dataIndex: 'teamName',
    //     key: 'teamName'
    // },
    {
        title: 'Division Grade',
        dataIndex: 'divisionGrade',
        key: 'divisionGrade'
    },
    {
        title: 'Ladder Position',
        dataIndex: 'ladderResult',
        key: 'ladderResult'
    }
];

function purchasesTableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.purchasesListSortBy !== key) {
        sortOrder = 'asc';
    } else if (this_Obj.state.purchasesListSortBy === key && this_Obj.state.purchasesListSortOrder === 'asc') {
        sortOrder = 'desc';
    } else if (this_Obj.state.purchasesListSortBy === key && this_Obj.state.purchasesListSortOrder === 'desc') {
        sortBy = sortOrder = null;
    }
    const params = {
        limit: 10,
        offset: this_Obj.state.purchasesOffset,
        order: sortOrder || "",
        sorterBy: sortBy || "",
        userId: this_Obj.state.userId,
    };
    this_Obj.props.getUserPurchasesAction(params);
    this_Obj.setState({ purchasesListSortBy: sortBy, purchasesListSortOrder: sortOrder });
}

// listeners for sorting
const purchaseListeners = (key) => ({
    onClick: () => purchasesTableSort(key),
});

const purchasesColumn = [
    {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners("id"),
        render: (orderId) => (
            <span className="desc-text-style pt-0">{orderId}</span>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners("createdOn"),
        render: (date) => <span>{date ? liveScore_formateDate(date) : ""}</span>,
    },
    {
        title: 'Products',
        dataIndex: 'orderDetails',
        key: 'orderDetails',
        // sorter: true,
        // onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
        render: (orderDetails) => (
            <div>
                {orderDetails.length > 0 && orderDetails.map((item, i) => (
                    <span key={`orderDetails${i}`} className="desc-text-style side-bar-profile-data">{item}</span>
                ))}
            </div>
        ),
    },
    {
        title: 'Organisation',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners("organisationId"),
    },
    {
        title: 'Payment Status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
        render: (paymentStatus) => (
            <span>{this_Obj.getOrderStatus(paymentStatus, "ShopPaymentStatus")}</span>
        ),
    },
    {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
    },
    {
        title: 'Fulfillment Status',
        dataIndex: 'fulfilmentStatus',
        key: 'fulfilmentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => purchaseListeners(dataIndex),
        render: (fulfilmentStatus) => (
            <span>{this_Obj.getOrderStatus(fulfilmentStatus, "ShopFulfilmentStatusArr")}</span>
        ),
    },
    {
        title: "Action",
        key: "action",
        render: (data, record) => (
            <div>
                <Menu
                    className="action-triple-dot-submenu"
                    theme="light"
                    mode="horizontal"
                    style={{ lineHeight: "25px" }}
                >
                    <SubMenu
                        key="sub1"
                        title={(
                            <img
                                className="dot-image"
                                src={AppImages.moreTripleDot}
                                alt=""
                                width="16"
                                height="16"
                            />
                        )}
                    >
                        <Menu.Item key="1">
                            <span onClick={() => history.push("/invoice", {
                                shopUniqueKey: record.shopUniqueKey,
                                invoiceId: record.invoiceId,
                                savedInvoice: true,
                            })}>{AppConstants.invoice}</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    },
];

const menu = (
    <Menu>
        <Menu.Item>
            {AppConstants.transfer}
        </Menu.Item>
        <Menu.Item>
            {AppConstants.deRegistration}
        </Menu.Item>
    </Menu>
);

//listeners for sorting
const listeners = (key) => ({
    onClick: () => umpireActivityTableSort(key),
});

const umpireActivityColumn = [
    {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (date, record) => <span>{record?.match?.startTime ? liveScore_formateDate(record.match.startTime) : ""}</span>
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        // sorter: true,
        render: (time, record) => <span>{record?.match?.startTime ? getTime(record.match.startTime) : ""}</span>
    },
    {
        title: 'Competition',
        dataIndex: 'competition',
        key: 'competition',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (date, record) => <span>{record?.match?.competition ? record.match.competition.longName : ""}</span>
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (affiliate, record) => {
            let organisationArray = record.user.userRoleEntities.length > 0 && this_Obj.getOrganisationArray(record.user.userRoleEntities, record.roleId)
            return (
                <div>
                    {organisationArray.length > 0 && organisationArray.map((item, index) => {
                        return (
                            <span key={`organisationName` + index} className='multi-column-text-aligned'>{

                                item.competitionOrganisation && item.competitionOrganisation.name}</span>
                        )
                    })
                    }
                </div>)
        },
    },
    {
        title: 'Home',
        dataIndex: 'home',
        key: 'home',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (home, record) => <span>{record?.match?.team1 ? record.match.team1.name : ""}</span>
    },
    {
        title: 'Away',
        dataIndex: 'away',
        key: 'away',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (away, record) => <span>{record?.match?.team2 ? record.match.team2.name : ""}</span>
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        // sorter: true,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (amount, record) => <span>{"N/A"}</span>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        // sorter: true,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (status, record) => <span>{"N/A"}</span>
    },
]
const umpireActivityData = []

class UserModulePersonalDetail extends Component {
    constructor(props) {
        super(props);
        this_Obj = this;
        this.state = {
            userId: getUserId(),
            tabKey: "1",
            competition: null,
            loading: false,
            registrationForm: null,
            isRegistrationForm: false,
            yearRefId: -1,
            competitions: [],
            teams: [],
            divisions: [],
            tempUserId: getTempUserId(),
            umpireActivityOffset: 0,
            UmpireActivityListSortBy: null,
            UmpireActivityListSortOrder: null,
            stripeDashBoardLoad: false,
            isTablet: false,
            isCollapsedUserDetails: true,
            unlinkOnLoad: false,
            unlinkRecord: null,
            showChildUnlinkConfirmPopup: false,
            showParentUnlinkConfirmPopup: false,
            showCannotUnlinkPopup: false,
            isPersonDetailsTabVisited: false,
            isUserLoading: false,
            myRegCurrentPage: 1,
            otherRegCurrentPage: 1,
            childRegCurrentPage: 1,
            teamRegCurrentPage: 1,
            isShowRegistrationTeamMembers: false,
            registrationTeam: null,
            removeTeamMemberLoad: false,
            showRemoveTeamMemberConfirmPopup: false,
            removeTeamMemberRecord: null,
            selectedRow: null,
            otherModalVisible: false,
            modalTitle: null,
            modalMessage: null,
            actionView: 0,
            purchasesOffset: 0,
            purchasesListSortBy: null,
            purchasesListSortOrder: null,
        }
    }

    componentWillMount() {
        let competition = this.getEmptyCompObj();
        this.setState({ competition: competition });
    }

    async componentDidMount() {
        let user_Id = this.state.userId;
        await this.props.getUserOrganisationAction();
        const organisationData = this.props.userState.getUserOrganisation;
        this.props.getReferenceOrderStatus();
        if (organisationData.length > 0) {
            await setOrganisationData(organisationData[0]);
        }

        if (this.state.tempUserId != undefined && this.state.tempUserId != null) {
            user_Id = this.state.tempUserId;
            this.setState({ userId: user_Id });
        }

        if (this.props.location.state != null && this.props.location.state != undefined) {
            let tabKey = this.props.location.state.tabKey != undefined ? this.props.location.state.tabKey : '1';
            await this.setState({ tabKey: tabKey });
        }
        let urlSplit = this.props.location.search.split("?code=")
        let stripeConnected = getStripeAccountConnectId()
        if (stripeConnected) {
            console.log("stripe connected")
        } else if (urlSplit[1]) {
            let codeSplit = urlSplit[1].split("&state=")
            let code = codeSplit[0]

            this.props.saveStripeAccountAction(code, Number(user_Id))
        }

        // alert("componentDidMount");
        if (this.props.location && this.props.location.search) {
            const query = this.queryfie(this.props.location.search);
            let token = query.token;
            let userId = query.userId;
            let selectedTab = query.tab;
            if (userId != undefined && token != undefined) {
                await setUserId(userId);
                await setAuthToken(token);
            } else {
                let authToken = await getAuthToken();
                let userIdFromStorage = await getUserId();
                if (userIdFromStorage != undefined && authToken != undefined &&
                    userIdFromStorage != null && authToken != null &&
                    userIdFromStorage != "" && authToken != "" &&
                    userIdFromStorage != 0) {
                    userId = userIdFromStorage;
                    token = authToken;
                }
            }

            if (userId != undefined && token != undefined &&
                userId != null && token != null &&
                userId != "" && token != "" &&
                userId != 0) {
                if (selectedTab) {
                    await setIsUserRegistration(1);
                    history.push({ pathname: "/userpersonal", state: { tabKey: "5" } })
                    this.apiCalls(userId);
                } else {
                    await setIsUserRegistration(1);
                    history.push("/userpersonal")
                    this.apiCalls(userId);
                }
            } else {
                await setIsUserRegistration(1);
                history.push({ pathname: "/login", state: { isUserRegistration: 1 } });
            }
        } else {
            this.props.getOnlyYearListAction();
            this.apiCalls(user_Id);
        }

        this.checkWidth();
        window.addEventListener('resize', this.checkWidth);
        const { tabKey, competition, userId, yearRefId } = this.state;
        this.tabApiCalls(tabKey, competition, userId, yearRefId);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkWidth);
    }

    checkWidth = () => {
        const matchMedia = window.matchMedia(`(max-width: 767px)`);

        if (this.state.isTablet !== matchMedia.matches) {
            this.setState({
                isTablet: matchMedia.matches,
            });
        }
    };

    queryfie(string) {
        return string
            .slice(1)
            .split('&')
            .map(q => q.split('='))
            .reduce((a, c) => { a[c[0]] = c[1]; return a; }, {});
    }

    getOrderStatus = (value, state) => {
        let statusValue = '';
        const statusArr = this.props.shopProductState[state];
        const getIndexValue = statusArr.findIndex((x) => x.id == value);
        if (getIndexValue > -1) {
            statusValue = statusArr[getIndexValue].description;
            return statusValue;
        }
        return statusValue;
    }

    componentDidUpdate(nextProps) {
        let userState = this.props.userState;
        let personal = userState.personalData;
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
        }

        if ((this.state.competition.competitionUniqueKey == null || this.state.competition.competitionUniqueKey == '-1'
        ) && personal.competitions != undefined &&
            personal.competitions.length > 0
            && this.props.userState.personalData != nextProps.userState.personalData) {
            // let years = [];
            // let competitions = [];
            // (personal.competitions || []).map((item, index) => {
            //     let obj = {
            //         id: item.yearRefId
            //     }
            //     years.push(obj);
            // });
            let yearRefId = -1;
            this.setState({ yearRefId: -1 });
            if (personal.competitions != null && personal.competitions.length > 0 && yearRefId != null) {
                let competitions = personal.competitions;
                this.generateCompInfo(competitions, yearRefId);
                // this.setState({competitions: competitions, competition: this.getEmptyCompObj()});
                // this.tabApiCalls(this.state.tabKey, this.getEmptyCompObj(), this.state.userId);
            }
        }
        if (this.props.stripeState.onLoad === false && this.state.stripeDashBoardLoad === true) {
            this.setState({ stripeDashBoardLoad: false })
            let stripeDashboardUrl = this.props.stripeState.stripeLoginLink
            if (stripeDashboardUrl) {
                window.open(stripeDashboardUrl, '_newtab');
            }
        }

        if (this.props.userState.onUpUpdateLoad == false && this.state.unlinkOnLoad == true) {
            let personal = this.props.userState.personalData;
            let organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
            let payload = {
                userId: personal.userId,
                organisationId: organisationId
            };
            this.props.getUserModulePersonalByCompetitionAction(payload);
            this.setState({ unlinkOnLoad: false })
        }

        if (this.props.userState.personalData !== nextProps.userState.personalData) {
            this.setState({ isUserLoading: false });
        }

        // hack to define tables overflow to display scroll arrows,
        // without it re-render will lead to table overflow arrows absense

        const { tabKey, isPersonDetailsTabVisited } = this.state;

        if (!isPersonDetailsTabVisited && !userState.onPersonLoad && tabKey === "4") {
            this.setState({ isPersonDetailsTabVisited: true })
        }

        if (this.props.userState.onTeamUpdateLoad == false && this.state.removeTeamMemberLoad == true) {
            const record = this.state.registrationTeam;
            const page = 1;
            const payload = {
                userId: record.userId,
                teamId: record.teamId,
                teamMemberPaging: {
                    limit: 10,
                    offset: page ? 10 * (page - 1) : 0,
                },
            };
            this.props.getUserModuleTeamMembersAction(payload);
            this.setState({ removeTeamMemberLoad: false });
        }

        if(this.props.userState.cancelDeRegistrationLoad == false && this.state.cancelDeRegistrationLoad == true){
            this.handleRegistrationTableList(
                1,
                this.state.userId,
                this.state.competition,
                this.state.yearRefId,
                "myRegistrations"
                );
            this.setState({cancelDeRegistrationLoad: false})
        }

        if(this.props.userState.cancelDeRegistrationLoad == false && this.state.cancelTeamMemberDeRegistrationLoad == true){
            this.showTeamMembers(this.state.registrationTeam,1)
            this.setState({cancelTeamMemberDeRegistrationLoad: false})
        }

        if((this.props.userState.onLoad == false || this.props.userState.onRetryPaymentLoad == false) && this.state.loading == true){
            this.setState({loading: false});
            this.handleRegistrationTableList(
                1,
                this.state.userId,
                this.state.competition,
                this.state.yearRefId,
                "myRegistrations"
            );
        }

    }

    apiCalls = async (userId) => {
        let payload = {
            userId: userId,
            organisationId: null
        }

        this.setState({ isUserLoading: true });
        await this.props.getUserModulePersonalDetailsAction(payload);
        await this.props.getUserModulePersonalByCompetitionAction(payload)
        await this.props.getUserRole(userId)
    };

    cancelDeRegistrtaion = (deRegisterId) => {
        try{
            let payload = {
                deRegisterId: deRegisterId
            }
            this.props.cancelDeRegistrationAction(payload);
            this.setState({cancelDeRegistrationLoad: true})
        } catch(ex) {
            console.log("Error in cancelDeRegistrtaion::" +ex)
        }
    }

    cancelTeamMemberDeRegistrtaion = (deRegisterId) => {
        try{
            let payload = {
                deRegisterId: deRegisterId
            }
            this.props.cancelDeRegistrationAction(payload);
            this.setState({cancelTeamMemberDeRegistrationLoad: true})
        } catch(ex) {
            console.log("Error in cancelTeamMemberDeRegistrtaion::" +ex)
        }
    }

    goToSigleGamePayment = (record) => {
        const { personalData } = this.props.userState;

        let data = {
            "competitionMembershipProductTypeId": record.competitionMembershipProductTypeId,
            "membershipMappingId": record.membershipMappingId,
            "competitionMembershipProductDivisionId": record.competitionMembershipProductDivisionId,
            "email": personalData.email,
            "organisationId": record.organisationId,
            "competitionId": record.competitionId,
            "registrationId": record.registrationId
        }
        history.push({ pathname: '/singleGamePayment', state: { data: data } });
    }

    getOrganisationArray(data, roleId) {
        let orgArray = []
        if (data.length > 0) {
            for (let i in data) {
                if (data[i].roleId == roleId == 19 ? 15 : roleId) {
                    orgArray.push(data[i])
                    return orgArray
                }
            }
        }
        return orgArray
    }

    onChangeYear = (value) => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        let competitions = [];

        if (value != -1) {
            competitions = personal.competitions.filter(x => x.yearRefId === value);
        } else {
            competitions = personal.competitions;
        }

        this.generateCompInfo(competitions, value);
    }

    generateCompInfo = (competitions, yearRefId) => {
        let teams = [];
        let divisions = [];

        (competitions || []).map((item, index) => {
            if (item.teams != null && item.teams.length > 0) {
                (item.teams || []).map((i, ind) => {
                    let obj = {
                        teamId: i.teamId,
                        teamName: i.teamName
                    }
                    if (i.teamId != null)
                        teams.push(obj);
                })
            }

            if (item.divisions != null && item.divisions.length > 0) {
                (item.divisions || []).map((j, ind) => {
                    let div = {
                        divisionId: j.divisionId,
                        divisionName: j.divisionName
                    }
                    if (j.divisionId != null) {
                        divisions.push(div);
                    }
                })
            }
        });

        let competition = this.getEmptyCompObj();
        if (competitions != null && competitions.length > 0) {
            competition = this.getEmptyCompObj();
        }

        this.setState({
            competitions: competitions,
            competition: competition,
            yearRefId: yearRefId,
            teams: teams,
            divisions: divisions
        });

        this.tabApiCalls(this.state.tabKey, competition, this.state.userId, yearRefId);
    }

    getEmptyCompObj = () => {
        return {
            team: { teamId: 0, teamName: "" },
            divisionName: "",
            competitionUniqueKey: '-1',
            competitionName: "All",
            year: 0
        };
    }

    onChangeSetValue = (value) => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        if (value != -1) {
            let teams = [];
            let divisions = [];

            let competition = personal.competitions.find(x => x.competitionUniqueKey === value);

            if (competition.teams != null && competition.teams.length > 0) {
                (competition.teams || []).map((i, ind) => {
                    let obj = {
                        teamId: i.teamId,
                        teamName: i.teamName
                    }
                    if (i.teamId != null)
                        teams.push(obj);
                })
            }

            if (competition.divisions != null && competition.divisions.length > 0) {
                (competition.divisions || []).map((j, ind) => {
                    let div = {
                        divisionId: j.divisionId,
                        divisionName: j.divisionName
                    }
                    if (j.divisionId != null) {
                        divisions.push(div);
                    }
                })
            }

            this.setState({ competition: competition, divisions: divisions, teams: teams });
            this.tabApiCalls(this.state.tabKey, competition, this.state.userId, this.state.yearRefId);
        } else {
            this.generateCompInfo(personal.competitions, this.state.yearRefId);
        }
    }

    onChangeTab = e => {
        const tabNumber = e.key || e;

        this.setState({ tabKey: tabNumber, isRegistrationForm: false, isShowRegistrationTeamMembers: false });
        this.tabApiCalls(tabNumber, this.state.competition, this.state.userId, this.state.yearRefId);
    };

    tabApiCalls = (tabKey, competition, userId, yearRefId) => {
        let payload = {
            userId: userId,
            competitionId: competition.competitionUniqueKey,
            yearRefId: yearRefId
        }
        if (tabKey === "1") {
            this.handleRegistrationTableList(1, userId, competition, yearRefId);
        } else if (tabKey == "2") {
            this.handleActivityTableList(1, userId, competition, "player", yearRefId);
            // this.handleActivityTableList(1, userId, competition, "parent", yearRefId);
            this.handleActivityTableList(1, userId, competition, "scorer", yearRefId);
            this.handleActivityTableList(1, userId, competition, "manager", yearRefId);
        }
        if (tabKey === "4") {
            this.props.getUserModulePersonalByCompetitionAction(payload)
        } else if (tabKey === "5") {
            this.props.getUserModuleMedicalInfoAction(payload)
        } else if (tabKey === "6") {
            this.handleHistoryTableList(1, userId);

        } else if (tabKey === "7") {
            payload = {
                "paging": {
                    "limit": 10,
                    "offset": 0
                }
            }
            this.props.getUmpireActivityListAction(payload, JSON.stringify([15]), userId, this.state.UmpireActivityListSortBy, this.state.UmpireActivityListSortOrder);
        } else if (tabKey === "8") {
            this.handlePurchasesTableList(1, userId);
        }
    }

    handlePurchasesTableList = (page, userId) => {
        const params = {
            limit: 10,
            offset: (page ? (10 * (page - 1)) : 0),
            order: "",
            sorterBy: "",
            userId,
        };
        this.props.getUserPurchasesAction(params);
    }

    handleActivityTableList = (page, userId, competition, key, yearRefId) => {
        let filter = {
            competitionId: competition.competitionUniqueKey,
            organisationId: null,
            userId: userId,
            yearRefId: yearRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        if (key === "player")
            this.props.getUserModuleActivityPlayerAction(filter);
        if (key === "parent")
            this.props.getUserModuleActivityParentAction(filter);
        if (key === "scorer")
            // this.props.getUserModuleActivityScorerAction(filter);
            this.props.getScorerData(filter, 4, "ENDED");
        if (key === "manager")
            this.props.getUserModuleActivityManagerAction(filter);

    }

    showTeamMembers = (record, page) => {
        try {
            this.setState({ isShowRegistrationTeamMembers: true, registrationTeam: record })
            let payload = {
                userId: record.userId,
                teamId: record.teamId,
                teamMemberPaging: {
                    limit: 10,
                    offset: page ? 10 * (page - 1) : 0,
                }
            }
            this.props.getUserModuleTeamMembersAction(payload);
        } catch (ex) {
            console.log("Error in showTeamMember::" + ex);
        }
    }

    gotoAddTeamMembers = () => {
        const { registrationTeam } = this.state;
        history.push("/addTeamMember", { registrationTeam: registrationTeam })
    }

    handleRegistrationTableList = (page, userId, competition, yearRefId, key) => {
        if (key === 'myRegistrations') {
            this.setState({ myRegCurrentPage: page })
        } else if (key === 'otherRegistrations') {
            this.setState({ otherRegCurrentPage: page })
        } else if (key === 'teamRegistrations') {
            this.setState({ teamRegCurrentPage: page })
        } else if (key === 'childRegistrations') {
            this.setState({ childRegCurrentPage: page })
        }
        setTimeout(() => {
            let filter = {
                competitionId: competition.competitionUniqueKey,
                userId: userId,
                organisationId: null,
                yearRefId,
                myRegPaging: {
                    limit: 10,
                    offset: this.state.myRegCurrentPage ? 10 * (this.state.myRegCurrentPage - 1) : 0,
                },
                otherRegPaging: {
                    limit: 10,
                    offset: this.state.otherRegCurrentPage ? 10 * (this.state.otherRegCurrentPage - 1) : 0,
                },
                teamRegPaging: {
                    limit: 10,
                    offset: this.state.teamRegCurrentPage ? 10 * (this.state.teamRegCurrentPage - 1) : 0,
                },
                childRegPaging: {
                    limit: 10,
                    offset: this.state.childRegCurrentPage ? 10 * (this.state.childRegCurrentPage - 1) : 0,
                }
            };
            this.props.getUserModuleRegistrationAction(filter);
        }, 300);
    };

    ////pagination handling for umpire activity table list
    handleUmpireActivityTableList = (page, userId) => {
        let offset = page ? 10 * (page - 1) : 0
        this.setState({ umpireActivityOffset: offset })
        let payload = {
            "paging": {
                "limit": 10,
                "offset": offset,
            }
        }
        this.props.getUmpireActivityListAction(payload, JSON.stringify([15]), userId, this.state.UmpireActivityListSortBy, this.state.UmpireActivityListSortOrder);
    };

    navigateTo = (screen) => {
        this.props.clearRegistrationDataAction();
        history.push(screen)
    }

    loadAnotherUser = userId => {
        setTempUserId(userId);
        this.setState({ userId, isUserLoading: true });
        this.apiCalls(userId);
        // history.replace({ pathname: '/userPersonal' });
        // window.location.reload();
    }

    viewRegForm = async (item) => {
        await this.setState({ isRegistrationForm: true, registrationForm: item.registrationForm });
    }

    handleHistoryTableList = (page, userId) => {
        let filter = {
            userId: userId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getUserHistoryAction(filter)
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
        const userState = this.props.userState;
        const { userId } = userState.personalData;
        const { personalByCompData } = userState;

        const file = data.files[0];

        const isUserChild = !!personalByCompData.length && !!personalByCompData[0].childContacts.length ? false : true;

        if (file) {
            const formData = new FormData();
            formData.append("profile_photo", file);
            isUserChild ? this.props.userPhotoUpdateAction(formData, userId) : this.props.userPhotoUpdateAction(formData);
        }
    }

    setFailedInstalmentRetry = (record) =>{
        this.setState({
            selectedRow: record, otherModalVisible: true,
            actionView: 5, modalMessage : AppConstants.regRetryInstalmentModalMsg,
            modalTitle: "Failed Instalment Retry"
        });
    }
    setFailedRegistrationRetry = (record) =>{
        this.setState({
            selectedRow: record, otherModalVisible: true,
            actionView: 6, modalMessage : AppConstants.regRetryModalMsg,
            modalTitle: "Failed Registration Retry"
        });
    }

    handleOtherModal = (key) =>{
        const {selectedRow, actionView} = this.state;
        const personal = this.props.userState.personalData;
        if(actionView == 5){
            if(key == "ok"){
                let payload = {
                    processTypeName: "instalment",
                    registrationUniqueKey: selectedRow.registrationId,
                    userId: personal.userId,
                    divisionId: selectedRow.divisionId,
                    competitionId: selectedRow.competitionId
                }
                this.props.liveScorePlayersToPayRetryPaymentAction(payload);
                this.setState({ loading: true });
            }
        }
        else if(actionView == 6){
            const personal = this.props.userState.personalData;
            if(key == "ok"){
                let payload = {
                    registrationId: selectedRow.registrationId,
                }
                this.props.registrationRetryPaymentAction(payload);
                this.setState({ loading: true });
            }
        }
        this.setState({otherModalVisible: false});
    }

    otherModalView = () => {
        const { modalTitle, modalMessage } = this.state;
        return(
            <Modal
                title= {modalTitle}
                visible={this.state.otherModalVisible}
                onCancel={() => this.handleOtherModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Update"
                onOk={() => this.handleOtherModal("ok")}
                centered
            >
               <p style = {{marginLeft: '20px'}}>{modalMessage}</p>
            </Modal>
        )
    }

    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.personalDetails}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        )
    }

    personalPhotoView = () => {
        const personal = this.props.userState.personalData;

        return (
            <div
                className={`${!this.state.isTablet ? "align-self-center" : ""} circular--landscape`}
                role="button"
            >
                {
                    personal.photoUrl && !this.props.userState.userPhotoUpdate ?
                        <img src={personal.photoUrl} alt="" onClick={() => this.selectImage()} />

                        : personal.photoUrl && !!this.props.userState.userPhotoUpdate ?
                            <div>{AppConstants.loading}</div>

                            :
                            <div
                                className="img-upload-target"
                                onClick={() => this.selectImage()}
                            >
                                <div className="img-upload-target-plus">
                                    +
                            </div>
                                <div style={{ marginTop: "-7px" }}>
                                    {AppConstants.addPhoto}
                                </div>
                            </div>
                }
                <input
                    type="file"
                    id={"user-pic"}
                    style={{ display: 'none' }}
                    onChange={(evt) => this.setImage(evt.target)}
                />
            </div>
        )
    }

    leftHandSideView = () => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        let competitionId = this.state.competition != null ? this.state.competition.competitionUniqueKey : null;

        const { isTablet, isCollapsedUserDetails, isUserLoading } = this.state;

        return (
            <div className="fluid-width" style={{ minHeight: `${isTablet ? 'unset' : 'calc(100vh - 175px'}` }}>
                {isTablet && (
                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{
                            minHeight: 80,
                            padding: '16px 20px',
                            boxSizing: 'border-box',
                            borderBottom: '1px solid rgba(27, 27, 52, 0.07)'
                        }}
                    >
                        {!isUserLoading && <div className='d-flex align-items-center'>
                            {this.personalPhotoView()}
                            <div className='d-flex flex-column align-items-start justify-content-center' style={{ marginLeft: 16 }}>
                                <span className="user-heading p-0">{personal.firstName + " " + personal.lastName}</span>
                                <span className="year-select-heading pt-0">{'#' + personal.userId}</span>
                            </div>
                        </div>}

                        <div style={{ color: 'var(--app-color)', marginLeft: 'auto' }}>
                            {isCollapsedUserDetails
                                ? <Icon
                                    type="down"
                                    style={{
                                        color: 'var(--app-orange)',
                                        fontSize: 20
                                    }}
                                    onClick={() => this.setState({ isCollapsedUserDetails: false })}
                                />
                                : <Icon
                                    type="up"
                                    style={{
                                        color: 'var(--app-orange)',
                                        fontSize: 20
                                    }}
                                    onClick={() => this.setState({ isCollapsedUserDetails: true })}
                                />
                            }
                        </div>
                    </div>
                )}

                {(!isCollapsedUserDetails || !isTablet) && !isUserLoading && (
                    <>
                        {!isTablet && (
                            <div className='profile-image-view' style={{ marginTop: 40, marginBottom: 23 }}>
                                {this.personalPhotoView()}
                                <span className="user-heading">{personal.firstName + " " + personal.lastName}</span>
                                {personal.userId ?
                                    <span className="year-select-heading pt-0">{'#' + personal.userId}</span>
                                    :
                                    <span className="year-select-heading pt-0">{'#' + personal.id}</span>
                                }
                            </div>
                        )}

                        <div className={`${isTablet ? 'content-view-padding' : ''} profile-info-view`}>
                            <div className="profile-info-desc-view d-flex flex-wrap">
                                <div className='user-details-info-text-wrapper'>
                                    <span className='user-details-info-text mr-3'>{AppConstants.dateOfBirth}</span>
                                </div>
                                <span className="user-details-info-text text-overflow">{liveScore_formateDate(personal.dateOfBirth) == "Invalid date" ? "" : liveScore_formateDate(personal.dateOfBirth)}</span>
                            </div>
                            <div className="profile-info-desc-view d-flex flex-wrap">
                                <div className='user-details-info-text-wrapper'>
                                    <span className='user-details-info-text mr-3'>{AppConstants.phone}</span>
                                </div>
                                <span className="user-details-info-text text-overflow">{personal.mobileNumber}</span>
                            </div>
                            <div className="profile-info-desc-view d-flex flex-wrap">
                                <div className='user-details-info-text-wrapper'>
                                    <span className='user-details-info-text mr-3'>{AppConstants.email}</span>
                                </div>
                                <span className="user-details-info-text text-overflow">{personal.email}</span>
                            </div>

                            <div
                                className="orange-action-txt user-orange-action-txt"
                                onClick={() => this.onChangeTab('4')}
                            >
                                <span className="add-another-button-border" style={{ padding: '7px 12px' }}>{AppConstants.personalDetails}</span>
                            </div>

                            <div className="profile-info-details-view">
                                <div className="live-score-title-icon-view">
                                    <span className='year-select-heading'>{AppConstants.competition}</span>
                                </div>
                                <Select
                                    name={"yearRefId"}
                                    className="user-prof-filter-select"
                                    style={{ width: "100%", paddingRight: 1, paddingTop: '15px' }}
                                    onChange={yearRefId => this.onChangeYear(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                                <Select
                                    className="user-prof-filter-select"
                                    style={{ width: "100%", paddingRight: 1, paddingTop: '15px' }}
                                    onChange={(e) => this.onChangeSetValue(e)}
                                    value={competitionId}
                                >
                                    <Option key={-1} value={'-1'}>{AppConstants.all}</Option>
                                    {(this.state.competitions || []).map((comp, index) => (
                                        <Option key={comp.competitionUniqueKey} value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="profile-info-details-view">
                                <div className="live-score-title-icon-view">
                                    <span className='year-select-heading'>{AppConstants.team}</span>
                                </div>
                                {(this.state.teams != null && this.state.teams || []).map((item, index) => (
                                    <div key={item.teamId} className="side-bar-profile-desc-text">{item.teamName}</div>
                                ))}
                            </div>
                            <div className="profile-info-details-view">
                                <div className="live-score-title-icon-view">
                                    <span className='year-select-heading'>{AppConstants.division}</span>
                                </div>
                                {(this.state.divisions != null && this.state.divisions || []).map((item, index) => (
                                    <div key={item.divisionId} className="side-bar-profile-desc-text">{item.divisionName}</div>
                                ))}
                                {/* <span className="side-bar-profile-desc-text">{this.state.competition!= null ? this.state.competition.divisionName : null}</span> */}
                            </div>
                            <div className="live-score-side-desc-view">
                                <div className="live-score-title-icon-view">
                                    <div className="live-score-icon-view">
                                        <img src={AppImages.whistleIcon} alt="" height="16" width="16" />
                                    </div>
                                    <span className="year-select-heading ml-3">
                                        {AppConstants.umpireAccreditation}
                                    </span>
                                    <div className='col-sm d-flex justify-content-end'>
                                        <span className="year-select-heading  ml-3">
                                            {AppConstants.expiry}
                                        </span>
                                    </div>
                                </div>
                                <div className='live-score-title-icon-view ml-5'>
                                    <span className="desc-text-style side-bar-profile-data">
                                        {personal.accrediationLevel}
                                    </span>

                                    <div className='col-sm d-flex justify-content-end'>
                                        <span className="desc-text-style side-bar-profile-data">
                                            {personal.accreditationUmpireExpiryDate && moment(personal.accreditationUmpireExpiryDate).format("DD-MM-YYYY")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Coach Accrediation */}
                            <div className="live-score-side-desc-view">
                                <div className="live-score-title-icon-view">
                                    <div className="live-score-icon-view">
                                        <img src={AppImages.whistleIcon} alt="" height="16" width="16" />
                                    </div>
                                    <span className="year-select-heading ml-3">
                                        {AppConstants.coachAccreditation}
                                    </span>
                                    <div className='col-sm d-flex justify-content-end'>
                                        <span className="year-select-heading  ml-3">
                                            {AppConstants.expiry}
                                        </span>
                                    </div>
                                </div>
                                <div className='live-score-title-icon-view ml-5'>
                                    <span className="desc-text-style side-bar-profile-data">
                                        {personal.coachAccreditationLevel}
                                    </span>

                                    <div className='col-sm d-flex justify-content-end'>
                                        <span className="desc-text-style side-bar-profile-data">
                                            {personal.accreditationCoachExpiryDate && moment(personal.accreditationCoachExpiryDate).format("DD-MM-YYYY")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    }

    playerActivityView = () => {
        let userState = this.props.userState;
        let activityPlayerList = userState.activityPlayerList;
        let total = userState.activityPlayerTotalCount;

        return (
            <div className="dash-table-paddings mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.playerHeading}</div>
                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsPlayer}
                    dataSource={activityPlayerList}
                    pagination={false}
                />
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityPlayerPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(page, this.state.userId, this.state.competition, "player")}
                    />
                </div>
            </div>
        )
    }

    parentActivityView = () => {
        let userState = this.props.userState;
        let activityParentList = userState.activityParentList;
        let total = userState.activityParentTotalCount;
        return (
            <div className="dash-table-paddings mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.parentHeading}</div>
                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsParent}
                    dataSource={activityParentList}
                    pagination={false}
                />
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityParentPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(page, this.state.userId, this.state.competition, "parent")}
                    />
                </div>
            </div>
        )
    }

    scorerActivityView = () => {
        let userState = this.props.userState;
        let activityScorerList = userState.scorerActivityRoster;
        let total = userState.scorerTotalCount;

        return (
            <div className="dash-table-paddings mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.scorerHeading}</div>
                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsScorer}
                    dataSource={activityScorerList}
                    pagination={false}
                />
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.scorerCurrentPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(page, this.state.userId, this.state.competition, "scorer", this.state.yearRefId)}
                    />
                </div>
            </div>
        )
    }

    managerActivityView = () => {
        let userState = this.props.userState;
        let activityManagerList = userState.activityManagerList;
        let total = userState.activityScorerTotalCount;

        return (
            <div className="dash-table-paddings mt-2 position-relative" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.managerHeading}</div>

                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsManager}
                    dataSource={activityManagerList}
                    pagination={false}
                />

                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityManagerPage}
                        total={total}
                        onChange={(page) => this.handleActivityTableList(page, this.state.userId, this.state.competition, "manager")}
                    />
                </div>
            </div>
        )
    }

    statisticsView = () => {
        return (
            <div>
                <div className="user-module-row-heading">Statistics</div>
            </div>
        )
    }

    personalView = () => {
        const { userState } = this.props;
        const personal = userState.personalData;
        const personalByCompData = !!userState.personalByCompData && userState.personalByCompData;
        const primaryContacts = personalByCompData.length > 0 ? personalByCompData[0].primaryContacts : [];
        const childContacts = personalByCompData.length > 0 ? personalByCompData[0].childContacts : [];
        let countryName = "";
        // let nationalityName = "";
        // let languages = "";
        let userRegId = null;
        let childrenCheckNumber = "";
        let childrenCheckExpiryDate = "";

        if (personalByCompData != null && personalByCompData.length > 0) {
            countryName = personalByCompData[0].countryName;
            // nationalityName = personalByCompData[0].nationalityName;
            // languages = personalByCompData[0].languages;
            userRegId = personalByCompData[0].userRegistrationId;
            childrenCheckNumber = personalByCompData[0].childrenCheckNumber;
            childrenCheckExpiryDate = personalByCompData[0].childrenCheckExpiryDate;
        }

        return (
            <div className="dash-table-paddings mt-2">
                <div className="user-module-row-heading">{AppConstants.address}</div>

                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsPersonalAddress}
                    dataSource={personalByCompData}
                    pagination={false}
                />

                {/* {primaryContacts != null && primaryContacts.length > 0 && */}
                <div>
                    <div className="user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.parentOrGuardianDetail}</div>
                    <NavLink
                        to={{
                            pathname: `/userProfileEdit`,
                            state: { moduleFrom: "8", userData: personal },
                        }}
                    >
                        <span className="input-heading-add-another" style={{ paddingTop: "unset", marginBottom: "15px" }}>
                            + {AppConstants.addParent_guardian}
                        </span>
                    </NavLink>

                    <TableWithScrollArrows
                        className="home-dashboard-table"
                        columns={columnsPersonalPrimaryContacts}
                        dataSource={primaryContacts}
                        pagination={false}
                    />
                </div>
                {/* } */}
                {(!personal.dateOfBirth || getAge(moment(personal.dateOfBirth).format("MM-DD-YYYY")) > 18) && (
                    <div>
                        <div className="user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.childDetails}</div>
                        <NavLink
                            to={{
                                pathname: `/userProfileEdit`,
                                state: { moduleFrom: "7", userData: personal },
                            }}
                        >
                            <span className="input-heading-add-another" style={{ paddingTop: "unset", marginBottom: "15px" }}>
                                + {AppConstants.addChild}
                            </span>
                        </NavLink>

                        <TableWithScrollArrows
                            className="home-dashboard-table"
                            columns={columnsPersonalChildContacts}
                            dataSource={childContacts}
                            pagination={false}
                        />
                    </div>
                )}

                <div className="user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.emergencyContacts}</div>

                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsPersonalEmergency}
                    dataSource={userState.personalEmergency}
                    pagination={false}
                />
                <div className="row">
                    <div className="col-sm user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.otherInformation}</div>
                    <div className="col-sm d-flex justify-content-end align-items-end" style={{ marginTop: 7, marginBottom: 10 }}>
                        <div className="comp-buttons-view m-0">
                            <NavLink to={{ pathname: `/userProfileEdit`, state: { userData: personalByCompData[0], moduleFrom: "4", personalData: personal } }}>
                                <Button className="other-info-btn other-info-edit-btn m-0" type="primary">
                                    {AppConstants.edit}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="table-responsive home-dash-table-view">
                    <div style={{ marginTop: '7px', marginRight: '15px', marginBottom: '15px' }}>
                        <div className="other-info-row" style={{ paddingTop: '10px' }}>
                            <div className="year-select-heading other-info-label">{AppConstants.gender}</div>
                            <div className="other-info-text other-info-font">
                                {personalByCompData != null && personalByCompData.length > 0 ? personalByCompData[0].gender : null}
                            </div>
                        </div>
                        {userRegId != null && (
                            <div>
                                <div className="other-info-row">
                                    <div className="year-select-heading other-info-label">{AppConstants.countryOfBirth}</div>
                                    <div className="other-info-text other-info-font">{countryName}</div>
                                </div>
                                {/* <div className="other-info-row">
                                    <div className="year-select-heading other-info-label">{AppConstants.nationalityReference}</div>
                                    <div className="side-bar-profile-desc-text other-info-font">{nationalityName}</div>
                                </div>
                                <div className="other-info-row">
                                    <div className="year-select-heading other-info-label">{AppConstants.childLangSpoken}</div>
                                    <div className="side-bar-profile-desc-text other-info-font">{languages}</div>
                                </div> */}
                            </div>
                        )}
                        <div className="other-info-row">
                            <div className="year-select-heading other-info-label">{AppConstants.childrenNumber}</div>
                            <div className="other-info-text other-info-font" style={{ paddingTop: 7 }}>{childrenCheckNumber}</div>
                        </div>
                        <div className="other-info-row">
                            <div className="year-select-heading other-info-label" style={{ paddingBottom: '20px' }}>{AppConstants.checkExpiryDate}</div>
                            <div className="other-info-text other-info-font" style={{ paddingTop: 7 }}>{childrenCheckExpiryDate != null ? moment(childrenCheckExpiryDate).format("DD/MM/YYYY") : ""}</div>
                        </div>

                        {/* <div className="other-info-row">
							<div className="year-select-heading other-info-label" style={{ paddingBottom: '20px' }}>{AppConstants.disability}</div>
							<div className="side-bar-profile-desc-text other-info-font">{personal.isDisability == 0 ? "No" : "Yes"}</div>
						</div> */}
                    </div>
                </div>
            </div>
        )
    }

    medicalView = () => {
        let userState = this.props.userState;
        let medical = userState.medicalData;
        // let medical = [];
        // if (medData != null && medData.length > 0) {
        //     medData[0]["userId"] = this.state.userId;
        //     medical = medData;
        // }

        return (
            <div>
                {
                    (medical || []).map((item, index) => (
                        <div key={item.userRegistrationId} className="table-responsive home-dash-table-view">
                            <div className="col-sm d-flex justify-content-end" style={{ marginRight: '15px' }}>
                                <div className="comp-buttons-view">
                                    <NavLink to={{ pathname: `/userProfileEdit`, state: { userData: item, moduleFrom: "5" } }} >
                                        <Button className="other-info-btn other-info-edit-btn" type="primary" >
                                            {AppConstants.edit}
                                        </Button>
                                    </NavLink>
                                </div>
                            </div>
                            <div style={{ marginBottom: "1%", display: 'flex' }} >
                                <div className="year-select-heading other-info-label col-sm-2">{AppConstants.existingMedConditions}</div>
                                <div className="other-info-text other-info-font" style={{ textAlign: 'left' }}>
                                    {item.existingMedicalCondition}
                                </div>
                            </div>
                            <div style={{ marginBottom: "3%", display: 'flex' }} >
                                <div className="year-select-heading other-info-label col-sm-2">{AppConstants.redularMedicalConditions}</div>
                                <div className="other-info-text other-info-font" style={{ textAlign: 'left' }}>
                                    {item.regularMedication}
                                </div>
                            </div>
                            <div style={{ marginBottom: "3%", display: 'flex' }} >
                                <div className="year-select-heading other-info-label col-sm-2">{AppConstants.disability}</div>
                                <div className="other-info-text other-info-font" style={{ textAlign: 'left' }}>
                                    {item.isDisability}
                                </div>
                            </div>
                            {item.isDisability === 'Yes' && (
                                <div className="dash-table-paddings mt-2" style={{ paddingLeft: '0px' }}>
                                    <div className="table-responsive home-dash-table-view">
                                        <Table
                                            className="home-dashboard-table"
                                            columns={columnsMedical}
                                            dataSource={item.disability}
                                            pagination={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                }
            </div>
        )
    }

    registrationView = () => {
        let userState = this.props.userState;
        let userRegistrationList = userState.userRegistrationList;
        // let total = userState.userRegistrationDataTotalCount;
        let myRegistrations = userRegistrationList?.myRegistrations.registrationDetails ? userRegistrationList?.myRegistrations.registrationDetails : [];
        let myRegistrationsCurrentPage = userRegistrationList?.myRegistrations.page ? userRegistrationList?.myRegistrations.page.currentPage : 1;
        let myRegistrationsTotalCount = userRegistrationList?.myRegistrations.page.totalCount;
        let otherRegistrations = userRegistrationList?.otherRegistrations.registrationYourDetails ? userRegistrationList?.otherRegistrations.registrationYourDetails : [];
        let otherRegistrationsCurrentPage = userRegistrationList?.otherRegistrations.page ? userRegistrationList?.otherRegistrations.page.currentPage : 1;
        let otherRegistrationsTotalCount = userRegistrationList?.otherRegistrations.page.totalCount;
        let teamRegistrations = userRegistrationList?.teamRegistrations.registrationTeamDetails ? userRegistrationList?.teamRegistrations.registrationTeamDetails : [];
        let teamRegistrationsCurrentPage = userRegistrationList?.teamRegistrations.page ? userRegistrationList?.teamRegistrations.page.currentPage : 1;
        let teamRegistrationsTotalCount = userRegistrationList?.teamRegistrations.page.totalCount;
        let childRegistrations = userRegistrationList?.childRegistrations.childRegistrationDetails ? userRegistrationList?.childRegistrations.childRegistrationDetails : [];
        let childRegistrationsCurrentPage = userRegistrationList?.childRegistrations.page ? userRegistrationList?.childRegistrations.page.currentPage : 1;
        let childRegistrationsTotalCount = userRegistrationList?.childRegistrations.page.totalCount;
        let teamMembers = userState.teamMembersDetails ? userState.teamMembersDetails.teamMembers : [];
        let teamMembersCurrentPage = userState.teamMembersDetails?.page ? userState.teamMembersDetails?.page.currentPage : 1;
        let teamMembersTotalCount = userState.teamMembersDetails?.page.totalCount;
        return (
            <div>
                {this.state.isShowRegistrationTeamMembers == false ? (
                    <div>
                        {isArrayNotEmpty(myRegistrations) && (
                            <div className="mt-2">
                                <div className="user-module-row-heading">{AppConstants.ownRegistration}</div>
                                <TableWithScrollArrows
                                    className="home-dashboard-table dashboard-registration-table"
                                    columns={columns}
                                    showHeader={false}
                                    dataSource={myRegistrations}
                                    pagination={false}
                                />
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination"
                                        current={myRegistrationsCurrentPage}
                                        total={myRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(page, this.state.userId, this.state.competition, this.state.yearRefId, "myRegistrations")}
                                    />
                                </div>
                            </div>
                        )}
                        {isArrayNotEmpty(otherRegistrations) && (
                            <div className="mt-2">
                                <div className="user-module-row-heading">{AppConstants.otherRegistration}</div>
                                <TableWithScrollArrows
                                    className="home-dashboard-table dashboard-registration-table"
                                    columns={childOrOtherRegistrationColumns}
                                    showHeader={false}
                                    dataSource={otherRegistrations}
                                    pagination={false}
                                />
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination"
                                        current={otherRegistrationsCurrentPage}
                                        total={otherRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(page, this.state.userId, this.state.competition, this.state.yearRefId, "otherRegistrations")}
                                    />
                                </div>
                            </div>
                        )}
                        {isArrayNotEmpty(childRegistrations) && (
                            <div className="mt-2">
                                <div className="user-module-row-heading">{AppConstants.childRegistration}</div>
                                <TableWithScrollArrows
                                    className="home-dashboard-table dashboard-registration-table"
                                    columns={childOrOtherRegistrationColumns}
                                    showHeader={false}
                                    dataSource={childRegistrations}
                                    pagination={false}
                                />
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination"
                                        current={childRegistrationsCurrentPage}
                                        total={childRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(page, this.state.userId, this.state.competition, this.state.yearRefId, "childRegistrations")}
                                    />
                                </div>
                            </div>
                        )}
                        {isArrayNotEmpty(teamRegistrations) && (
                            <div className="mt-2">
                                <div className="user-module-row-heading">{AppConstants.teamRegistration}</div>
                                <TableWithScrollArrows
                                    className="home-dashboard-table dashboard-registration-table"
                                    columns={teamRegistrationColumns}
                                    showHeader={false}
                                    dataSource={teamRegistrations}
                                    pagination={false}
                                />
                                <div className="d-flex justify-content-end">
                                    <Pagination
                                        className="antd-pagination"
                                        current={teamRegistrationsCurrentPage}
                                        total={teamRegistrationsTotalCount}
                                        onChange={(page) => this.handleRegistrationTableList(page, this.state.userId, this.state.competition, this.state.yearRefId, "teamRegistrations")}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="comp-dash-table-view mt-2">
                        <div className="row">
                            <div className="col-sm d-flex align-content-center">
                                <Breadcrumb separator=" > ">
                                    <Breadcrumb.Item
                                        className="breadcrumb-add font-18 pointer"
                                        onClick={() => this.setState({isShowRegistrationTeamMembers: false})}
                                        style={{ color: "var(--app-color)" }}
                                    >
                                        {AppConstants.Registrations}
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item className="breadcrumb-add font-18">
                                        {AppConstants.teamMembers}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                            {this.state.registrationTeam.isRemove ?
                                <div className="orange-action-txt font-14" onClick={() => this.gotoAddTeamMembers()}>
                                    +
                                    {' '}
                                    {AppConstants.addTeamMembers}
                                </div>
                                :
                                null
                            }

                        </div>
                        <div className="user-module-row-heading font-18 mt-2">
                            {AppConstants.team + ": " + this.state.registrationTeam.teamName}
                        </div>
                        <div className="table-responsive home-dash-table-view">
                            <Table
                                className="home-dashboard-table"
                                columns={teamMembersColumns}
                                dataSource={teamMembers}
                                pagination={false}
                                loading={
                                    this.props.userState.getTeamMembersOnLoad ||
                                    this.state.cancelTeamMemberDeRegistrationLoad
                                }
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <Pagination
                                className="antd-pagination pb-3"
                                current={teamMembersCurrentPage}
                                total={teamMembersTotalCount}
                                onChange={(page) =>
                                    this.showTeamMembers(
                                        this.state.registrationTeam,
                                        page
                                    )
                                }
                                showSizeChanger={false}
                            />
                        </div>
                    </div>
                    )}
            </div>
        )
    }

    registrationFormView = () => {
        let registrationForm = this.state.registrationForm == null ? [] : this.state.registrationForm;

        return (
            <div className="dash-table-paddings mt-2">
                <div className="user-module-row-heading">{AppConstants.registrationFormQuestions}</div>
                {(registrationForm || []).map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                        <InputWithHead heading={item.description} />

                        {(item.registrationSettingsRefId == 6 || item.registrationSettingsRefId == 11) && (
                            <div className="applicable-to-text">
                                {item.contentValue == null ? AppConstants.noInformationProvided : item.contentValue}
                            </div>
                        )}
                        {(item.registrationSettingsRefId == 7) && (
                            <div>
                                {item.contentValue == "No" ? (
                                    <div className="applicable-to-text">
                                        {item.contentValue}
                                    </div>
                                ) : (
                                        <div className="table-responsive home-dash-table-view">
                                            <Table
                                                className="home-dashboard-table"
                                                columns={columnsPlayedBefore}
                                                dataSource={item.playedBefore}
                                                pagination={false}
                                            />
                                        </div>
                                    )}
                            </div>
                        )}
                        {(item.registrationSettingsRefId == 8) && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsFriends}
                                    dataSource={item.friends}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {(item.registrationSettingsRefId == 9) && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsFriends}
                                    dataSource={item.referFriends}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {(item.registrationSettingsRefId == 10) && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsFav}
                                    dataSource={item.favourites}
                                    pagination={false}
                                />
                            </div>
                        )}
                        {(item.registrationSettingsRefId == 12) && (
                            <div className="table-responsive home-dash-table-view">
                                <Table
                                    className="home-dashboard-table"
                                    columns={columnsVol}
                                    dataSource={item.volunteers}
                                    pagination={false}
                                />
                            </div>
                        )}
                    </div>
                ))}
                {registrationForm.length === 0 && (
                    <div>{AppConstants.noInformationProvided}</div>
                )}
                <div className="row" style={{ marginTop: '50px' }}>
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button" onClick={() => this.setState({ isRegistrationForm: false })}>
                                {AppConstants.back}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    noDataAvailable = () => {
        return (
            <div style={{ display: 'flex' }}>
                <span className="inside-table-view no-data-info mt-4">{AppConstants.noDataAvailable}</span>
            </div>
        )
    }

    tableLoadingView = () => (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: '100%', height: 200 }}
        >
            <Spin />
        </div>
    )

    headerView = () => {
        const stripeConnected = getStripeAccountId() ? true : false;
        const stripeConnectId = getStripeAccountConnectId() ? true : false;
        let stripeConnectURL = `https://connect.stripe.com/express/oauth/authorize?client_id=${StripeKeys.clientId}&state={STATE_VALUE}&redirect_uri=${StripeKeys.url}`;
        if (true) {
            let userDetail = null
            if (this.props && this.props.userState && this.props.userState.personalData) {
                userDetail = this.props.userState.personalData
            }
            if (userDetail) {
                stripeConnectURL += '&stripe_user[country]=AU' // Hardcode country to Australia
                stripeConnectURL += `&stripe_user[first_name]=${userDetail.firstName}`
                stripeConnectURL += `&stripe_user[last_name]=${userDetail.lastName}`

                if (userDetail.email) {
                    stripeConnectURL += `&stripe_user[email]=${encodeURIComponent(userDetail.email)}`
                }

                if (userDetail.mobileNumber) {
                    stripeConnectURL += `&stripe_user[phone_number]=${encodeURIComponent(userDetail.mobileNumber)}`
                }

                if (userDetail.dateOfBirth) {
                    const dob = new Date(userDetail.dateOfBirth)
                    const day = dob.getDate()
                    const month = dob.getMonth() + 1;
                    const year = dob.getFullYear()
                    stripeConnectURL += `&stripe_user[dob_day]=${day}`
                    stripeConnectURL += `&stripe_user[dob_month]=${month}`
                    stripeConnectURL += `&stripe_user[dob_year]=${year}`
                }

                stripeConnectURL += `&stripe_user[product_description]=${encodeURIComponent('Receiving payments for umpire payments after matches are played')}`
            }
        }

        const { userState } = this.props;
        const { userRole } = userState;

        const personalByCompData = !!userState.personalByCompData ? userState.personalByCompData : [];

        return (
            <div className="row">
                <div className="col-sm" style={{ flex: 1 }}>
                    <Header
                        className="form-header-view"
                        style={{
                            backgroundColor: "transparent",
                            display: "flex", paddingLeft: '0px',
                            alignItems: "center",
                        }}
                    >
                        <div className="user-heading">{AppConstants.userProfile}</div>
                    </Header>
                </div>

                <div className="col-sm d-flex align-items-center justify-content-end" style={{ flex: 1 }}>
                    <div className="col-row" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <div className="col-sm" style={{ padding: 0 }}>
                            <div className="col-sm" style={{ padding: 0 }}>
                                <Menu
                                    className="action-triple-dot-submenu menu-align-text"
                                    theme="light"
                                    mode="horizontal"
                                    style={{ lineHeight: "25px" }}
                                >
                                    <SubMenu
                                        key="sub1"
                                        style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                                        title={
                                            <Button className="other-info-btn" type="primary">
                                                {AppConstants.actions}
                                            </Button>
                                        }
                                    >
                                        <Menu.Item onClick={() => history.push({
                                            pathname: '/userProfileEdit',
                                            state: { userData: personalByCompData[0], moduleFrom: "1" }
                                        })}>
                                            <span>{AppConstants.editProfile}</span>
                                        </Menu.Item>
                                        <Menu.Item onClick={() => history.push("/shop")}>
                                            <span>{AppConstants.shop}</span>
                                        </Menu.Item>
                                        <Menu.Item onClick={() => this.navigateTo("/appRegistrationForm")} >
                                            <span>{AppConstants.register}</span>
                                        </Menu.Item>
                                        {/* <Menu.Item onClick={() => history.push("/deRegistration", { userId: this.state.userId, regChangeTypeRefId: 1 })} >
                                            <span>{AppConstants.deRegistration}</span>
                                        </Menu.Item> */}
                                        {stripeConnectId ?
                                            userRole && <Menu.Item
                                                onClick={() => this.stripeDashboardLoginUrl()}
                                                className="menu-item-without-selection"
                                            >
                                                <span>{AppConstants.editBankAccount}</span>
                                            </Menu.Item>
                                            :
                                            userRole && <Menu.Item>
                                                <a href={stripeConnectURL}>
                                                    <span>{AppConstants.uploadBankAccnt}</span>
                                                </a>
                                            </Menu.Item>
                                        }

                                        {userRole && (
                                            <Menu.Item onClick={() => history.push("/myUmpiringAvailability")}>
                                                <span>{AppConstants.myUmpiringAvailability}</span>
                                            </Menu.Item>
                                        )}
                                    </SubMenu>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    historyView = () => {
        let { userHistoryList, userHistoryPage, userHistoryTotalCount } = this.props.userState;

        return (
            <div className="dash-table-paddings mt-2">
                <TableWithScrollArrows
                    className="home-dashboard-table"
                    columns={columnsHistory}
                    dataSource={userHistoryList}
                    pagination={false}
                />
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userHistoryPage}
                        total={userHistoryTotalCount}
                        onChange={(page) => this.handleHistoryTableList(page, this.state.userId)}
                    />
                </div>
            </div>
        )
    }

    userPurchasesView = () => {
        const {
            userPurchasesList,
            userPurchasesCount,
            userPurchasesCurrentPage,
        } = this.props.userState;
        return (
            <div className="comp-dash-table-view mt-2 default-bg">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={purchasesColumn}
                        dataSource={userPurchasesList}
                        pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={userPurchasesCurrentPage}
                        total={userPurchasesCount}
                        onChange={(page) => this.handlePurchasesTableList(
                            page,
                            this.state.userId,
                        )}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    };

    userEmail = () => {
        let orgData = getOrganisationData()
        return orgData && orgData.email ? encodeURIComponent(orgData.email) : ""
    }

    stripeDashboardLoginUrl = () => {
        this.setState({ stripeDashBoardLoad: true })
        this.props.getStripeLoginLinkAction(this.state.userId)
    }

    umpireActivityView = () => {
        let { umpireActivityList, umpireActivityCurrentPage, umpireActivityTotalCount } = this.props.userState;

        return (
            <div
                className="dash-table-paddings mt-2 pt-4"
                style={{ backgroundColor: "#f7fafc" }}
            >
                {/*
                <div className="transfer-image-view mb-3">
                    <Button
                        className="primary-add-comp-form" type="primary">
                        <div className="row">
                            <div className="col-sm">
                                <img
                                    src={AppImages.export}
                                    alt=""
                                    className="export-image"
                                />
                                {AppConstants.export}
                            </div>
                        </div>
                    </Button>
                </div>
                */}

                <TableWithScrollArrows
                    columns={umpireActivityColumn}
                    dataSource={umpireActivityList}
                    pagination={false}
                    className="home-dashboard-table"
                />
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-3"
                        current={umpireActivityCurrentPage}
                        total={umpireActivityTotalCount}
                        onChange={(page) =>
                            this.handleUmpireActivityTableList(
                                page,
                                this.state.userId
                            )
                        }
                    />
                </div>
            </div>
        );
    };

    parentUnLinkView = (data) => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        let organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
        data["section"] = data.status === "Linked" ? "unlink" : "link";
        data["childUserId"] = personal.userId;
        data["organisationId"] = organisationId;
        this.props.userProfileUpdateAction(data);
        this.setState({ unlinkOnLoad: true });
    }

    childUnLinkView = (data) => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        let organisationId = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
        data["section"] = data.status === "Linked" ? "unlink" : "link";
        data["parentUserId"] = personal.userId;
        data["organisationId"] = organisationId;
        this.props.userProfileUpdateAction(data);
        this.setState({ unlinkOnLoad: true });
    }

    removeTeamMemberView = (data) => {
        data.processType = data.isActive ? "deactivate" : "activate";
        this.props.teamMemberUpdateAction(data);
        this.setState({ removeTeamMemberLoad: true });
    }

    unlinkCheckParent = (record) => {
        if (record.unlinkedBy && record.status === "Unlinked") {
            if (record.unlinkedBy == record.userId) {
                this.setState({ unlinkRecord: record, showParentUnlinkConfirmPopup: true })
            } else {
                this.setState({ unlinkRecord: record, showCannotUnlinkPopup: true })
            }
        } else {
            this.setState({ unlinkRecord: record, showParentUnlinkConfirmPopup: true })
        }
    }

    unlinkCheckChild = (record) => {
        if (record.unlinkedBy && record.status === "Unlinked") {
            if (record.unlinkedBy == record.userId) {
                this.setState({ unlinkRecord: record, showChildUnlinkConfirmPopup: true })
            } else {
                this.setState({ unlinkRecord: record, showCannotUnlinkPopup: true })
            }
        } else {
            this.setState({ unlinkRecord: record, showChildUnlinkConfirmPopup: true })
        }
    }

    removeTeamMember = (record) => {
        if (record.isActive) {
            this.setState({ removeTeamMemberRecord: record, showRemoveTeamMemberConfirmPopup: true });
        } else {
            this.removeTeamMemberView(record);
        }
    }

    cannotUninkPopup = () => {
        let data = this.state.unlinkRecord;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title="Warning"
                    visible={this.state.showCannotUnlinkPopup}
                    onCancel={() => this.setState({ showCannotUnlinkPopup: false })}
                    footer={[
                        <Button onClick={() => this.setState({ showCannotUnlinkPopup: false })}>
                            {AppConstants.ok}
                        </Button>,
                    ]}
                >
                    {data?.childName ?
                        <p> {AppConstants.parentUnlinkMessage}</p>
                        :
                        <p>{AppConstants.childUnlinkMessage}</p>
                    }
                </Modal>
            </div>
        )
    }

    unlinkChildConfirmPopup = () => {
        let status = this.state.unlinkRecord?.status === "Linked" ? "de-link" : "link";
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.confirm}
                    visible={this.state.showChildUnlinkConfirmPopup}
                    onCancel={() => this.setState({ showChildUnlinkConfirmPopup: false })}
                    footer={[
                        <Button onClick={() => this.setState({ showChildUnlinkConfirmPopup: false })}>
                            {AppConstants.cancel}
                        </Button>,
                        <Button onClick={() => {
                            this.childUnLinkView(this.state.unlinkRecord);
                            this.setState({ showChildUnlinkConfirmPopup: false })
                        }}>
                            {AppConstants.confirm}
                        </Button>
                    ]}
                >
                    <p> {"Are you sure you want to " + status + " your account?"}</p>
                </Modal>
            </div>
        )
    }

    unlinkParentConfirmPopup = () => {
        let status = this.state.unlinkRecord?.status === "Linked" ? "de-link" : "link";
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.confirm}
                    visible={this.state.showParentUnlinkConfirmPopup}
                    onCancel={() => this.setState({ showParentUnlinkConfirmPopup: false })}
                    footer={[
                        <Button onClick={() => this.setState({ showParentUnlinkConfirmPopup: false })}>
                            {AppConstants.cancel}
                        </Button>,
                        <Button onClick={() => {
                            this.parentUnLinkView(this.state.unlinkRecord);
                            this.setState({ showParentUnlinkConfirmPopup: false })
                        }}>
                            {AppConstants.confirm}
                        </Button>
                    ]}
                >
                    <p> {"Are you sure you want to " + status + " your account?"}</p>
                </Modal>
            </div>
        )
    }

    removeTeamMemberConfirmPopup = () => (
        <div>
            <Modal
                className="add-membership-type-modal"
                title={AppConstants.confirm}
                visible={this.state.showRemoveTeamMemberConfirmPopup}
                onCancel={() => this.setState({ showRemoveTeamMemberConfirmPopup: false })}
                footer={[
                    <Button onClick={() => this.setState({ showRemoveTeamMemberConfirmPopup: false })}>
                        {AppConstants.no}
                    </Button>,
                    <Button
                        onClick={() => {
                            this.removeTeamMemberView(this.state.removeTeamMemberRecord);
                            this.setState({ showRemoveTeamMemberConfirmPopup: false });
                        }}
                    >
                        {AppConstants.yes}
                    </Button>,
                ]}
            >
                <p>{AppConstants.removeFromTeamPopUpMsg}</p>
            </Modal>
        </div>
    )

    render() {
        let {
            activityPlayerList,
            activityManagerList,
            activityScorerList,
            umpireActivityList,
            scorerActivityRoster,
            userRegistrationList,
            activityParentList,
            medicalData,
            userHistoryList,

            personalByCompData,
            userRole,

            activityManagerOnLoad,
            activityPlayerOnLoad,
            activityScorerOnLoad,
            umpireActivityOnLoad,
            activityParentOnLoad,
            onPersonLoad,
            userRegistrationOnLoad,
            userHistoryLoad,
            onMedicalLoad,

            personalData,
            userPurchasesList,
            userPurchasesOnLoad,

        } = this.props.userState;

        let personalDetails = personalByCompData != null ? personalByCompData : [];
        let userRegistrationId = null;
        if (personalDetails != null && personalDetails.length > 0) {
            userRegistrationId = personalByCompData[0].userRegistrationId
        }

        const { isTablet, isCollapsedUserDetails, isPersonDetailsTabVisited, isUserLoading } = this.state;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                {/* <InnerHorizontalMenu menu={"user"} userSelectedKey={"1"} /> */}
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width">
                            <div
                                className="d-flex flex-wrap"
                                style={{
                                    padding: `${isTablet ? 0 : '0 15px 0 30px'}`
                                }}
                            >
                                <div
                                    className={`${isTablet ? "col-sm-12 px-0" : "col-sm-3 content-view-padding"} bg-white`}
                                    style={{
                                        paddingBottom: `${isTablet && isCollapsedUserDetails ? 0 : '50px'}`,
                                    }}
                                >
                                    {this.leftHandSideView()}
                                </div>

                                <div
                                    className={`${isTablet ? "col-sm-12" : "col-sm-9"} content-view-padding`}
                                    style={{ backgroundColor: "#f7fafc", }}
                                >
                                    <div className="mt-4">{this.headerView()}</div>
                                    <div className="inside-table-view mt-4" >
                                        <Menu
                                            theme="light"
                                            mode="horizontal"
                                            defaultSelectedKeys={['1']}
                                            style={{ lineHeight: '48px', marginBottom: 25 }}
                                            selectedKeys={[this.state.tabKey]}
                                            onClick={this.onChangeTab}
                                        >
                                            <Menu.Item key="1">
                                                <span>{AppConstants.registrations}</span>
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                <span>{AppConstants.activity}</span>
                                            </Menu.Item>
                                            <Menu.Item key="3">
                                                <span>{AppConstants.statistics}</span>
                                            </Menu.Item>
                                            <Menu.Item key="4">
                                                <span>{AppConstants.personalDetails}</span>
                                            </Menu.Item>
                                            {userRegistrationId != null && (
                                                <Menu.Item key="5">
                                                    <span>{AppConstants.medical}</span>
                                                </Menu.Item>
                                            )}
                                            <Menu.Item key="6">
                                                <span>{AppConstants.history}</span>
                                            </Menu.Item>
                                            {userRole && (
                                                <Menu.Item key="7">
                                                    <span>{AppConstants.umpireActivity}</span>
                                                </Menu.Item>
                                            )}
                                            <Menu.Item key="8">
                                                <span>{AppConstants.purchases}</span>
                                            </Menu.Item>
                                        </Menu>

                                        {this.state.tabKey === "1" && !isUserLoading && (
                                            <>
                                                {!this.state.isRegistrationForm ?
                                                    <>
                                                        {!!userRegistrationList && !userRegistrationOnLoad && this.registrationView()}
                                                        {(userRegistrationOnLoad || onPersonLoad || !personalByCompData[0]?.userId) && this.tableLoadingView()}
                                                        {!userRegistrationList && !userRegistrationOnLoad && !onPersonLoad && (!!personalData?.userId || !!personalByCompData[0]?.userId) && this.noDataAvailable()}
                                                    </>
                                                    : this.registrationFormView()
                                                }
                                            </>
                                        )}
                                        {this.state.tabKey === "2" && (
                                            <>
                                                {!!activityPlayerList && !!activityPlayerList.length && !activityPlayerOnLoad && this.playerActivityView()}
                                                {!!activityManagerList && !!activityManagerList.length && !activityManagerOnLoad && this.managerActivityView()}
                                                {!!scorerActivityRoster && !!scorerActivityRoster.length && !activityScorerOnLoad && this.scorerActivityView()}
                                                {/* {!!activityParentList && !!activityParentList.length && this.parentActivityView()} */}
                                                {(activityManagerOnLoad && activityPlayerOnLoad && activityScorerOnLoad)
                                                    && this.tableLoadingView()}
                                                {!activityPlayerList.length && !activityManagerList.length
                                                    && !scorerActivityRoster.length //&& activityParentList.length == 0
                                                    && !activityManagerOnLoad && !activityPlayerOnLoad && !activityScorerOnLoad
                                                    && this.noDataAvailable()}
                                            </>
                                        )}
                                        {this.state.tabKey === "3" && this.statisticsView()}
                                        {this.state.tabKey === "4" && !isUserLoading && (
                                            <>
                                                {isPersonDetailsTabVisited && !!personalByCompData && !!personalByCompData.length && !onPersonLoad && this.personalView()}
                                                {onPersonLoad && this.tableLoadingView()}
                                                {!personalByCompData.length && !onPersonLoad && this.noDataAvailable()}
                                            </>
                                        )}
                                        {this.state.tabKey === "5" && (
                                            <>
                                                {!!medicalData && !!medicalData.length && !onMedicalLoad && this.medicalView()}
                                                {onMedicalLoad && this.tableLoadingView()}
                                                {!medicalData.length && !onMedicalLoad && this.noDataAvailable()}
                                            </>
                                        )}
                                        {this.state.tabKey === "6" && (
                                            <>
                                                {!!userHistoryList && !!userHistoryList.length && !userHistoryLoad && this.historyView()}
                                                {userHistoryLoad && this.tableLoadingView()}
                                                {!userHistoryList.length && !userHistoryLoad && this.noDataAvailable()}
                                            </>
                                        )}
                                        {this.state.tabKey === "7" && (
                                            <>
                                                {!!umpireActivityList && !!umpireActivityList.length && !umpireActivityOnLoad && this.umpireActivityView()}
                                                {umpireActivityOnLoad && this.tableLoadingView()}
                                                {!umpireActivityList.length && !umpireActivityOnLoad && this.noDataAvailable()}
                                            </>
                                        )}
                                        {this.state.tabKey === "8" && (
                                            <>
                                                {!!userPurchasesList && !!userPurchasesList.length && !userPurchasesOnLoad && this.userPurchasesView()}
                                                {userPurchasesOnLoad && this.tableLoadingView()}
                                                {userPurchasesList && !userPurchasesList.length && !userPurchasesOnLoad && this.noDataAvailable()}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Loader visible={this.props.userState.userPhotoUpdate || isUserLoading} />
                        {this.unlinkChildConfirmPopup()}
                        {this.unlinkParentConfirmPopup()}
                        {this.cannotUninkPopup()}
                        {this.removeTeamMemberConfirmPopup()}
                        {this.otherModalView()}
                    </Content>
                </Layout>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserModulePersonalDetailsAction,
        getUserModuleMedicalInfoAction,
        getUserModuleRegistrationAction,
        getUserModulePersonalByCompetitionAction,
        getUserModuleActivityPlayerAction,
        getUserModuleActivityParentAction,
        getUserModuleActivityScorerAction,
        getUserModuleActivityManagerAction,
        getOnlyYearListAction,
        clearRegistrationDataAction,
        getUserHistoryAction,
        getUserRole,
        getScorerData,
        getUmpireActivityListAction,
        saveStripeAccountAction,
        getStripeLoginLinkAction,
        userPhotoUpdateAction,
        registrationResendEmailAction,
        userProfileUpdateAction,
        getUserModuleTeamMembersAction,
        teamMemberUpdateAction,
        getUserOrganisationAction,
        cancelDeRegistrationAction,
        liveScorePlayersToPayRetryPaymentAction,
        registrationRetryPaymentAction,
        getUserPurchasesAction,
        getReferenceOrderStatus
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState,
        endUserRegistrationState: state.EndUserRegistrationState,
        stripeState: state.StripeState,
        userRegistrationState: state.UserRegistrationState,
        shopProductState: state.ShopProductState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserModulePersonalDetail);
