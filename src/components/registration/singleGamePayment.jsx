import React, { useState, Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    Table,
    DatePicker,
    Radio, Form, Modal, InputNumber, message
} from "antd";
import {
    CardElement,
    Elements,
    useElements,
    useStripe, AuBankAccountElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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
import { isArrayNotEmpty } from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import { getSingleGameDataAction, updateSingleFeeAction } from
    '../../store/actions/registrationAction/registrationProductsAction';
import StripeKeys from "../stripe/stripeKeys";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;


const stripePromise = loadStripe(StripeKeys.publicKey);

var screenProps = null;

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

const CheckoutForm = (props) => {
    const [error, setError] = useState(null);
    const [bankError, setBankError] = useState(null)
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [bankResult, setBankResult] = useState(false);
    const [clientSecretKey, setClientKey] = useState("")

    const [selectedPaymentOption, setUser] = useState({
        cash: false,
        direct: false,
        credit: false,
        selectedOption: 0
    });


    const stripe = useStripe();
    const elements = useElements();
    let paymentOptions = props.paymentOptions;
    let payload = props.payload;
    let mainProps = props.mainProps;
    let registrationUniqueKey = props.registrationUniqueKey;

    const handleChange = async (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            if (event.complete) {
                if (elements) {
                    const card = elements.getElement(CardElement);
                    if (card != undefined) {
                        console.log("card", card)
                        const cardToken = await stripe.createToken(card);
                        if (cardToken.token == undefined) {
                            message.error(cardToken?.error?.message);
                            setError(cardToken?.error?.message);
                        }
                        else if (cardToken.token != undefined) {

                            const country = cardToken.token.card.country;
                            const brand = cardToken.token.card.brand;
                            if (country != "AU") {
                                if (brand == "American Express") {
                                    mainProps.updateSingleFeeAction(1, "International_AE", 0, "total", null);
                                }
                                else {
                                    mainProps.updateSingleFeeAction(1, "International_CC", 0, "total", null);
                                }
                            }
                            else {
                                mainProps.updateSingleFeeAction(1, "DOMESTIC_CC", 0, "total", null);
                            }
                        }
                    }
                }
            }
            setError(null);
        }
    }

    const changePaymentOption = (e, key) => {
        if (key === "credit") {

            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "credit": true,
                "direct": false,
                "cash": false,
                "selectedOption": "card"
            });
        }
    }



    // Handle form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event)
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        console.log(event.target)
        console.log("Payload", payload);
        const card = elements.getElement(CardElement);
        console.log(card)
        if (card) {
            const result = await stripe.createToken(card)
            props.onLoad(true)
            if (result.error) {
                let message = result.error.message
                // Inform the user if there was an error.
                setError(message);
                props.onLoad(false)
            } else {
                setError(null);
                // Send the token to your server.
                console.log("Result", result);
                stripeTokenHandler(result.token, props, selectedPaymentOption.selectedOption, null, null, payload, registrationUniqueKey);
            }
        }
        else {
            message.config({
                maxCount: 1, duration: 0.9
            })
            message.error(AppConstants.selectedPaymentOption)
        }
    }

    return (
        // className="content-view"
        <div>
            <form id='my-form' className="form" onSubmit={handleSubmit} >
                {(paymentOptions.length > 0) ?
                    <div className="content-view pt-5">
                        {(paymentOptions || []).map((pay, pIndex) => (
                            <div>
                                {pay.securePaymentOptionRefId == 2 &&
                                    <div className="row">
                                        <div className='col-sm'>
                                            <Radio key={"1"} onChange={(e) => changePaymentOption(e, "credit")}
                                                className="payment-type-radio-style"
                                                checked={selectedPaymentOption.credit}>{AppConstants.creditCard}</Radio>
                                            {selectedPaymentOption.credit == true &&
                                                <div className="pt-5">
                                                    <CardElement
                                                        id="card-element"
                                                        options={CARD_ELEMENT_OPTIONS}
                                                        onChange={handleChange}
                                                        className='StripeElement'
                                                    />
                                                    {error && <div className="card-errors" role="alert">{error}</div>}
                                                    <div
                                                        style={{ marginTop: "5px" }}
                                                    >{AppConstants.creditCardMsg}</div>
                                                </div>

                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    </div> :
                    <div className="content-view pt-5 secure-payment-msg">
                        {AppConstants.securePaymentMsg}
                        <div style={{ fontWeight: "bold" }}>
                            {AppConstants.submitButtonPressDescription}
                        </div>
                    </div>
                }
                <div className="mt-5">
                    <div style={{ padding: 0 }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            {(paymentOptions.length > 0) ?
                                <Button
                                    id="submit"
                                    style={{ textTransform: "uppercase" }}
                                    className="open-reg-button"
                                    htmlType="submit"
                                    type="primary"
                                >
                                    {AppConstants.submit}
                                </Button>
                                : null}
                        </div>
                    </div>
                </div>
            </form >

        </div >
    );
}

class SingleGamePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCardView: false,
            payload: null,
            productModalVisible: false,
            registrationUniqueKey: null,
            id: null,
            onLoad: false
        };
    }

    componentDidMount() {
        let payload = this.props.location.state ? this.props.location.state.data : null;
        this.setState({ payload: payload, registrationUniqueKey: payload.registrationId });
        this.getApiInfo(payload);
    }
    componentDidUpdate(nextProps) {

    }

    getApiInfo = (payload) => {

        console.log("payload", payload);
        this.props.getSingleGameDataAction(payload);
    }

    goBack = () => {
        history.push({ pathname: '/userPersonal', state: { tabKey: "1" } });
    }
    contentView = () => {
        return (
            <div style={{ display: "flex" }}>
                {this.paymentLeftView()}
                {this.paymentRighttView()}
            </div>
        );
    }

    paymentLeftView = () => {
        const { singlePaymentData } = this.props.registrationProductState;
        let securePaymentOptions = singlePaymentData != null ? singlePaymentData.securePaymentOptions : [];

        return (
            <div className="col-sm-8 product-left-view outline-style">
                <div className="product-text-common" style={{ fontSize: 22 }}>
                    {AppConstants.securePaymentOptions}
                </div>
                <div>
                    <Elements stripe={stripePromise} >
                        <CheckoutForm onLoad={(status) => this.setState({ onLoad: status })} paymentOptions={securePaymentOptions}
                            payload={singlePaymentData} mainProps={this.props} registrationUniqueKey={this.state.registrationUniqueKey} />
                    </Elements>
                </div>
            </div>
        )
    }

    paymentRighttView = () => {
        return (
            <div className="product-right-view">
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    yourOrderView = () => {
        const { singlePaymentData } = this.props.registrationProductState;
        let compParticipants = singlePaymentData != null ?
            isArrayNotEmpty(singlePaymentData.compParticipants) ?
                singlePaymentData.compParticipants : [] : [];
        let total = singlePaymentData != null ? singlePaymentData.total : null;

        return (
            <div className="outline-style " style={{ padding: "36px 36px 22px 20px" }}>
                <div className="product-text-common" style={{ fontSize: 21 }}>
                    {AppConstants.yourOrder}
                </div>
                {(compParticipants || []).map((item, index) => {
                    return (
                        <div style={{ paddingBottom: 12 }} key={item.participantId}>

                            <div className="inter-medium-w500" style={{ marginTop: "17px" }}>
                                {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                            </div>
                            {(item.membershipProducts || []).map((mem, memIndex) => (
                                <div key={mem.competitionMembershipProductTypeId + "#" + memIndex}>
                                    <div className="subtitle-text-common mt-10" style={{ display: "flex" }}>
                                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{mem.membershipTypeName + (mem.divisionId != null ? ' - ' + mem.divisionName : '')}</div>
                                        <div className="pr-5">
                                            <div style={{ display: 'flex' }}>
                                                <div>
                                                    <InputWithHead
                                                        style={{ height: '40px', width: '73px' }}
                                                        value={total.noOfMatch}
                                                        placeholder=" "
                                                        type={"number"}
                                                        min="1"
                                                        onChange={(e) => this.props.updateSingleFeeAction(e.target.value ? e.target.value : 1, "noOfMatch", 0, "total", null)}
                                                    />
                                                </div>
                                                <div className="counter">
                                                    <span className="plus" onClick={() => this.props.updateSingleFeeAction(total.noOfMatch, "noOfMatch", 0, "total", "increment")}>+</span>
                                                    <span className="minus" onClick={() => this.props.updateSingleFeeAction(total.noOfMatch, "noOfMatch", 0, "total", "decrement")}>-</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="alignself-center pt-2" style={{ marginRight: '25px' }}>${mem.feesToPay}</div>
                                    </div>

                                    {mem.discountsToDeduct != "0.00" &&
                                        <div className="product-text-common mr-4" style={{ display: "flex", fontWeight: 500 }}>
                                            <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.discount}</div>
                                            <div className="alignself-center pt-2" style={{ marginRight: 10 }}>- ${mem.discountsToDeduct}</div>
                                        </div>
                                    }
                                    {mem.childDiscountsToDeduct != "0.00" &&
                                        <div className="product-text-common mr-4" style={{ display: "flex", fontWeight: 500 }}>
                                            <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.familyDiscount}</div>
                                            <div className="alignself-center pt-2" style={{ marginRight: 10 }}>- ${mem.childDiscountsToDeduct}</div>
                                        </div>
                                    }

                                </div>
                            ))}
                        </div>
                    )
                }
                )}

                <div style={{ borderBottom: "1px solid var(--app-e1e1f5)", marginTop: "-5px" }}>
                    <div className="product-text-common mt-10 mr-4 font-w600" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.subTotal}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.subTotal}</div>
                    </div>
                    <div className="product-text-common-light mt-10 mr-4" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.gst}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.gst}</div>
                    </div>
                    <div className="product-text-common-light mt-10 mr-4" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.charityRoundUp}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.charityValue}</div>
                    </div>
                </div>

                <div style={{ borderBottom: "1px solid var(--app-e1e1f5)" }}>
                    <div className="product-text-common mt-10 mr-4 font-w600" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.total}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.total}</div>
                    </div>
                    <div className="product-text-common-light mt-10 mr-4" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.transactionFee}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.transactionFee}</div>
                    </div>
                </div>

                <div className="product-text-common mt-10 mr-4 font-w600" style={{ display: "flex" }}>
                    <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.targetValue}</div>
                </div>
            </div>
        )
    }

    buttonView = () => {
        const { registrationReviewList } = this.props.registrationProductState;
        return (
            <div style={{ marginTop: 23 }}>
                {/* <div>
                    <Button className="open-reg-button" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}>
                        {AppConstants.continue}
                    </Button>
                </div>                  */}
                <div style={{ marginTop: 23 }}>
                    <Button
                        id="back"
                        className="back-btn-text" style={{ boxShadow: "0px 1px 3px 0px", width: "100%", textTransform: "uppercase" }}
                        onClick={() => this.goBack()}
                    >
                        {AppConstants.back}
                    </Button>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{ margin: "32px 40px 10px 40px" }}>
                    <Form
                    // autocomplete="off"
                    // scrollToFirstError={true}
                    // onSubmit={this.saveRegistrationForm}
                    // noValidate="noValidate"
                    >
                        <Content>
                            <div>
                                {this.contentView()}
                            </div>
                            <Loader visible={this.props.registrationProductState.onLoad ||
                                this.state.onLoad} />
                        </Content>
                    </Form>
                </Layout>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSingleGameDataAction,
        updateSingleFeeAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        registrationProductState: state.RegistrationProductState
    }
}

// POST the token ID to your backend.
async function stripeTokenHandler(token, props, selectedOption, setClientKey, setRegId, payload, registrationUniqueKey) {
    console.log(token, props, screenProps)
    let paymentType = selectedOption;
    //let registrationId = screenProps.location.state ? screenProps.location.state.registrationId : null;
    // let invoiceId = screenProps.location.state ? screenProps.location.state.invoiceId : null
    console.log("Payload::" + JSON.stringify(payload.total));

    let url = "/api/payments/createsinglegame";

    let body;
    if (paymentType === "card") {
        let stripeToken = token.id
        body = {
            paymentType: paymentType,
            registrationId: registrationUniqueKey,
            payload: payload,
            token: {
                id: stripeToken
            }
        }
    }

    console.log("body" + JSON.stringify(body));
    return await new Promise((resolve, reject) => {
        fetch(`${StripeKeys.apiURL + url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": localStorage.token,
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                props.onLoad(false)
                let resp = response.json()
                console.log(response.status, "status", paymentType)
                resp.then((Response) => {
                    if (response.status === 200) {
                        if (paymentType == "card") {
                            message.success(Response.message);

                            console.log("response", Response);
                            history.push("/invoice", {
                                registrationId: Response.registrationId,
                                userRegId: null,
                                invoiceId: Response.invoiceId,
                                paymentSuccess: true,
                                paymentType: paymentType
                            })
                        }
                    }
                    else if (response.status === 212) {
                        message.error(Response.message);
                    }
                    else if (response.status === 400) {
                        message.error(Response.message);
                    }
                    else {
                        message.error("Something went wrong.")
                    }

                })

            })
            .catch((error) => {
                props.onLoad(false)
                console.error(error);
            });
    })
}
export default connect(mapStatetoProps, mapDispatchToProps)(SingleGamePayment);
