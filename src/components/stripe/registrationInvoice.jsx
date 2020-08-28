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
} from "../../store/actions/stripeAction/stripeAction"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import history from "../../util/history";
import Doc from '../../util/DocService';
import PdfContainer from '../../util/PdfContainer';

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
    }


    componentDidMount() {
        let paymentSuccess = this.props.location.state ? this.props.location.state.paymentSuccess : false
       // console.log("paymentSuccess" + paymentSuccess)
        this.setState({ invoiceDisabled: paymentSuccess })
        this.getInvoiceStatusAPI()


    }

    getInvoiceStatusAPI = () => {
       // console.log("this.props.location.state.registrationId" + this.props.location.state.registrationId);
       let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
       let userRegId = this.props.location.state ? this.props.location.state.registrationId : null;
    //    let registrationId = null;
    //    let userRegId = '791e305e-9f1d-49a6-b9c3-6a2ca79b9364';
       this.props.getInvoiceStatusAction(registrationId, userRegId);
        //this.props.getInvoiceStatusAction('05c59bfc-9438-42e6-8917-4a60ed949281')
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
        if (stripeState.onLoad == false && this.state.checkStatusLoad === true) {
            this.setState({ checkStatusLoad: false });
           // let invoiceId = this.props.stripeState.invoiceId
            let invoiceId = 0
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
            //  let registrationId = null;
            //  let userRegId = "f59baf97-c9ed-4935-91a7-be330fb68c0b";
            this.props.getInvoice(registrationId, userRegId)
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
        let userDetail = invoiceData!= null ? invoiceData.billTo: null;
        let organisationLogo = invoiceData!= null ? invoiceData.organisationLogo : null;
        let invoiceDisabled = this.state.invoiceDisabled;
        return (
            <div className="content-view pt-4 pb-0 " >
                <div className="drop-reverse" >
                    <div className="col-sm pt-3"
                    >
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
                        <InputWithHead
                            heading={"Receipt No.1234497"}
                        />
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


                    <div className="col-sm-5 mb-5">
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

    membershipProductView = (membershipDetail, membershipProductName) => {
        let mOrganisationName = membershipDetail!= null ? membershipDetail.name : '';
        membershipProductName = membershipProductName!= null ? membershipProductName : '';
        return (
            < div className="row" >
                <div className="invoice-col-View pb-0 pr-0 pl-0" >
                    <InputWithHead
                        heading={mOrganisationName + "-" + membershipProductName + " Membership Fees"}
                    />
                </div>

                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                    <div>
                        < div className="row" >
                            <div className="col-sm invoice-description"  >
                                <InputWithHead
                                    heading={("1.00")}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(membershipDetail.feesToPay)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(membershipDetail.discountsToDeduct)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(membershipDetail.feesToPayGST)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm " >
                                <InputWithHead
                                    required="invoice"
                                    heading={(parseFloat((membershipDetail.feesToPay).toFixed(2)) + parseFloat((membershipDetail.feesToPayGST).toFixed(2)) - parseFloat((membershipDetail.discountsToDeduct).toFixed(2) )).toFixed(2)}
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
        return (
            <div className="row" >
                <div className="invoice-col-View pr-0 pl-0" >
                    {competitionDetails && competitionDetails.name &&
                        <InputWithHead
                            heading={competitionDetails.name + " - Competition Fees"}
                        />
                    }
                </div>
                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                    <div>
                        <div className="row">
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"1.00"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(competitionDetails.feesToPay)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(competitionDetails.discountsToDeduct)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(competitionDetails.feesToPayGST)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead
                                    required="invoice"
                                    heading={(  parseFloat((competitionDetails.feesToPay).toFixed(2)) + parseFloat((competitionDetails.feesToPayGST).toFixed(2) ) - parseFloat((competitionDetails.discountsToDeduct).toFixed(2) )).toFixed(2)}
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
        return (
            <div className="row" >
                <div className="invoice-col-View pb-0 pr-0 pl-0" >
                    {affiliateDetail && affiliateDetail.name &&
                        <InputWithHead
                            heading={affiliateDetail.name + " - Competition Fees"}
                        />
                    }
                </div>
                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                    <div>
                        <div className="row">
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={"1.00"}
                                    />}
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={(Number(affiliateDetail.feesToPay)).toFixed(2)}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={(Number(affiliateDetail.discountsToDeduct)).toFixed(2)}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        heading={(Number(affiliateDetail.feesToPayGST)).toFixed(2)}
                                    />}
                            </div>
                            <div className="col-sm" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        required="invoice"
                                        heading={(parseFloat((affiliateDetail.feesToPay).toFixed(2)) + parseFloat((affiliateDetail.feesToPayGST).toFixed(2)) - parseFloat((affiliateDetail.discountsToDeduct).toFixed(2) )).toFixed(2)}
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
        let {invoiceData} = this.props.stripeState;
        let data = invoiceData!= null ? invoiceData.compParticipants : []
        return (
            <div className="content-view pt-0 pb-0">
                <div className="invoice-row-view" >
                    <div className="invoice-col-View pb-0 pr-0 pl-0 " >
                        <InputWithHead
                            heading={"Description"}
                        />
                    </div>
                    <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                        <div className="invoice-row-view " >
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Quantity"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Unit Price"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"Discount"}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={"GST"}
                                />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead
                                    heading={"Amount AUD"}
                                />
                            </div>
                        </div>
                    </div>
                    <Divider className="mt-0 mb-0" />
                </div>

                {data && data.length > 0 && data.map((item, participantIndex) => {
                     let isTeamReg = (item.isTeamRegistration != undefined ? item.isTeamRegistration : 0);
                     let regName = isTeamReg == 1 ? AppConstants.teamRegistration : AppConstants.registration;
                    return(
                        <div>
                            {(item.membershipProducts || []).map((mem, memIndex) =>{
                                 let competitionDetails = mem && mem.fees.competitionOrganisorFee;
                                 let membershipDetail = mem && mem.fees.membershipFee;
                                 let affiliateDetail = mem && mem.fees.affiliateFee;
                                 let totalAmount = mem && (Number(mem.feesToPay) - Number(mem.discountsToDeduct));
                                 let mTypeName = mem && mem.membershipTypeName!= null ?  mem.membershipTypeName : '';
                                 let typeName = isTeamReg == 1 ? AppConstants.personRegistering : mTypeName;
                                 let mProductName = mem && mem.membershipProductName!= null ? mem.membershipProductName : '';
                                 return (
                                    <div>
                                    <div className="invoice-row-view" >
                                            <div className="invoice-col-View pb-0 pl-0" >
                                                <div className="invoice-col-View pb-0 pl-0 pr-0" >
                                                    {item && item.firstName &&
                                                        <InputWithHead
                                                            heading=
                                                            {mem.divisionName ?
                                                                regName + " - " + typeName + " " + item.firstName + " " + item.lastName
                                                                + ", " + item.competitionName + " - "+ mem.divisionName
                                                                :
                                                                regName + " - " + typeName + " " + item.firstName + " " + item.lastName
                                                                + ", " + item.competitionName
                                                            }
                                                        />
                                                    }
                                                </div>
                                            </div>
                                            < Divider className="mt-0 mb-0" />
                                        </ div>
                                        {affiliateDetail &&
                                            this.competitionAffiliateView(affiliateDetail)
                                        }

                                        {competitionDetails && 
                                            this.competitionOrganiserView(competitionDetails)
                                        }
                                        {membershipDetail != null &&
                                            this.membershipProductView(membershipDetail, mProductName)
                                        }        
            
                                        <div className="d-flex row d-flex justify-content-end" >
                                            <div className="invoice-total justify-content-end">
                                                <InputWithHead
                                                    heading={"Total"}
                                                />
                                            </div>
                                            <div className="invoice-total-Amount">
                                                <InputWithHead
                                                    required="invoice"
                                                    heading={"$" + totalAmount ? (totalAmount).toFixed(2) : "N/A"}
                                                />
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
            </div>
        )
    }

    totalInvoiceView = (result) => {
        let {invoiceData} = this.props.stripeState;
        let total = invoiceData!= null ? invoiceData.total: null;
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
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-4"}
                                    heading={"Subtotal"}
                                />
                            </div>
                            <InputWithHead
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={total && total != null ? total.subTotal : '0.00'}
                            />

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-5 pt-0"}
                                    heading={"GST"}
                                />
                            </div>
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={total && total != null ?  total.gst : '0.00'}
                            />
                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-5 pt-0"}
                                    heading={"Charity"}
                                />
                            </div>
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={total && total != null ?  total.charityValue : '0.00'}
                            />
                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="invoice-amount-border">
                                <InputWithHead
                                    required={"pr-4 pt-3"}
                                    heading={"Amount Due"}
                                />
                            </div>
                            <div className="invoice-amount-border">
                                <InputWithHead
                                    required={"pt-3"}
                                    style={{ display: "flex", justifyContent: 'flex-start' }}
                                    heading={"AUD" + " " + (total && total != null ?  total.targetValue : '0.00')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm pt-5 invoiceImage">
                        <label>
                            <img
                                src={AppImages.netballImages}
                                // alt="animated"
                                height="100%"
                                width="100%"
                                // style={{ borderRadius: 60 }}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballImages;
                                }}
                            />
                        </label>
                    </div>
                    <div className="col-sm pt-5 invoiceImageMain ">
                        <label>
                            <img
                                src={AppImages.netballLogoMain}
                                height="100%"
                                width="100%"
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

    render() {
        let result = this.props.stripeState.getInvoicedata
        console.log("result", result)
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout>
                    {this.headerView()}
                    <Content className="container">
                        <div className="formView">
                            <PdfContainer createPdf={this.createPdf} showPdfButton={this.state.invoiceDisabled}>
                                {this.topView(result)}
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
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        stripeState: state.StripeState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(RegistrationInvoice);

