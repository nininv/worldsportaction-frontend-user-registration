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
import {
    getRegistrationByIdAction, deleteRegistrationProductAction,
    updateReviewInfoAction
} from
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
const AU_BANK_ACCOUNT_STYLE = {
    base: {
        color: '#32325d',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        },
        ':-webkit-autofill': {
            color: '#32325d',
        },
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
        ':-webkit-autofill': {
            color: '#fa755a',
        },
    }
};
const AU_BANK_ACCOUNT_ELEMENT_OPTIONS = {
    style: AU_BANK_ACCOUNT_STYLE,
    disabled: false,
    hideIcon: false,
    iconStyle: "default", // or "solid"
};

const CheckoutForm = (props) => {
    const [error, setError] = useState(null);
    const [bankError, setBankError] = useState(null)
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [bankResult, setBankResult] = useState(false);
    const [clientSecretKey, setClientKey] = useState("")
    const [regId, setRegId] = useState("")
    const [selectedPaymentOption, setUser] = useState({
        cash: false,
        direct: false,
        credit: false,
        selectedOption: 0
    });
    const [perMatchSelectedPaymentOption, setPerMatchSelectedPaymentOption] = useState({
        singleCash: false,
        singleCredit: false,
        selectedOption: 0
    })
    const [disabled, setDisabled] = useState(false)

    const stripe = useStripe();
    const elements = useElements();
    let paymentOptions = props.paymentOptions;
    let isSchoolRegistration = props.isSchoolRegistration;
    let isHardshipEnabled = props.isHardshipEnabled;
    let payload = props.payload;
    let registrationUniqueKey = props.registrationUniqueKey;
    let mainProps = props.mainProps;

    // Handle real-time validation errors from the card Element.


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
                                    mainProps.updateReviewInfoAction(1, "International_AE", 0, "total", null);
                                }
                                else {
                                    mainProps.updateReviewInfoAction(1, "International_CC", 0, "total", null);
                                }
                            }
                            else {
                                mainProps.updateReviewInfoAction(1, "DOMESTIC_CC", 0, "total", null);
                            }
                        }
                    }
                }
            }
            setError(null);
        }
    }

    const changePaymentOption = (e, key) => {
        console.log("Change payment option", payload)
        if (key === 'direct') {
            // props.onLoad(true)
            setUser({
                ...selectedPaymentOption,
                "direct": true,
                "cash": false,
                "credit": false,
                "cashDirect": false,
                "cashCredit": false,
                "selectedOption": "direct_debit"
            });
            // mainProps.updateReviewInfoAction(1, "direct_debit", 0, "total",null);
            // setTimeout(() =>{
            //     stripeTokenHandler("", props, 'direct_debit', setClientKey, setRegId, payload, registrationUniqueKey,1);
            // },100);

        }
        else if (key === 'cash') {
            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "direct": false,
                "cash": true,
                "credit": false,
                "cashDirect": false,
                "cashCredit": false,
                "selectedOption": ""
            });
        }
        else if (key == "cash_direct_debit") {
            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "direct": false,
                "cash": true,
                "credit": false,
                "cashDirect": true,
                "cashCredit": false,
                "selectedOption": "cash_direct_debit"
            });
        }
        else if (key == "cash_card") {
            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "direct": false,
                "cash": true,
                "credit": false,
                "cashDirect": false,
                "cashCredit": true,
                "selectedOption": "cash_card"
            });
        }
        else {

            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "direct": false,
                "cash": false,
                "credit": true,
                "cashDirect": false,
                "cashCredit": false,
                "selectedOption": "card"
            });
        }
    }

    const changeSinglePaymentOption = (e, key) => {
        try {
            if (key === 'credit') {
                setPerMatchSelectedPaymentOption({
                    ...perMatchSelectedPaymentOption,
                    "singleCredit": true,
                    "singleCash": false,
                    "selectedOption": "card"
                });
            } else if (key === "cash") {
                setPerMatchSelectedPaymentOption({
                    ...perMatchSelectedPaymentOption,
                    "singleCredit": false,
                    "singleCash": true,
                    "selectedOption": "cash"
                });
            }
        } catch (ex) {
            console.log("Error in changeSinglePaymentOption::" + ex)
        }
    }



    // Handle form submission.
    const handleSubmit = async (event) => {
        setDisabled(true);
        event.preventDefault();
        console.log("clientSecretKey", clientSecretKey);
        console.log(event)
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        console.log(event.target)
        const auBankAccount = elements.getElement(AuBankAccountElement);
        const card = elements.getElement(CardElement);
        const perMatchPaymentOption = payload.singleGameSelected == 1 && props.payload.total.targetValue > 0 ? (perMatchSelectedPaymentOption.selectedOption != 0 ? true : false) : true;
        console.log(auBankAccount, card)
        if (((auBankAccount || card || props.payload.total.targetValue == 0) && (perMatchPaymentOption || payload.singleGameSelected != 1))) {
            if (card && !auBankAccount) {
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
                    console.log("Result1", result);
                    props.onLoad(true)
                    registrationCapValidate(result.token, props, selectedPaymentOption.selectedOption, null, null, payload, registrationUniqueKey, 1, perMatchSelectedPaymentOption.selectedOption);
                    // stripeTokenHandler(result.token, props, selectedPaymentOption.selectedOption,null, null, payload, registrationUniqueKey,1,perMatchSelectedPaymentOption.selectedOption);
                }

            }
            else if (auBankAccount) {
                props.onLoad(true)
                console.log("clientSecretKey", clientSecretKey);

                // var form = document.getElementById('setup-form');
                // props.onLoad(true)
                // console.log(form)
                // const accountholderName = event.target['name'];
                // const email = event.target.email;

                // console.log("accountholderName", accountholderName.value);
                // console.log("email", email.value);
                console.log("auBankAccount", auBankAccount);

                // const result = await stripe.confirmAuBecsDebitPayment(clientSecretKey, {
                //     payment_method: {
                //         au_becs_debit: auBankAccount,
                //         billing_details: {
                //             name:  "Club Test 1", // accountholderName.value,
                //             email: "testclub@wsa.com"  // email.value,
                //         },
                //     }
                // });

                // console.log("Result",result);

                // if (result.error) {
                //     let message = result.error.message
                //     setBankError(message)
                //     props.onLoad(false)
                // } else {
                //     setBankError(null)
                //     setClientKey("")
                //                 // props.onLoad(true)
                //     registrationCapValidate(result.token, props, selectedPaymentOption.selectedOption,null, null, payload, registrationUniqueKey,2);
                //                 // stripeTokenHandler(result.token, props, selectedPaymentOption.selectedOption,null, null, payload, registrationUniqueKey,2);
                //                 // message.success("Payment status is " + result.paymentIntent.status)
                //                 // history.push("/invoice", {
                //                 //     registrationId: regId,
                //                 //     userRegId: null,
                //                 //     paymentSuccess: true
                //                 // })
                // }


                mainProps.updateReviewInfoAction(1, "direct_debit", 0, "total", null);
                setTimeout(() => {
                    // stripeTokenHandler("", props, 'direct_debit', setClientKey, setRegId, payload, registrationUniqueKey,1,perMatchSelectedPaymentOption.selectedOption,auBankAccount,setBankError,stripe,card,setError);
                    registrationCapValidate("", props, 'direct_debit', setClientKey, setRegId, payload, registrationUniqueKey, 1, perMatchSelectedPaymentOption.selectedOption, auBankAccount, setBankError, stripe, card, setError);
                }, 100);
            }
            else if (props.payload.total.targetValue == 0) {
                props.onLoad(true)
                registrationCapValidate(null, props, selectedPaymentOption.selectedOption, null, null, payload, registrationUniqueKey, 1);
                // stripeTokenHandler(null, props, selectedPaymentOption.selectedOption,null, null, payload, registrationUniqueKey,1,clientSecretKey);
            }
        }
        else {
            if (paymentOptions.length > 0 && !isSchoolRegistration && !isHardshipEnabled) {
                message.config({
                    maxCount: 1, duration: 0.9
                })
                message.error(AppConstants.selectedPaymentOption)
            }
        }
        setDisabled(false);
    }

    return (
        // className="content-view"
        <div>
            <form id='my-form' className="form" onSubmit={handleSubmit} >
                {(paymentOptions.length > 0 && !isSchoolRegistration && !isHardshipEnabled) ?
                    <div className="pt-5">
                        {(paymentOptions || []).map((pay, pIndex) => (
                            <div>
                                {pay.securePaymentOptionRefId == 2 &&
                                    <div className="row">
                                        <div className='col-sm'>
                                            <Radio key={"1"} onChange={(e) => changePaymentOption(e, "credit")}
                                                className="payment-type-radio-style"
                                                checked={selectedPaymentOption.credit}>{AppConstants.creditCard}</Radio>
                                            {selectedPaymentOption.credit == true && (
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
                                            )}
                                        </div>
                                    </div>
                                }
                                {pay.securePaymentOptionRefId == 1 &&
                                    <div className="row">
                                        <div className='col-sm'>
                                            <Radio key={"2"}
                                                className="payment-type-radio-style"
                                                onChange={(e) => changePaymentOption(e, "direct")} checked={selectedPaymentOption.direct}>{AppConstants.directDebit}</Radio>
                                            {selectedPaymentOption.direct == true &&
                                                <div className="pt-5">
                                                    <div className="sr-root">
                                                        <div className="sr-main">
                                                            {/* <div className="sr-combo-inputs-row">
                                                    <div className="col">
                                                        <label htmlFor="name">
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            placeholder="John Smith"
                                                            onChange={e => setName(e.target.value)}
                                                            value={name}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col">
                                                        <label htmlFor="email">
                                                            Email Address
                                                        </label>
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            onChange={e => setEmail(e.target.value)}
                                                            value={email}
                                                            placeholder="john.smith@example.com"
                                                            required
                                                        />
                                                    </div>
                                                </div> */}
                                                            <div className="sr-combo-inputs-row">
                                                                <div className="col">
                                                                    <label htmlFor="au-bank-account-element">
                                                                        Bank Account
                                                    </label>
                                                                    <div id="au-bank-account-element">
                                                                        <AuBankAccountElement
                                                                            id="au-bank-account-element"
                                                                            options={AU_BANK_ACCOUNT_ELEMENT_OPTIONS}
                                                                            className='StripeElement'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div id="bank-name"></div>
                                                            <div id="error-message" className=" pl-4 card-errors" role="alert">{bankError}</div>
                                                            <div className="col pt-3" id="mandate-acceptance">
                                                                {AppConstants.stripeMandate1} <a> </a>
                                                                <a href="https://stripe.com/au-becs-dd-service-agreement/legal"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Direct Debit Request service agreement
                                                    </a>
                                                                {AppConstants.stripeMandate2}
                                                            </div>
                                                            {/* </form> */}
                                                            {/* <div className="sr-result hidden">
                                                    <p>Response<br /></p>
                                                    <pre>
                                                        <code></code>
                                                    </pre>
                                                </div> */}
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: "10px", padding: "0 15px 20px 0" }}>{AppConstants.directDebitMsg}</div>
                                                </div>
                                            }
                                        </div>
                                    </div>}
                                {/* {pay.securePaymentOptionRefId == 3 &&
                        <div>
                            <div className="row">
                                <div className='col-sm'>
                                    <Radio key={"3"}
                                className="payment-type-radio-style"
                                onChange={(e) => changePaymentOption(e, "cash")} checked={selectedPaymentOption.cash}>{AppConstants.cash}</Radio>
                                </div>
                            </div>
                            <div className="row pl-4">
                                <div className='col-sm'>
                                    {selectedPaymentOption.cash == true &&
                                        <div className="pt-0">
                                            <Radio key={"4"}
                                            className="payment-type-radio-style"
                                            onChange={(e) => changePaymentOption(e, "cash_direct_debit")}
                                                    checked={selectedPaymentOption.cashDirect}>{AppConstants.directDebit}</Radio>
                                            {selectedPaymentOption.cashDirect == true &&
                                                <div>
                                                    <div className="sr-root">
                                                        <div className="sr-main">
                                                            <div className="sr-combo-inputs-row">
                                                                <div className="col">
                                                                    <label htmlFor="au-bank-account-element">
                                                                        Bank Account
                                                                </label>
                                                                    <div id="au-bank-account-element">
                                                                        <AuBankAccountElement
                                                                            id="au-bank-account-element"
                                                                            options={AU_BANK_ACCOUNT_ELEMENT_OPTIONS}
                                                                            className='StripeElement'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div id="bank-name"></div>
                                                            <div id="error-message" className=" pl-4 card-errors" role="alert">{bankError}</div>
                                                            <div className="col pt-3" id="mandate-acceptance">
                                                                {AppConstants.stripeMandate1} <a> </a>
                                                                <a href="https://stripe.com/au-becs-dd-service-agreement/legal"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Direct Debit Request service agreement
                                                                </a>
                                                                {AppConstants.stripeMandate2}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: "10px"}}>{AppConstants.directDebitMsg}</div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="row pl-4">
                                <div className='col-sm'>
                                    {selectedPaymentOption.cash == true &&
                                        <div className="pt-0">
                                            <Radio key={"5"}
                                            className="payment-type-radio-style"
                                            onChange={(e) => changePaymentOption(e, "cash_card")}
                                                    checked={selectedPaymentOption.cashCredit}>{AppConstants.creditCard}</Radio>
                                                {selectedPaymentOption.cashCredit == true &&
                                                <div className="pt-4">
                                                    <CardElement
                                                        id="card-element"
                                                        options={CARD_ELEMENT_OPTIONS}
                                                        onChange={handleChange}
                                                        className='StripeElement'
                                                    />
                                                    <div className="card-errors" role="alert">{error}</div>
                                                    <div style={{marginTop: "-10px"}}>{AppConstants.creditCardMsg}</div>
                                                </div>
                                                }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        } */}
                            </div>
                        ))}
                        {payload.singleGameSelected == 1 && (
                            <div>
                                <div className="product-text-common" style={{ fontSize: 22, marginTop: 30, marginBottom: 30 }}>
                                    {AppConstants.perMatchFees}
                                </div>
                                {(paymentOptions || []).map((paymentOption, paymentOptionIndex) => (
                                    <div>
                                        {paymentOption.securePaymentOptionRefId == 2 && (
                                            <div className="row">
                                                <div className='col-sm'>
                                                    <Radio className="payment-type-radio-style"
                                                        disabled={selectedPaymentOption.selectedOption == 0}
                                                        key={"1"}
                                                        checked={perMatchSelectedPaymentOption.singleCredit}
                                                        onChange={(e) => changeSinglePaymentOption(e, "credit")}>
                                                        {AppConstants.creditCard}
                                                    </Radio>
                                                    {selectedPaymentOption.credit == false && perMatchSelectedPaymentOption.singleCredit == true ? (
                                                        <div className="pt-5">
                                                            <CardElement
                                                                id="card-element"
                                                                options={CARD_ELEMENT_OPTIONS}
                                                                onChange={handleChange}
                                                                className='StripeElement'
                                                            />
                                                            <div className="card-errors" role="alert">{error}</div>
                                                            <div style={{ marginTop: "-10px" }}>{AppConstants.creditCardMsg}</div>
                                                        </div>
                                                    ) : (
                                                            <div>
                                                                {selectedPaymentOption.credit == true && perMatchSelectedPaymentOption.singleCredit == true && (
                                                                    <div className="product-text-common">{AppConstants.asAbove}</div>
                                                                )}
                                                            </div>)}
                                                </div>
                                            </div>
                                        )}
                                        {paymentOption.securePaymentOptionRefId == 3 && (
                                            <Radio className="payment-type-radio-style"
                                                key={"2"}
                                                disabled={selectedPaymentOption.selectedOption == 0}
                                                checked={perMatchSelectedPaymentOption.singleCash}
                                                onChange={(e) => changeSinglePaymentOption(e, "cash")}>
                                                {AppConstants.cash}
                                            </Radio>
                                        )}
                                    </div>

                                ))}
                            </div>
                        )}
                    </div>
                    :
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
                            {/* {(paymentOptions.length > 0 || isSchoolRegistration == 1 || isHardshipEnabled == 1) ? */}
                            <Button
                                disabled={disabled}
                                style={{ textTransform: "uppercase" }}
                                className="open-reg-button"
                                htmlType="submit"
                                type="primary">
                                {AppConstants.submit}
                            </Button>
                            {/* : null} */}
                        </div>
                    </div>
                </div>
            </form >

        </div >
    );
}

class RegistrationPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCardView: false,
            registrationUniqueKey: null,
            productModalVisible: false,
            id: null,
            onLoad: false,
            registrationCapModalVisible: false,
            registrationCapValidationMessage: null
        };
    }

    componentDidMount() {
        let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        this.setState({ registrationUniqueKey: registrationUniqueKey });

        this.getApiInfo(registrationUniqueKey);
    }
    componentDidUpdate(nextProps) {

    }

    getApiInfo = (registrationUniqueKey) => {
        let payload = {
            registrationId: registrationUniqueKey
        }
        console.log("payload", payload);
        this.props.getRegistrationByIdAction(payload);
    }

    goToShipping = () => {
        history.push({ pathname: '/registrationShipping', state: { registrationId: this.state.registrationUniqueKey } })
    }

    goToShop = () => {
        history.push({ pathname: '/registrationShop', state: { registrationId: this.state.registrationUniqueKey } })
    }

    goToRegistrationProducts = () => {
        history.push({ pathname: '/registrationProducts', state: { registrationId: this.state.registrationUniqueKey } })
    }

    getPaymentOptionText = (paymentOptionRefId, isTeamRegistration) => {
        let paymentOptionTxt = paymentOptionRefId == 1 ? (isTeamRegistration == 1 ? AppConstants.payEachMatch : AppConstants.oneMatchOnly) :
            (paymentOptionRefId == 2 ? AppConstants.gameVoucher :
                (paymentOptionRefId == 3 ? AppConstants.allMatches :
                    (paymentOptionRefId == 4 ? AppConstants.firstInstalment :
                        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration : ""))));

        return paymentOptionTxt;
    }

    removeFromCart = (index, key, subKey) => {
        this.props.updateReviewInfoAction(null, key, index, subKey, null);
    }

    removeProductModal = (key, id) => {
        if (key == "show") {
            this.setState({ productModalVisible: true, id: id });
        }
        else if (key == "ok") {
            this.setState({ productModalVisible: false });
            let payload = {
                registrationId: this.state.registrationUniqueKey,
                orgRegParticipantId: this.state.id
            }
            this.props.deleteRegistrationProductAction(payload);
            this.setState({ loading: true });
        }
        else if (key == "cancel") {
            this.setState({ productModalVisible: false });
        }
    }

    back = () => {
        try {
            const { registrationReviewList, shopProductList } = this.props.registrationProductState;
            if (!isArrayNotEmpty(shopProductList)) {
                this.goToRegistrationProducts();
            } else if (isArrayNotEmpty(registrationReviewList.shopProducts)) {
                this.goToShipping();
            } else {
                this.goToShop();
            }
        } catch (ex) {
            console.log("Error in back::" + ex);
        }
    }

    registrationCapValidationModal = () => {
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
                    <p> {this.state.registrationCapValidationMessage}</p>
                </Modal>
            </div>
        )
    }


    contentView = () => {
        console.log("content view displayed")
        return (
            <div
                className="row"
                style={{ margin: 0 }}
            >
                {this.paymentLeftView()}
                {this.paymentRighttView()}
                {this.registrationCapValidationModal()}
            </div>
        );
    }

    paymentLeftView = () => {
        const { registrationReviewList } = this.props.registrationProductState;
        let securePaymentOptions = registrationReviewList != null ? registrationReviewList.securePaymentOptions : [];
        let isSchoolRegistration = registrationReviewList != null ? registrationReviewList.isSchoolRegistration : 0;
        let isHardshipEnabled = registrationReviewList != null ? registrationReviewList.isHardshipEnabled : 0;
        return (
            <div className="col-sm-12 col-md-7 col-lg-8 p-0" style={{ marginBottom: 23 }}>
                <div className="product-left-view outline-style mt-0">
                    <div className="product-text-common" style={{ fontSize: 22 }}>
                        {AppConstants.securePaymentOptions}
                    </div>
                    <div>
                        <Elements stripe={stripePromise} >
                            <CheckoutForm onLoad={(status) => this.setState({ onLoad: status })} paymentOptions={securePaymentOptions}
                                payload={registrationReviewList} registrationUniqueKey={this.state.registrationUniqueKey}
                                isSchoolRegistration={isSchoolRegistration} isHardshipEnabled={isHardshipEnabled}
                                mainProps={this.props} registrationCapModalVisible={(status) => this.setState({ registrationCapModalVisible: status })}
                                registrationCapValidationMessage={(error) => this.setState({ registrationCapValidationMessage: error })} />
                        </Elements>
                    </div>
                </div>
            </div>
        )
    }

    paymentRighttView = () => {
        return (
            <div className="col-lg-4 col-md-4 col-sm-12 product-right-view px-0 m-0">
                {this.yourOrderView()}
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
            <div className="outline-style " style={{ padding: "36px 36px 22px 20px" }}>
                <div className="product-text-common" style={{ fontSize: 21 }}>
                    {AppConstants.yourOrder}
                </div>
                {(compParticipants || []).map((item, index) => {
                    let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId, item.isTeamRegistration)
                    return (
                        <div style={{ paddingBottom: 12 }} key={item.participantId}>
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
                                                <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${mem.feesToPay}</div>
                                                {(mem.email !== item.email) && (
                                                    <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId)}>
                                                        <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        <div className="subtitle-text-common mt-10" style={{ display: "flex" }}>
                                            <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{mem.membershipTypeName + (mem.divisionId != null ? ' - ' + mem.divisionName : '')}</div>
                                            <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${mem.feesToPay}</div>
                                            <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId)}>
                                                <span className="user-remove-btn pointer" ><img src={AppImages.removeIcon} /></span>
                                            </div>
                                        </div>
                                    }

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
                                    {/* <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                                </div>  */}
                                </div>
                            ))}
                            <div className="payment-option-txt">
                                {paymentOptionTxt}
                                <span className="link-text-common pointer"
                                    onClick={() => this.goToRegistrationProducts()}
                                    style={{ margin: "0px 15px 0px 20px" }}>
                                    {AppConstants.edit}
                                </span>
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
                    <div className="product-text-common" style={{ display: "flex", fontWeight: 500, borderBottom: "1px solid var(--app-e1e1f5)", borderTop: "1px solid var(--app-e1e1f5)" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto", display: "flex", marginTop: "12px", padding: "8px" }}>
                            <div>
                                <img style={{ width: '50px' }} src={shop.productImgUrl ? shop.productImgUrl : AppImages.userIcon} />
                            </div>
                            <div style={{ marginLeft: "6px", fontFamily: "inter-medium" }}>
                                <div>
                                    {shop.productName}
                                </div>
                                <div>{shop.optionName && `(${shop.optionName}) `}{AppConstants.qty} : {shop.quantity}</div>
                            </div>
                        </div>
                        <div className="alignself-center pt-5" style={{ fontWeight: 600, marginRight: 10 }}>${shop.totalAmt ? shop.totalAmt.toFixed(2) : '0.00'}</div>
                        <div style={{ paddingTop: 26 }} onClick={() => this.removeFromCart(index, 'removeShopProduct', 'shopProducts')}>
                            <span className="user-remove-btn pointer" ><img src={AppImages.removeIcon} /></span>
                        </div>
                    </div>
                ))}
                <div style={{ borderBottom: "1px solid var(--app-e1e1f5)", marginTop: "-5px" }}>
                    <div className="product-text-common mt-10 mr-4 font-w600" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.subTotal}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.subTotal}</div>
                    </div>
                    <div className="product-text-common-light mt-10 mr-4" style={{ display: "flex" }}>
                        <div className="alignself-center pt-2" style={{ marginRight: "auto" }}>{AppConstants.shipping}</div>
                        <div className="alignself-center pt-2" style={{ marginRight: 10 }}>${total && total.shipping}</div>
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
                    <Button className="back-btn-text" style={{ boxShadow: "0px 1px 3px 0px", width: "100%", textTransform: "uppercase" }}
                        onClick={() => this.back()}>
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
                <Layout className="layout-margin">
                    <Form
                    // autocomplete="off"
                    // scrollToFirstError={true}
                    // onSubmit={this.saveRegistrationForm}
                    // noValidate="noValidate"
                    >
                        <Content>
                            <div>
                                {this.contentView()}
                                {this.deleteProductModalView()}
                            </div>
                            <Loader visible={this.props.registrationProductState.onRegReviewLoad ||
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
        getRegistrationByIdAction,
        deleteRegistrationProductAction,
        updateReviewInfoAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        registrationProductState: state.RegistrationProductState,
        commonReducerState: state.CommonReducerState
    }
}

async function registrationCapValidate(token, props, selectedOption, setClientKey, setRegId, payload, registrationUniqueKey, urlFlag, perMatchSelectedOption, auBankAccount, setBankError, stripe, card, setError) {
    try {
        let url = "/api/registrationcap/validate";
        let body = {
            "registrationId": registrationUniqueKey
            // "isTeamRegistration": payload.compParticipants.find(x => x.isTeamRegistration == 1) ? 1 : 0,
            // "products": []
        };

        return await new Promise((resolve, reject) => {
            fetch(`${StripeKeys.apiURL + url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.token,
                },
                body: JSON.stringify(body)
            }).then((response) => {
                let resp = response.json();
                console.log("response1", response)
                resp.then((Response) => {
                    if (response.status === 200) {
                        // stripeTokenHandler(token, props, selectedOption, setClientKey, setRegId, payload, registrationUniqueKey, urlFlag, perMatchSelectedOption,null,null,stripe,card,setError);
                        stripeTokenHandler(token, props, selectedOption, setClientKey, setRegId, payload, registrationUniqueKey, urlFlag, perMatchSelectedOption, auBankAccount, setBankError, stripe, card, setError);
                    }
                    else if (response.status === 212) {
                        props.onLoad(false);
                        props.registrationCapModalVisible(true);
                        props.registrationCapValidationMessage(Response.message);
                        // message.error(Response.message);
                    }
                    else if (response.status === 400) {
                        props.onLoad(false);
                        message.error(Response.message);
                    }
                    else {
                        props.onLoad(false);
                        message.error(AppConstants.somethingWentWrongErrorMsg)
                    }

                }).catch((error) => {
                    props.onLoad(false)
                    message.error(AppConstants.somethingWentWrongErrorMsg)
                });

            })
                .catch((error) => {
                    props.onLoad(false)
                    message.error(AppConstants.somethingWentWrongErrorMsg)
                });
        }).then((data) => {
            console.log("data");
        }).catch((data) => {
            console.log("Error")
        })
    } catch (ex) {
        console.log("Error occured in createPerMatchPayments::" + ex)
    }
}

async function confirmDebitPayment(confirmDebitPaymentInput) {
    try {
        const result = await confirmDebitPaymentInput.stripe.confirmAuBecsDebitPayment(confirmDebitPaymentInput.clientSecret, {
            payment_method: {
                au_becs_debit: confirmDebitPaymentInput.auBankAccount,
                billing_details: {
                    // name: "Club Test 1", // accountholderName.value,
                    // email: "testclub@wsa.com"  // email.value,
                    name: confirmDebitPaymentInput.payload.yourInfo.firstName + " " + confirmDebitPaymentInput.payload.yourInfo.lastName,
                    email: confirmDebitPaymentInput.payload.yourInfo.email
                },
            }
        });
        if (result.error) {
            let message = result.error.message
            confirmDebitPaymentInput.setBankError(message)
            confirmDebitPaymentInput.props.onLoad(false)
        } else {
            confirmDebitPaymentInput.setBankError(null)
            // setClientKey("")
            // registrationCapValidate(result.token, confirmDebitPaymentInput.props, confirmDebitPaymentInput.selectedOption,null, null, confirmDebitPaymentInput.payload, confirmDebitPaymentInput.registrationUniqueKey,2,confirmDebitPaymentInput.perMatchSelectedOption,confirmDebitPaymentInput.card,confirmDebitPaymentInput.stripe,confirmDebitPaymentInput.setError);
            stripeTokenHandler(result.token, confirmDebitPaymentInput.props, confirmDebitPaymentInput.selectedOption, null, null, confirmDebitPaymentInput.payload, confirmDebitPaymentInput.registrationUniqueKey, 2, confirmDebitPaymentInput.perMatchSelectedOption, confirmDebitPaymentInput.auBankAccount, confirmDebitPaymentInput.setBankError, confirmDebitPaymentInput.stripe, confirmDebitPaymentInput.card, confirmDebitPaymentInput.setError);

        }
    } catch (ex) {
        confirmDebitPaymentInput.props.onLoad(false)
        console.log("Error in confirmDebitPayment::" + ex)
    }
}

// POST the token ID to your backend.
async function stripeTokenHandler(token, props, selectedOption, setClientKey, setRegId, payload, registrationUniqueKey, urlFlag, perMatchSelectedOption, auBankAccount, setBankError, stripe, card, setError) {
    console.log(token, props, screenProps)
    let paymentType = selectedOption;
    //let registrationId = screenProps.location.state ? screenProps.location.state.registrationId : null;
    // let invoiceId = screenProps.location.state ? screenProps.location.state.invoiceId : null
    console.log("Payload::" + JSON.stringify(payload.total));
    console.log("Payload222::", setClientKey, setRegId,);

    let url;
    if (urlFlag == 1) {
        url = "/api/payments/createpayments";
    }
    else {
        url = "/api/payments/createpayments/directdebit";
    }

    let body;
    if (paymentType === "card" || paymentType == "cash_card") {
        let stripeToken = token.id
        body = {
            registrationId: registrationUniqueKey,
            // invoiceId: invoiceId,
            paymentType: paymentType,
            payload: payload,
            token: {
                id: stripeToken
            }
        }
    }
    else if (paymentType === "direct_debit" || paymentType == "cash_direct_debit") {
        body = {
            registrationId: registrationUniqueKey,
            //invoiceId: invoiceId,
            payload: payload,
            paymentType: paymentType,
        }
    }
    else if (props.payload.total.targetValue == 0) {
        if (props.isSchoolRegistration || props.isHardshipEnabled) {
            body = {
                registrationId: registrationUniqueKey,
                //invoiceId: invoiceId,
                payload: payload,
                paymentType: null,
                isSchoolRegistration: 1,
                isHardshipEnabled: 1
            }

        }
        else {
            body = {
                registrationId: registrationUniqueKey,
                //invoiceId: invoiceId,
                payload: payload,
                paymentType: null,
            }
        }
    }
    console.log("body" + JSON.stringify(body));
    props.onLoad(true)
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
                let resp = response.json()
                console.log(response.status, "status", paymentType)
                resp.then(async (Response) => {
                    console.log("Response", Response)
                    if (response.status === 200) {
                        if (paymentType == "card") {
                            message.success(Response.message);

                            console.log("registrationUniqueKey" + registrationUniqueKey);
                            if (perMatchSelectedOption) {
                                createPerMatchPayments(Response.invoiceId, perMatchSelectedOption, props, registrationUniqueKey, token);
                            } else {
                                props.onLoad(false)
                            }
                            history.push("/invoice", {
                                registrationId: registrationUniqueKey,
                                userRegId: null,
                                paymentSuccess: true,
                                paymentType: paymentType
                            })
                        }
                        else if (paymentType == "direct_debit") {
                            if (Response.clientSecret == null) {
                                console.log("perMatchSelectedOption", perMatchSelectedOption)
                                if (perMatchSelectedOption) {
                                    console.log("card", card)
                                    if (card) {
                                        const result = await stripe.createToken(card)
                                        if (result.error) {
                                            let message = result.error.message
                                            setError(message);
                                            props.onLoad(false)
                                        } else {
                                            setError(null);
                                            if (perMatchSelectedOption == 'card') {
                                                createPerMatchPayments(Response.invoiceId, perMatchSelectedOption, props, registrationUniqueKey, result.token);
                                            }
                                        }
                                    } else {
                                        if (perMatchSelectedOption == 'cash') {
                                            createPerMatchPayments(Response.invoiceId, perMatchSelectedOption, props, registrationUniqueKey);
                                        }
                                    }
                                } else {
                                    props.onLoad(false)
                                }
                                history.push("/invoice", {
                                    registrationId: registrationUniqueKey,
                                    userRegId: null,
                                    paymentSuccess: true,
                                    paymentType: paymentType
                                })
                            }
                            else {
                                // setClientKey(Response.clientSecret);
                                // setRegId(registrationUniqueKey)
                                let confirmDebitPaymentInput = {
                                    props: props,
                                    selectedOption: selectedOption,
                                    payload: payload,
                                    registrationUniqueKey: registrationUniqueKey,
                                    clientSecret: Response.clientSecret,
                                    auBankAccount: auBankAccount,
                                    setBankError: setBankError,
                                    stripe: stripe,
                                    perMatchSelectedOption: perMatchSelectedOption,
                                    card: card,
                                    setError: setError
                                }
                                confirmDebitPayment(confirmDebitPaymentInput);
                                // props.onLoad(false)
                            }
                            // message.success(Response.message);
                        }
                        else {
                            if (perMatchSelectedOption) {
                                createPerMatchPayments(Response.invoiceId, perMatchSelectedOption, props, registrationUniqueKey);
                            } else {
                                props.onLoad(false)
                            }
                            history.push("/invoice", {
                                registrationId: registrationUniqueKey,
                                userRegId: null,
                                paymentSuccess: true,
                                paymentType: "dafault"
                            })
                        }
                    }
                    else if (response.status === 212) {
                        props.onLoad(false)
                        message.error(Response.message);
                    }
                    else if (response.status === 400) {
                        props.onLoad(false)
                        message.error(Response.message);
                    }
                    else {
                        props.onLoad(false)
                        message.error(AppConstants.somethingWentWrongErrorMsg)
                    }

                }).catch((error) => {
                    console.log("500", error)
                    props.onLoad(false)
                    message.error(AppConstants.somethingWentWrongErrorMsg)
                })
            })
            .catch((error) => {
                props.onLoad(false)
                message.error(AppConstants.somethingWentWrongErrorMsg)
            });
    }).then((data) => {
        console.log("then data in stripeTokenHandler ");
    }).catch((data) => {
        console.log("Error in stripeTokenHandler")
    })
}

async function createPerMatchPayments(invoiceId, perMatchSeletedPaymentOption, props, registrationUniqueKey, token) {
    try {
        console.log("invoice id", invoiceId)
        let url = "/api/payments/createpermatchpayments";
        let body = null;
        if (perMatchSeletedPaymentOption == 'card') {
            let stripeToken = token.id
            body = {
                invoiceId: invoiceId,
                subPaymentType: perMatchSeletedPaymentOption,
                registrationId: registrationUniqueKey,
                token: {
                    id: stripeToken
                }
            }
        } else {
            body = {
                invoiceId: invoiceId,
                subPaymentType: perMatchSeletedPaymentOption,
                registrationId: registrationUniqueKey
            }
        }

        return await new Promise((resolve, reject) => {
            fetch(`${StripeKeys.apiURL + url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.token,
                },
                body: JSON.stringify(body)
            }).then((response) => {
                props.onLoad(false)
                let resp = response.json()
                console.log("response3", response)
                resp.then((Response) => {
                    if (response.status === 200) {

                    }
                    else if (response.status === 212) {
                        message.error(Response.message);
                    }
                    else if (response.status === 400) {
                        message.error(Response.message);
                    }
                    else {
                        message.error(AppConstants.somethingWentWrongErrorMsg)
                    }

                }).catch((error) => {
                    props.onLoad(false)
                    message.error(AppConstants.somethingWentWrongErrorMsg)
                });

            })
                .catch((error) => {
                    props.onLoad(false)
                    message.error(AppConstants.somethingWentWrongErrorMsg)
                });
        })
    } catch (ex) {
        console.log("Error occured in createPerMatchPayments::" + ex)
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(RegistrationPayment);
