import React, { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useElements,
    useStripe, AuBankAccountElement
} from '@stripe/react-stripe-js';
import './stripe.css';
import {
    Button,
    Layout,
    Breadcrumb, Radio
} from "antd";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import StripeKeys from "./stripeKeys";
import { getOrganisationData } from "../../util/sessionStorage";
import Loader from '../../customComponents/loader';
import { message } from "antd";
import history from "../../util/history";

const paymentOption = [{
    id: 1, value: "Credit/Debit Card"
}, {
    id: 2, value: "Direct Debit"
}]



const { Header, Content } = Layout;
var screenProps = null
// Custom styling can be passed to options when creating an Element.
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

///////view for breadcrumb
const headerView = () => {
    return (
        <Header className="login-header-view" >
            <div className="row" >
                <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                    <Breadcrumb style={{
                        display: 'flex', lignItems: 'center', alignSelf: 'center'
                    }} separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.payment}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </Header >
    )
}

//////footer view containing all the buttons
const footerView = () => {
    return (
        <div className="container" >
            <div className="login-footer-view">
                <div className="row" >
                    <div className="col-sm" >
                        <div className="comp-finals-button-view">
                            <Button
                                className="open-reg-button"
                                htmlType="submit"
                                type="primary"
                                form='my-form'
                            >
                                {AppConstants.submitPayment}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

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
    const stripe = useStripe();
    const elements = useElements();
    console.log(selectedPaymentOption)
    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    }
    const changePaymentOption = (e, key) => {
        if (key === 'direct') {
            props.onLoad(true)
            setUser({
                ...selectedPaymentOption,
                "direct": true,
                "cash": false,
                "credit": false,
                "selectedOption": "direct_debit"
            });
            stripeTokenHandler("", props, 'direct_debit', setClientKey, setRegId);
        } else if (key === 'cash') {
            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "direct": false,
                "cash": true,
                "credit": false,
                "selectedOption": ""
            });
        } else {
            setClientKey("")
            setUser({
                ...selectedPaymentOption,
                "direct": false,
                "cash": false,
                "credit": true,
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
        const auBankAccount = elements.getElement(AuBankAccountElement);
        const card = elements.getElement(CardElement);
        console.log(auBankAccount, card)
        if (auBankAccount || card) {
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

                    stripeTokenHandler(result.token, props, selectedPaymentOption.selectedOption);
                }

            }
            else {
                props.onLoad(true)
                console.log(clientSecretKey)

                // var form = document.getElementById('setup-form');
                // props.onLoad(true)
                // console.log(form)
                const accountholderName = event.target['name'];
                const email = event.target.email;

                const result = await stripe.confirmAuBecsDebitPayment(clientSecretKey, {
                    payment_method: {
                        au_becs_debit: auBankAccount,
                        billing_details: {
                            name: accountholderName.value,
                            email: email.value,
                        },
                    }
                });

                if (result.error) {
                    let message = result.error.message
                    setBankError(message)
                    props.onLoad(false)
                } else {
                    setBankError(null)
                    setClientKey("")
                    props.onLoad(false)
                    message.success("payment status is " + result.paymentIntent.status)
                    history.push("/invoice", {
                        registrationId: regId,
                        paymentSuccess: true
                    })
                }
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
        <div className="content-view">
            <form id='my-form' className="form" onSubmit={handleSubmit} >
                <div className="row">
                    <div className='col-sm'>
                        <Radio key={"1"} onChange={(e) => changePaymentOption(e, "credit")}
                            checked={selectedPaymentOption.credit}>{AppConstants.creditCard}</Radio>
                        {selectedPaymentOption.credit == true &&
                            <div className="pt-5">
                                <CardElement
                                    id="card-element"
                                    options={CARD_ELEMENT_OPTIONS}
                                    onChange={handleChange}
                                    className='StripeElement'
                                />
                                <div className="card-errors" role="alert">{error}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className='col-sm'>
                        <Radio key={"2"} onChange={(e) => changePaymentOption(e, "direct")} checked={selectedPaymentOption.direct}>{AppConstants.directDebit}</Radio>
                        {selectedPaymentOption.direct == true &&
                            <div class="sr-root">
                                <div class="sr-main">
                                    <div class="sr-combo-inputs-row">
                                        <div class="col">
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
                                        <div class="col">
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
                                    </div>
                                    <div class="sr-combo-inputs-row">
                                        <div class="col">
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
                                    <div class="col pt-3" id="mandate-acceptance">
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
                                    {/* <div class="sr-result hidden">
                                        <p>Response<br /></p>
                                        <pre>
                                            <code></code>
                                        </pre>
                                    </div> */}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className='col-sm'>
                        <Radio key={"3"} onChange={(e) => changePaymentOption(e, "cash")} checked={selectedPaymentOption.cash}>{AppConstants.cash}</Radio>
                    </div>
                </div>
            </form >

        </div >
    );
}

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe(StripeKeys.publicKey);

const Stripe = (props) => {
    screenProps = props
    console.log("props", props)
    const [loading, setLoading] = useState(false);
    return (
        <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
            <DashboardLayout
                menuHeading={""}
                menuName={""}
            />
            <Layout >
                <Content className="container">
                    {headerView()}
                    <div className="stripe-payment-formView">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm onLoad={(status) => setLoading(status)} />
                        </Elements>
                        <Loader visible={loading} />
                    </div>
                    {footerView()}
                </Content>
            </Layout>
        </div>
    );
}

// POST the token ID to your backend.
async function stripeTokenHandler(token, props, selectedOption, setClientKey, setRegId) {
    console.log(token, props, screenProps)
    let paymentType = selectedOption;
    let registrationId = screenProps.location.state ? screenProps.location.state.registrationId : null;
    let invoiceId = screenProps.location.state ? screenProps.location.state.invoiceId : null
    let stripeToken = token.id
    let body
    if (paymentType === "card") {
        body = {
            registrationId: registrationId,
            invoiceId: invoiceId,
            paymentType: paymentType,
            token: {
                id: stripeToken
            }
        }
    }
    else {
        body = {
            registrationId: registrationId,
            invoiceId: invoiceId,
            paymentType: paymentType,
        }
    }
    console.log(body)
    return await new Promise((resolve, reject) => {
        fetch(`${StripeKeys.apiURL}/api/payments/createPayments`, {
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
                console.log(response.status, "status")
                resp.then((Response) => {
                    if (response.status === 200) {
                        if (paymentType == "card") {
                            message.success(Response.message);
                            history.push("/invoice", {
                                registrationId: registrationId,
                                paymentSuccess: true
                            })
                        }
                        else {
                            setClientKey(Response.clientSecret)
                            setRegId(registrationId)
                            message.success(Response.message);
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
export default Stripe