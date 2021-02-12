import React, { Component } from "react";
import { Layout, Radio, Select, Descriptions, Input, Divider, Button } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import Chart from "chart.js";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead"
import AppImages from "../../themes/appImages";
import {
    getInvoice,
    onChangeCharityAction,
    saveInvoiceAction,
    getInvoiceStatusAction,
    getShopInvoice,
} from "../../store/actions/stripeAction/stripeAction"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import history from "../../util/history";
import Doc from '../../util/DocService';
import PdfContainer from '../../util/PdfContainer';
import {getUserId } from '../../util/sessionStorage'
import {netSetGoTshirtSizeAction} from '../../store/actions/commonAction/commonAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input

class RegistrationInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019winter",
            value: "playingMember",
            competition: "all",
            loading: false,
            checkStatusLoad: false,
            invoiceDisabled: false,
        }
        this.props.netSetGoTshirtSizeAction();
    }


    componentDidMount() {
        let paymentSuccess = this.props.location.state ? this.props.location.state.paymentSuccess : false
        this.setState({ invoiceDisabled: paymentSuccess })
        this.getInvoiceStatusAPI()
    }

    getInvoiceStatusAPI = () => {
        let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
        let teamMemberRegId = this.props.location.state ? this.props.location.state.teamMemberRegId : null;
        let userRegId = this.props.location.state ? this.props.location.state.registrationId : null;
        let invoiceId = this.props.location.state ? this.props.location.state.invoiceId : null;
        const shopUniqueKey = this.props.location.state ? this.props.location.state.shopUniqueKey : null;

        if (shopUniqueKey) {
            this.props.getShopInvoice(shopUniqueKey, invoiceId);
        } else {
            this.props.getInvoiceStatusAction(registrationId, userRegId, invoiceId, teamMemberRegId);
        }
        this.setState({ checkStatusLoad: true });
    }

    componentDidUpdate() {
        let stripeState = this.props.stripeState
        if (stripeState.onLoad == false && this.state.loading === true) {
            this.setState({ loading: false });
            if (!stripeState.error) {
                history.push("/checkoutPayment", {
                    registrationId: this.props.location.state ? this.props.location.state.registrationId : null,
                    invoiceId: this.props.stripeState.invoiceId,
                })
            }
        }
        if (stripeState.onLoad == false && this.state.checkStatusLoad === true && !this.props.stripeState.invoiceData) {
            this.setState({ checkStatusLoad: false });
           // let invoiceId = this.props.stripeState.invoiceId
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            let teamMemberRegId = this.props.location.state ? this.props.location.state.teamMemberRegId : null;
            let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
            let invoiceId = this.props.location.state ? this.props.location.state.invoiceId : null;
            // let registrationId = "fd96ceef-196b-4654-aecd-0fc29d70a2d8";
            // let userRegId = null;
            // let invoiceId = null;
            let data=this.props.location
            data.pathname='/invoice'
            this.props.getInvoice(registrationId, userRegId, invoiceId, teamMemberRegId)
            window.history.pushState(data, document.title, window.location.href);
            window.addEventListener('popstate', () => {
                window.history.pushState(data, document.title, window.location.href);
            });
            //this.props.getInvoice('05c59bfc-9438-42e6-8917-4a60ed949281', invoiceId)
        }
    }


    saveInvoiceAPICall = () => {
        let charitySelected = JSON.parse(JSON.stringify(this.props.stripeState.charitySelected))
        let finalCharityPost = charitySelected.competitionId == 0 ? null : charitySelected
        let payload = {
            registrationId: this.props.location.state ? this.props.location.state.registrationId : null,
            //registrationId: 1212,
            invoiceId: this.props.stripeState.invoiceId,
            transactionId: this.props.stripeState.transactionId,
            charity: finalCharityPost,
        }

        this.props.saveInvoiceAction(payload)
        this.setState({ loading: true });
    }

    gotoUserPage = (userId) => {
        if(userId != 0){
            history.push({pathname: '/userPersonal'});
        }else{
            history.push({pathname: '/login'});
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container  mt-0" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                    </div>
                </div>
            </Header >
        )
    }

    ///top header view
    topView = (result) => {
        let {invoiceData, getAffiliteDetailData} = this.props.stripeState;
        let userDetail = invoiceData != null ? invoiceData.billTo: null;
        let organisationLogo = invoiceData!= null ? invoiceData.organisationLogo : null;
        let invoiceDisabled = this.state.invoiceDisabled;
        let isSchoolRegistrationApplied = invoiceData!= null ? invoiceData.isSchoolRegistrationApplied: 0;
        let msg = isSchoolRegistrationApplied == 1? "(" + AppConstants.toBeInvoicedViaSchool + ")" : ""
        return (
            <div className="content-view pt-4 pb-0 " >
                <div className="drop-reverse" >
                    <div className="col-sm pt-3 pl-0">
                        <label className="invoice-description">
                            <img
                                src={organisationLogo ? organisationLogo : AppImages.squareImage}
                                // alt="animated"
                                height="120"
                                width="120"
                                // style={{ borderRadius: 60 }}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.squareImage;
                                }}
                            />
                        </label>
                        <div className="invoice-receipt">
                            <div className="invoice-receipt-num">
                                    Receipt No.{userDetail && (userDetail.receiptId ? userDetail.receiptId : "100000")}
                            </div>
                            <div className="schoolInvoiceTxt">{msg}</div>
                        </div>
                        {/* <InputWithHead
                            heading={"Receipt No.1234497"}
                        /> */}
                        {userDetail && userDetail.firstName &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" label="Bill To">
                                    {userDetail.firstName}{' '}{userDetail.middleName}{' '}{userDetail.lastName}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && userDetail.street1 &&
                            < Descriptions >
                                <Descriptions.Item className="pb-0"  >
                                    {userDetail.street1}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && userDetail.street2 &&
                            < Descriptions >
                                <Descriptions.Item className="pb-0"  >
                                    {userDetail.street2}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail &&
                            < Descriptions >
                                <Descriptions.Item >
                                    {userDetail.suburb}{userDetail.suburb ? ", " : ""}{userDetail.state}{userDetail.state ? ", " : ""}{userDetail.postalCode}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                    </div>


                    <div className="col-sm-5 mb-5 pl-0">
                        <div >
                            {(getAffiliteDetailData).map((item, index) => {
                                return (
                                    <div className="affiliate-detail-View-Invoice" >
                                        <div className="pt-3" >
                                            <span className="roundUpDescription-text">{item.organisationName}</span>
                                            <Descriptions >
                                                <Descriptions.Item className="pb-0" label="E">
                                                    {item.organiationEmailId ? item.organiationEmailId : "N/A"}
                                                </Descriptions.Item>
                                            </Descriptions>
                                            <Descriptions >
                                                <Descriptions.Item className="pb-0" label="Ph">
                                                    {item.organiationPhoneNo ? item.organiationPhoneNo : "N/A"}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                    </div>)
                            })}
                        </div>
                        {/* {!invoiceDisabled &&
                            <TextArea
                                placeholder="Text Area"
                            />
                        } */}
                    </div>
                </div>

            </div>
        )
    }

    membershipProductView = (membershipDetail, membershipProductName, mTypeName) => {
        let mOrganisationName = membershipDetail!= null ? membershipDetail.name : '';
        membershipProductName = membershipProductName!= null ? membershipProductName : '';
        let childDiscountsToDeduct = membershipDetail.childDiscountsToDeduct!= null ?
                                        membershipDetail.childDiscountsToDeduct : 0;
        let governmentVoucherAmount = membershipDetail.governmentVoucherAmount!= null ?
                                membershipDetail.governmentVoucherAmount : 0;

        return (
            < div className="row" >
                <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                    <InputWithHead
                        heading={mOrganisationName + " - " + membershipProductName + " Membership Fees" + " - " + mTypeName}
                        required="pr-3 justify-content-start"
                    />
                </div>

                <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                    <div>
                        < div className="row flex-nowrap">
                            <div className="col-sm invoice-description"  >
                                <InputWithHead
                                    heading={("1.00")}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (Number(membershipDetail.feesToPay)).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (parseFloat((membershipDetail.discountsToDeduct).toFixed(2))
                                        + parseFloat((childDiscountsToDeduct).toFixed(2))).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (parseFloat((governmentVoucherAmount).toFixed(2))).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (Number(membershipDetail.feesToPayGST)).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column" >
                                <InputWithHead
                                    required="invoice"
                                    heading={'$' + (parseFloat((membershipDetail.feesToPay).toFixed(2)) + parseFloat((membershipDetail.feesToPayGST).toFixed(2)) - parseFloat((membershipDetail.discountsToDeduct).toFixed(2)) -
                                        parseFloat((childDiscountsToDeduct).toFixed(2)) - parseFloat((governmentVoucherAmount).toFixed(2))).toFixed(2)}
                                />
                            </div>
                        </ div>
                    </div>
                </div>
                < Divider className="mt-0 mb-0" />
            </div>
        )
    }

    competitionOrganiserView = (competitionDetails) => {
        let childDiscountsToDeduct = competitionDetails.childDiscountsToDeduct!= null ?
                                competitionDetails.childDiscountsToDeduct : 0;
        let governmentVoucherAmount = competitionDetails.governmentVoucherAmount!= null ?
                                competitionDetails.governmentVoucherAmount : 0;
        return (
            <div className="row" >
                <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                    {competitionDetails && competitionDetails.name &&
                        <InputWithHead
                            heading={competitionDetails.name + " - Competition Fees"}
                            required="pr-3 justify-content-start"
                        />
                    }
                </div>
                <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                    <div>
                        <div className="row flex-nowrap">
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"1.00"}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (Number(competitionDetails.feesToPay)).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (parseFloat((competitionDetails.discountsToDeduct).toFixed(2)) + parseFloat((childDiscountsToDeduct).toFixed(2))
                                        ).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (parseFloat((governmentVoucherAmount).toFixed(2))).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (Number(competitionDetails.feesToPayGST)).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column" >
                                <InputWithHead
                                    required="invoice"
                                    heading={'$' + (  parseFloat((competitionDetails.feesToPay).toFixed(2)) + parseFloat((competitionDetails.feesToPayGST).toFixed(2)) - parseFloat((competitionDetails.discountsToDeduct).toFixed(2)) -
                                        parseFloat((childDiscountsToDeduct).toFixed(2)) - parseFloat((governmentVoucherAmount).toFixed(2))).toFixed(2)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                < Divider className="mt-0 mb-0" />
            </div>
        )
    }

    nominationCompOrgView = (competitionDetails) => {
        let nominationGVAmount = competitionDetails.nominationGVAmount!= null ?
        competitionDetails.nominationGVAmount : 0;
        let nomDiscountsToDeduct = competitionDetails.nomDiscountsToDeduct ? competitionDetails.nomDiscountsToDeduct : 0;
        let childDiscountsToDeduct = competitionDetails.nomChildDiscountsToDeduct!= null ?
                competitionDetails.nomChildDiscountsToDeduct : 0;
        return (
            <div className="row" >
                <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                    {competitionDetails && competitionDetails.name &&
                        <InputWithHead
                            heading={competitionDetails.name + " - Nomination Fees"}
                        />
                    }
                </div>
                <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                    <div>
                        <div className="row flex-nowrap">
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"1.00"}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (Number(competitionDetails.nominationFeeToPay)).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                     heading={'$' + (parseFloat((nomDiscountsToDeduct).toFixed(2))  + parseFloat((childDiscountsToDeduct).toFixed(2))).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (parseFloat((nominationGVAmount).toFixed(2))).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'$' + (Number(competitionDetails.nominationGSTToPay)).toFixed(2)}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column" >
                                <InputWithHead
                                    required="invoice"
                                    heading={'$' + (  parseFloat((competitionDetails.nominationFeeToPay).toFixed(2)) + parseFloat((competitionDetails.nominationGSTToPay).toFixed(2)) - (parseFloat((nominationGVAmount).toFixed(2)) + parseFloat((nomDiscountsToDeduct).toFixed(2))
                                                + parseFloat((childDiscountsToDeduct).toFixed(2)))).toFixed(2)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                < Divider className="mt-0 mb-0" />
            </div>
        )
    }

    competitionAffiliateView = (affiliateDetail) => {
        let childDiscountsToDeduct = affiliateDetail.childDiscountsToDeduct!= null ?
                        affiliateDetail.childDiscountsToDeduct : 0;
        let governmentVoucherAmount = affiliateDetail.governmentVoucherAmount!= null ?
                                    affiliateDetail.governmentVoucherAmount : 0;
        return (
            <div className="row" >
                <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                    {affiliateDetail && affiliateDetail.name &&
                        <InputWithHead
                            heading={affiliateDetail.name + " - Competition Fees"}
                            required="pr-3 justify-content-start"
                        />
                    }
                </div>
                <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                    <div>
                        <div className="row flex-nowrap">
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={"1.00"}
                                        required={"input-align-right"}
                                    />}
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={'$' + (Number(affiliateDetail.feesToPay)).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={'$' + (parseFloat((affiliateDetail.discountsToDeduct).toFixed(2))  + parseFloat((childDiscountsToDeduct).toFixed(2))).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={'$' + (parseFloat((governmentVoucherAmount).toFixed(2))).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        heading={'$' + (Number(affiliateDetail.feesToPayGST)).toFixed(2)}
                                        required={"input-align-right"}
                                    />}
                            </div>
                            <div className="col-sm invoice-right-column" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        required="invoice"
                                        heading={'$' + (parseFloat((affiliateDetail.feesToPay).toFixed(2)) + parseFloat((affiliateDetail.feesToPayGST).toFixed(2)) - parseFloat((affiliateDetail.discountsToDeduct).toFixed(2)) -
                                            parseFloat((childDiscountsToDeduct).toFixed(2)) - parseFloat((governmentVoucherAmount).toFixed(2))).toFixed(2)}
                                    />}
                            </div>

                        </div>
                    </div>
                </div>
                < Divider className="mt-0 mb-0" />
            </div>
        )
    }

    nominationAffiliateView = (affiliateDetail) => {
        let nominationGVAmount = affiliateDetail.nominationGVAmount!= null ?
        affiliateDetail.nominationGVAmount : 0;
        let nomDiscountsToDeduct = affiliateDetail.nomDiscountsToDeduct ? affiliateDetail.nomDiscountsToDeduct : 0;
        let childDiscountsToDeduct = affiliateDetail.nomChildDiscountsToDeduct!= null ?
                    affiliateDetail.nomChildDiscountsToDeduct : 0;
        return (
            <div className="row" >
                <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                    {affiliateDetail && affiliateDetail.name &&
                        <InputWithHead
                            heading={affiliateDetail.name + " - Nomination Fees"}
                            required={"justify-content-start"}
                        />
                    }
                </div>
                <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                    <div>
                        <div className="row flex-nowrap">
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={"1.00"}
                                        required={"input-align-right"}
                                    />}
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={'$' + (Number(affiliateDetail.nominationFeeToPay)).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                    heading={'$' + (parseFloat((nomDiscountsToDeduct).toFixed(2))  + parseFloat((childDiscountsToDeduct).toFixed(2))).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={'$' + (parseFloat((nominationGVAmount).toFixed(2))).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        heading={'$' + (Number(affiliateDetail.nominationGSTToPay)).toFixed(2)}
                                        required={"input-align-right"}
                                    />}
                            </div>
                            <div className="col-sm invoice-right-column" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        required="invoice"
                                        heading={'$' + (parseFloat((affiliateDetail.nominationFeeToPay).toFixed(2)) + parseFloat((affiliateDetail.nominationGSTToPay).toFixed(2)) - (parseFloat((nominationGVAmount).toFixed(2)) + parseFloat((nomDiscountsToDeduct).toFixed(2))
                                                    +  parseFloat((childDiscountsToDeduct).toFixed(2)))).toFixed(2)}
                                    />}
                            </div>

                        </div>
                    </div>
                </div>
                < Divider className="mt-0 mb-0" />
            </div>
        )
    }

    ////////form content view
    contentView = (result) => {
        const { tShirtSizeList } = this.props.commonReducerState;
        let {invoiceData} = this.props.stripeState;
        let data = invoiceData!= null ? invoiceData.compParticipants : [];
        const shopUniqueKey = this.props.location.state ? this.props.location.state.shopUniqueKey : null;

        return (
            <div className="content-view pt-0 pb-0">
                <div className="invoice-row-view" >
                    <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                        <InputWithHead
                            heading={"Description"}
                            required={"justify-content-start"}
                        />
                    </div>
                    <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                        <div className="invoice-row-view flex-nowrap">
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Quantity"}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Unit Price"}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Discount"}
                                    required={"input-align-right"}
                                />
                            </div>
                            {!shopUniqueKey &&
                                <div className="col-sm invoice-description" >
                                    <InputWithHead
                                        heading={"Government Voucher"}
                                        required={"input-align-right"}
                                    />
                                </div>
                            }
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"GST"}
                                    required={"input-align-right"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column" >
                                <InputWithHead
                                    heading={"Amount AUD"}
                                    required={"input-align-right"}
                                />
                            </div>
                        </div>
                    </div>
                    <Divider className="mt-0 mb-0" />
                </div>

                {data && data.length > 0 && data.map((item, participantIndex) => {
                     let isTeamReg = (item.isTeamRegistration != undefined ? item.isTeamRegistration : 0);
                     let regName = isTeamReg == 1 ? AppConstants.teamRegistration : AppConstants.registration;
                     let tShirtDetails = tShirtSizeList ? tShirtSizeList.find(x => x.id == item.tShirtSizeRefId) : null;
                     let tShirtName = tShirtDetails ? tShirtDetails.name : null;
                    return(
                        <div>
                            {(item.membershipProducts || []).map((mem, memIndex) =>{
                                 let competitionDetails = mem && mem.fees.competitionOrganisorFee;
                                 let membershipDetail = mem && mem.fees.membershipFee;
                                 let affiliateDetail = mem && mem.fees.affiliateFee;
                                 let totalAmount = mem && (Number(mem.feesToPay) - Number(mem.discountsToDeduct) -
                                 Number(mem.childDiscountsToDeduct!= null ? mem.childDiscountsToDeduct : 0) -
                                 Number(mem.governmentVoucherAmount!= null ? mem.governmentVoucherAmount : 0));
                                 let mTypeName = mem && mem.membershipTypeName!= null ?  mem.membershipTypeName : '';
                                 let typeName = mTypeName;
                                 let mProductName = mem && mem.membershipProductName!= null ? mem.membershipProductName : '';
                                 return (
                                    <div>
                                    <div className="invoice-row-view" >
                                            <div className="invoice-col-View pb-0 pl-0" >
                                                <div className="invoice-col-View pb-0 pl-0 pr-0" >
                                                    {item && item.firstName &&
                                                        <InputWithHead
                                                            heading=
                                                            {isTeamReg == 1 || item.isTeamRegistration == null ?
                                                                mem.divisionName ?
                                                                    regName + " - " + typeName + " " + mem.firstName + " " + mem.lastName
                                                                    + ", Team - " + item.teamName + ", " + item.competitionName + " - "+ mem.divisionName
                                                                    :
                                                                    regName + " - " + typeName + " " + mem.firstName + " " + mem.lastName
                                                                    + ", Team - " + item.teamName + ", " + item.competitionName
                                                                :
                                                                mem.divisionName ?
                                                                    mem.membershipTypeName == "Player - NetSetGo" ?
                                                                    regName + " - " + typeName + " " + "T Shirt" + " - " + mem.firstName + " " + mem.lastName
                                                                    + " - " + tShirtName + ", " + item.competitionName + " - "+ mem.divisionName
                                                                    :
                                                                    regName + " - " + typeName + " " + mem.firstName + " " + mem.lastName
                                                                    + ", " + item.competitionName + " - "+ mem.divisionName
                                                                    :
                                                                    mem.membershipTypeName == "Player - NetSetGo" ?
                                                                    regName + " - " + typeName + " " + "T Shirt" + " - " + mem.firstName + " " + mem.lastName
                                                                    + " - " + tShirtName + ", " + item.competitionName
                                                                    :
                                                                    regName + " - " + typeName + " " + mem.firstName + " " + mem.lastName
                                                                    + ", " + item.competitionName

                                                            }
                                                            required={"justify-content-start"}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                            < Divider className="mt-0 mb-0" />
                                        </ div>
                                        {affiliateDetail &&
                                            this.competitionAffiliateView(affiliateDetail)
                                        }
                                         {affiliateDetail && affiliateDetail.nominationFeeToPay > 0 &&
                                            this.nominationAffiliateView(affiliateDetail)
                                        }

                                        {competitionDetails &&
                                            this.competitionOrganiserView(competitionDetails)
                                        }
                                         {competitionDetails && competitionDetails.nominationFeeToPay > 0 &&
                                            this.nominationCompOrgView(competitionDetails)
                                        }

                                        {membershipDetail != null &&
                                            this.membershipProductView(membershipDetail, mProductName, mTypeName)
                                        }

                                        <div className="d-flex row d-flex justify-content-end" >
                                            <div className="col-sm " />
                                            <div className="col-sm pl-0 pr-0 d-flex justify-content-end p-0">
                                                <div className="col-8 pr-0" style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <InputWithHead
                                                        heading={"Total"}
                                                    />
                                                </div>
                                                <div className="col-sm invoice-right-column pr-0">
                                                    <InputWithHead
                                                        required="invoice"
                                                        heading={totalAmount ? "$" + (totalAmount).toFixed(2) : "$0.00"}
                                                    />
                                                </div>
                                            </div>
                                            {data.length - 1 !== participantIndex &&
                                                < Divider className="mt-0 mb-0" />

                                            }
                                        </div>

                                    </div>
                                 )
                            })
                        }
                        </div>
                    )
                })
                }
                {
                    this.shopView()
                }
            </div>
        )
    }

    totalInvoiceView = (result) => {
        let {invoiceData} = this.props.stripeState;
        let total = invoiceData!= null ? invoiceData.total: null;
        let paymentType = this.props.location.state ? this.props.location.state.paymentType : null;
        let userDetail = invoiceData != null ? invoiceData.billTo: null;
        return (
            <div className="content-view">
                <div className="drop-reverse" >
                    <div className="col-sm ">
                        {/* {!invoiceDisabled &&
                            <TextArea
                                placeholder="Text Area"
                            />
                        } */}
                    </div>
                    <div className="col-sm pl-0 pr-0">
                        <div className="col-sm d-flex justify-content-end p-0">
                            <div className="col-8 pr-0" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    // required={"pr-4"}
                                    heading={"Subtotal"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column pr-0">
                            <InputWithHead
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={total && total != null ? '$' + total.subTotal.toFixed(2) : '$0.00'}
                            />
                            </div>
                        </div>
                        <div className="col-sm d-flex justify-content-end p-0">
                            <div className="col-8  pr-0" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pt-0"}
                                    heading={"GST"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column pr-0">
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={total && total != null ? '$' + total.gst.toFixed(2) : '$0.00'}
                            />
                            </div>
                        </div>
                        {
                            total && total.charityValue &&
                            <div className="col-sm d-flex justify-content-end p-0">
                                <div className="col-8 pr-0" style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <InputWithHead
                                        required={"pt-0"}
                                        heading={"Charity"}
                                    />
                                </div>

                                    <div className="col-sm invoice-right-column pr-0">
                                        <InputWithHead
                                            required={"pt-0"}
                                            style={{ display: "flex", justifyContent: 'flex-start' }}
                                            heading={total ?  '$' + total.charityValue.toFixed(2) : '$0.00'}
                                        />
                                    </div>
                            </div>
                        }
                        <div className="col-sm d-flex justify-content-end p-0">
                            <div className="invoice-amount-border col-8 px-0 d-flex justify-content-end">
                                <InputWithHead
                                    required={"pt-3"}
                                    heading={"Total"}
                                />
                            </div>
                            <div className="invoice-amount-border col-sm invoice-right-column pr-0">
                                <InputWithHead
                                    required={"pt-3"}
                                    style={{ display: "flex", justifyContent: 'flex-start' }}
                                    heading={(total && total != null ?  '$' + total.total.toFixed(2) : '$0.00')}
                                />
                            </div>
                        </div>
                        <div className="col-sm d-flex justify-content-end p-0">
                            <div className="col-8 px-0  d-flex justify-content-end">
                                <InputWithHead
                                    required={"pt-3"}
                                    heading={"Transaction Fee"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column pr-0">
                                <InputWithHead
                                    required={"pt-3"}
                                    style={{ display: "flex", justifyContent: 'flex-start' }}
                                    heading={(total && total != null ? '$' + total.transactionFee.toFixed(2) : '$0.00')}
                                />
                            </div>
                        </div>
                        <div className="col-sm d-flex justify-content-end p-0">
                            <div className="invoice-amount-border col-8 pr-0 d-flex justify-content-end">
                                <InputWithHead
                                    required={"pt-3"}
                                    heading={!this.state.invoiceDisabled ? "Amount Due" : (paymentType == 'card') ? "Amount Paid" : "Amount Pending"}
                                />
                            </div>
                            <div className="invoice-amount-border col-sm invoice-right-column pr-0">
                                <InputWithHead
                                    required={"pt-3"}
                                    style={{ display: "flex", justifyContent: 'flex-start' }}
                                    heading={(total && total != null ? '$' +total.targetValue.toFixed(2) : '$0.00')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm pt-5 px-0 d-flex invoiceImage">
                        <label className="d-flex align-items-center">
                            {userDetail && userDetail.state != "New South Wales" &&
                            <img
                                src={AppImages.netballImages}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballImages;
                                }}
                            />
                            }
                        </label>
                    </div>
                    <div className="col-sm pt-5 px-0 invoiceImageMain ">
                        <label className="d-flex align-items-center">
                            <img
                                src={AppImages.netballLogoMain}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballLogoMain;
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div >
        )
    }

    shopView = () => {
        let {invoiceData} = this.props.stripeState;
        let shopProducts = invoiceData!= null ? invoiceData.shopProducts : []
        let totalAmount = 0;
        (shopProducts || []).map((x) =>{
            totalAmount += x.totalAmt;
        })
        return(
            <div>
                {(shopProducts || []).map((item, index) =>(
                    <div className="row" key={index}>
                    <div className="col-md-3 col-8 pb-0 pr-0 pl-0 " >
                        {item.productName &&
                            <InputWithHead
                                heading={`${item.organisationName} - ${item.productName} ${item.variantName ? '- ' + item.variantName : ''}${item.optionName ? '('+ item.optionName+')' : ''} - Shop Product Fees`}
                                required="pr-3 justify-content-start"
                            />
                        }
                    </div>
                    <div className="col-md-9 col-4 pb-0 pl-0 pr-0" >
                        <div>
                            <div className="row flex-nowrap">
                                <div className="col-sm invoice-description" >
                                    <InputWithHead
                                        heading={(Number(item.quantity)).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                </div>
                                <div className="col-sm invoice-description" >
                                    <InputWithHead
                                        heading={'$' + (Number(item.amount)).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                </div>
                                <div className="col-sm invoice-description" >
                                    <InputWithHead
                                        heading={"0.00"}
                                        required={"input-align-right"}
                                    />
                                </div>
                                <div className="col-sm invoice-description" >
                                    < InputWithHead
                                        heading={'$' + (Number(item.tax)).toFixed(2)}
                                        required={"input-align-right"}
                                    />
                                </div>
                                <div className="col-sm invoice-right-column" >
                                        < InputWithHead
                                            required="invoice"
                                            heading={'$' + (Number(item.totalAmt)).toFixed(2)}
                                        />
                                </div>

                            </div>
                        </div>
                    </div>
                    <Divider className="mt-0 mb-0" />
                    </div>
                ))}
                {isArrayNotEmpty(shopProducts) && (
                    <div className="d-flex row d-flex justify-content-end" >
                        <div className="col-sm " />
                        <div className="col-sm pl-0 pr-0  d-flex justify-content-end p-0">
                            <div className="col-8 pr-0 d-flex justify-content-end">
                                <InputWithHead
                                    heading={"Total"}
                                />
                            </div>
                            <div className="col-sm invoice-right-column pr-0">
                                <InputWithHead
                                    required="invoice"
                                    heading={totalAmount ? "$" + (totalAmount).toFixed(2) : "N/A"}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
         )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let invoiceDisabled = this.state.invoiceDisabled
        return (
            <div className="container" >
                <div className="footer-view">
                    <div className="comp-buttons-view pt-5 pr-5">
                        {!invoiceDisabled &&
                            <Button
                                className="open-reg-button"
                                htmlType="submit"
                                type="primary"
                                // onClick={() => this.navigatePaymentScreen()}>
                                onClick={() => this.saveInvoiceAPICall()}>
                                {AppConstants.pay}
                            </Button>}
                    </div>
                </div>
            </div>
        )
    }

    createPdf = (html) => Doc.createPdf(html);

    thankYouRegisteringView = () => {
        let userId = getUserId();
        const shopUniqueKey = this.props.location.state ? this.props.location.state.shopUniqueKey : null;

        return(
            <div className="thank-you-registering-view">
                <div>
                    <div className="thank-you-registering-view-title">
                        {shopUniqueKey ? AppConstants.thankYouPurchasing : AppConstants.thankYouRegistering}
                    </div>
                    <div className="thank-you-registering-view-content">
                        {
                            shopUniqueKey ? AppConstants.emailConfirmShopMessage
                                :
                                userId != 0 ?
                                    AppConstants.emailConfirmExistingUserMessage
                                    :
                                    AppConstants.emailConfirmNewUserMessage
                        }
                    </div>
                </div>
                {userId != 0 ? (
                    <div className="btn-text-common pointer" style={{marginLeft: "auto", marginRight: 0, minWidth: 85 }} onClick={() => this.gotoUserPage(userId)}>{AppConstants.yourProfile}</div>
                ) : (
                    <div className="btn-text-common pointer" style={{marginLeft: "auto", marginRight: 0 }} onClick={() => this.gotoUserPage(userId)}>{AppConstants.login}</div>
                )}
            </div>
        )
    }

    render() {
        let result = this.props.stripeState.getInvoicedata;
        const shopUniqueKey = this.props.location.state ? this.props.location.state.shopUniqueKey : null;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout>
                    {/* {this.headerView()} */}
                    <Content className="registration-form-wrapper mt-5">
                        <div className="formView mb-4" style={{ width: "100%" }}>
                            <div>{this.thankYouRegisteringView()}</div>
                            <PdfContainer createPdf={this.createPdf} showPdfButton={this.state.invoiceDisabled}>
                                {!shopUniqueKey && this.topView(result)}
                                {this.contentView(result)}
                                {this.totalInvoiceView(result)}
                            </PdfContainer>
                        </div>
                        <Loader visible={this.props.stripeState.onLoad} />
                    </Content>
                    {/* {this.footerView()} */}
                </Layout>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInvoice,
        onChangeCharityAction,
        saveInvoiceAction,
        getInvoiceStatusAction,
        netSetGoTshirtSizeAction,
        getShopInvoice
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        stripeState: state.StripeState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(RegistrationInvoice);

