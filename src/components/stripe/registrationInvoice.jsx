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
        }
    }


    componentDidMount() {
        this.getInvoiceStatusAPI()
    }

    getInvoiceStatusAPI = () => {
        this.props.getInvoiceStatusAction(this.props.location.state ? this.props.location.state.registrationId : null)
        // this.props.getInvoiceStatusAction("639")
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
            let invoiceId = this.props.stripeState.invoiceId
            this.props.getInvoice(this.props.location.state ? this.props.location.state.registrationId : null, invoiceId)
            // this.props.getInvoice("639", invoiceId)
        }
    }


    saveInvoiceAPICall = () => {
        let charitySelected = JSON.parse(JSON.stringify(this.props.stripeState.charitySelected))
        let finalCharityPost = charitySelected.competitionId == 0 ? null : charitySelected
        let payload = {
            registrationId: this.props.location.state ? this.props.location.state.registrationId : null,
            // registrationId: 634,
            invoiceId: this.props.stripeState.invoiceId,
            transactionId: this.props.stripeState.transactionId,
            charity: finalCharityPost,
        }
        console.log("payload", payload)
        this.props.saveInvoiceAction(payload)
        this.setState({ loading: true });
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                    </div>
                </div>
            </Header >
        )
    }

    ///top header view
    topView = (result) => {
        let userDetail = result.length > 0 ? result[0].billTo : []
        return (
            <div className="content-view pt-4 pb-0 " >
                <div className="drop-reverse" >
                    <div className="col-sm "
                    >
                        <label className="invoice-description">
                            <img
                                src={AppImages.squareImage}
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
                        {userDetail && (userDetail.suburb || userDetail.street1) &&
                            < Descriptions >
                                <Descriptions.Item className="pb-0"  >
                                    {userDetail.suburb} {" "}
                                    {userDetail.street1} {' '}{userDetail.street2}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && userDetail.postalCode &&
                            < Descriptions >
                                <Descriptions.Item >
                                    {userDetail.postalCode} {" "}
                                </Descriptions.Item>
                            </Descriptions>
                        }

                        {/* </div> */}
                    </div>
                    <div className="col-sm pt-5">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                </div>

            </div>
        )
    }


    membershipProductView = (membershipDetail) => {
        return (
            < div className="row" >
                <div className="invoice-col-View pb-0 pr-0 pl-0" >
                    <InputWithHead
                        heading={membershipDetail.mOrganisationName + "-" + membershipDetail.membershipProductName + " Membership Fees"}
                    />
                </div>

                <div className="invoice-col-View-30 pb-0 pl-0 pr-0" >
                    <div>
                        < div className="row" >
                            <div className="col-sm invoice-description"  >
                                <InputWithHead
                                    // required='justify-content-center'
                                    heading={("1.00")}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(membershipDetail.mCasualFee) + Number(membershipDetail.mSeasonalFee)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'N/A'}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(membershipDetail.mCasualGst) + Number(membershipDetail.mSeasonalGst)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm " >
                                <InputWithHead
                                    required="invoice"
                                    heading={(Number(membershipDetail.mCasualFee) + Number(membershipDetail.mSeasonalFee) + Number(membershipDetail.mCasualGst) + Number(membershipDetail.mSeasonalGst)).toFixed(2)}
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
                {/* < Divider className="mt-0 mb-0" /> */}
                <div className="invoice-col-View pr-0 pl-0" >
                    {competitionDetails && competitionDetails.cOrganisationName &&
                        <InputWithHead
                            heading={competitionDetails.cOrganisationName + " Competition Fees"}
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
                                    heading={(Number(competitionDetails.cCasualFee) + Number(competitionDetails.cSeasonalFee)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={'N/A'}
                                />
                            </div>
                            <div className="col-sm invoice-description" >
                                <InputWithHead
                                    heading={(Number(competitionDetails.cCasualGst) + Number(competitionDetails.cSeasonalGst)).toFixed(2)}
                                />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead
                                    required="invoice"
                                    heading={((Number(competitionDetails.cCasualFee) + Number(competitionDetails.cSeasonalFee)) + (Number(competitionDetails.cCasualGst) + Number(competitionDetails.cSeasonalGst))).toFixed(2)}
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
                    {affiliateDetail && affiliateDetail.aOrganisationName &&
                        <InputWithHead
                            heading={affiliateDetail.aOrganisationName + " Competition Fees"}
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
                                        heading={(Number(affiliateDetail.aCasualFee) + Number(affiliateDetail.aSeasonalFee)).toFixed(2)}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    <InputWithHead
                                        heading={'N/A'}
                                    />
                                }
                            </div>
                            <div className="col-sm invoice-description" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        heading={(Number(affiliateDetail.aCasualGst) + Number(affiliateDetail.aSeasonalGst)).toFixed(2)}
                                    />}
                            </div>
                            <div className="col-sm" >
                                {affiliateDetail &&
                                    < InputWithHead
                                        required="invoice"
                                        heading={((Number(affiliateDetail.aCasualFee) + Number(affiliateDetail.aSeasonalFee)) + (Number(affiliateDetail.aCasualGst) + Number(affiliateDetail.aSeasonalGst))).toFixed(2)}
                                    />}
                            </div>

                        </div>
                    </div>
                </div>
                {/* {data.length - 1 !== participantIndex && */}
                < Divider className="mt-0 mb-0" />

                {/* } */}
            </div>
        )
    }



    ////////form content view
    contentView = (result) => {
        let data = result.length > 0 ? result[0].fees : []
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


                {/* {data.membership && data.membership.length > 0 && data.membership.map((membershipItem, membershipIndex) => {
                    return ( */}
                {data && data.length > 0 && data.map((participantItem, participantIndex) => {
                    let competitionDetails = participantItem && participantItem.competitionDetail
                    let userDetail = participantItem.userDetail && participantItem.userDetail
                    let membershipDetail = participantItem && participantItem.membershipDetail
                    let affiliateDetail = participantItem && participantItem.affiliateDetail
                    let totalAmount = participantItem && participantItem.totalAmount
                    return (
                        <div>
                            < div className="invoice-row-view" >
                                <div className="invoice-col-View pb-0 pl-0" >
                                    <div className="invoice-col-View pb-0 pl-0 pr-0" >
                                        {userDetail && userDetail.firstName &&
                                            <InputWithHead
                                                heading=
                                                {competitionDetails.competitionDivisionName ?
                                                    "Registration - " + membershipDetail.mTypeName + " " + userDetail.firstName + " " + userDetail.lastName
                                                    + ", " + competitionDetails.competitionName + ", " + competitionDetails.competitionDivisionName
                                                    :
                                                    "Registration - " + membershipDetail.mTypeName + " " + userDetail.firstName + " " + userDetail.lastName
                                                    + ", " + competitionDetails.competitionName
                                                }
                                            />
                                        }
                                    </div>

                                    {/* {userDetail && userDetail.suburb &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0 pt-0" >
                                                {userDetail.suburb}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }

                                    {userDetail && userDetail.street1 &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0" >
                                                {userDetail.street1} {" "}{userDetail.street2}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }
                                    {userDetail && userDetail.PhoneNo &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0" >
                                                {userDetail.PhoneNo}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }
                                    {userDetail && userDetail.postalCode &&
                                        <Descriptions >
                                            <Descriptions.Item  >
                                                {userDetail.postalCode}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    } */}
                                </div>
                                < Divider className="mt-0 mb-0" />
                            </ div>
                            {affiliateDetail &&
                                this.competitionAffiliateView(affiliateDetail)
                            }
                            {this.competitionOrganiserView(competitionDetails)}
                            {this.membershipProductView(membershipDetail)}


                            <div className="d-flex row d-flex justify-content-end" >
                                <div className="invoice-total justify-content-end">
                                    <InputWithHead
                                        heading={"Total"}
                                    />
                                </div>
                                <div className="invoice-total-Amount">
                                    <InputWithHead
                                        required="invoice"
                                        heading={"$" + totalAmount ? (totalAmount.totalSum).toFixed(2) : "N/A"}
                                    />
                                </div>
                                {data.length - 1 !== participantIndex &&
                                    < Divider className="mt-0 mb-0" />

                                }
                            </div>

                        </div>
                    )
                }
                )
                }




            </div >
        )
    }


    charityCompetitionIdChange = (value, key) => {
        this.props.onChangeCharityAction(value, key)
    }

    charitySelectedIdChange = (value, key, charityItem) => {
        this.props.onChangeCharityAction(value, key, charityItem)
    }


    charityRoundUpView = () => {
        let charityRoundUpData = this.props.stripeState.charityRoundUpFilter
        console.log("charityRoundUpData", charityRoundUpData)
        let charitySelected = this.props.stripeState.charitySelected
        return (
            <div className="d-flex justify-content-start mb-5">
                <div  >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.charityCompetitionIdChange(e.target.value, "competitionId")}
                        value={charitySelected.competitionId}
                    >
                        {charityRoundUpData.length > 0 && charityRoundUpData.map((item, index) => {
                            return (
                                <div>
                                    <Radio key={item.competitionId} value={item.competitionId}>{item.competitionId == 0 ? (item.charityTitle) : ("Support " + item.charityTitle)}</Radio>
                                    <div className="d-flex justify-content-start pl-5">
                                        <span className="roundUpDescription-text">{item.roundUpDescription}</span>
                                    </div>
                                    <div className="ml-5">
                                        <Radio.Group
                                            className="reg-competition-radio"
                                            onChange={e => this.charitySelectedIdChange(e.target.value, "charitySelectedId", item)}
                                            value={charitySelected.charitySelectedId}
                                        >
                                            {item.charityDetail.length > 0 && item.charityDetail.map((charityRoundUpItem, charityRoundUpIndex) => {
                                                return (
                                                    <Radio key={charityRoundUpItem.charitySelectedId} value={charityRoundUpItem.charitySelectedId}>{charityRoundUpItem.charitySelectedDescription}</Radio>
                                                )
                                            })}
                                        </Radio.Group>
                                    </div>
                                </div>
                            )
                        })}
                    </Radio.Group>

                </div>

            </div>
        )
    }


    totalInvoiceView = (result) => {
        let subTotalFees = this.props.stripeState.subTotalFees
        let subTotalGst = this.props.stripeState.subTotalGst
        let amountTotal = this.props.stripeState.amountTotal
        let charitySelected = this.props.stripeState.charitySelected
        let charityRoundUpData = this.props.stripeState.charityRoundUpFilter
        let showCharity = isArrayNotEmpty(charityRoundUpData) && isArrayNotEmpty(charityRoundUpData[0].charityDetail)
        console.log("showCharity", showCharity)
        return (
            <div className="content-view">
                {showCharity &&
                    <div className="charity-invoice-div">
                        <span className="charity-invoice-heading">{"Charity Support"}</span>
                    </div>}
                {showCharity && this.charityRoundUpView(result)}
                {showCharity &&
                    <div className="charity-invoice-div mb-5">
                        <span className="charity-invoice-heading">{"Total Charity Amount: $" + charitySelected.charityValue}</span>
                    </div>
                }
                <div className="drop-reverse" >
                    <div className="col-sm ">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                    <div className="col-sm pl-0 pr-0"
                    >
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-4"}
                                    heading={"Subtotal"}
                                />
                            </div>
                            <InputWithHead
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={subTotalFees !== 0 ? subTotalFees.toFixed(2) : '0'}
                            />

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div className="col-sm-8" style={{ display: "flex", justifyContent: "flex-end" }}>
                                <InputWithHead
                                    required={"pr-4 pt-0"}
                                    heading={"GST"}
                                />
                            </div>
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={subTotalGst !== 0 ? subTotalGst.toFixed(2) : '0'}
                            />

                        </div>
                        <div className="row" >
                            <div className="col-sm" />
                            <div className="col-sm"  >
                                <div style={{ display: 'flex', height: "1px", justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.65)" }}
                                >
                                </div>
                            </div>

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>

                            <InputWithHead
                                required={"pr-4 pt-0"}
                                heading={"Amount Due"}
                            />
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={"AUD" + " " + Number(amountTotal).toFixed(2)}
                            />
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

    // ////navigate to stripe payment screen
    // navigatePaymentScreen = () => {
    //     history.push("/checkoutPayment", {
    //         registrationId: this.props.location.state ? this.props.location.state.registrationId : null,
    //     })
    // }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="container" >
                <div className="footer-view">
                    <div className="comp-buttons-view pt-5 pr-5">
                        <Button
                            className="open-reg-button"
                            htmlType="submit"
                            type="primary"
                            // onClick={() => this.navigatePaymentScreen()}>
                            onClick={() => this.saveInvoiceAPICall()}>
                            {AppConstants.pay}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }


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
                            {this.topView(result)}
                            {this.contentView(result)}
                            {this.totalInvoiceView(result)}
                        </div>
                        <Loader visible={this.props.stripeState.onLoad} />
                    </Content>
                    {this.footerView()}
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

