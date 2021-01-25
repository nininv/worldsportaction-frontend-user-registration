import React, {useState, Component } from "react";
import {
    Layout,Breadcrumb,Input,Select,Checkbox,Button, Table,DatePicker,Radio, Form, Modal, message
} from "antd";
import {
    CardElement,
    Elements,
    useElements,
    useStripe, AuBankAccountElement,
} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import history from "../../util/history";
import AppConstants from "../../themes/appConstants";
import "../../pages/layout.css";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppImages from "../../themes/appImages";
import {getTeamRegistrationReviewProductAction} from
            '../../store/actions/registrationAction/endUserRegistrationAction';
import moment from 'moment';
import StripeKeys from "../stripe/stripeKeys";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;


const paymentOption = [{
    id: 1, value: "Credit/Debit Card"
}, {
    id: 2, value: "Direct Debit"
}]
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

    const stripe = useStripe();
    const elements = useElements();
    let paymentOptions = props.paymentOptions;
    let isSchoolRegistration = props.isSchoolRegistration;
    let payload = props.payload;
    let userRegId = props.userRegId;

    console.log("PaymentOptions" ,props.paymentOptions);
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
            stripeTokenHandler("", props, 'direct_debit', setClientKey, setRegId, payload, userRegId);
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

    const previousCall = () =>{
        history.push("/teamRegistrationReview", {
            userRegId: userRegId
        })
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

                    stripeTokenHandler(result.token, props, selectedPaymentOption.selectedOption,null, null, payload, userRegId);
                }

            }
            else if(auBankAccount){
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

                const result = await stripe.confirmAuBecsDebitPayment(clientSecretKey, {
                    payment_method: {
                        au_becs_debit: auBankAccount,
                        billing_details: {
                            name:  "Club Test 1", // accountholderName.value,
                            email: "testclub@wsa.com"  // email.value,
                        },
                    }
                });

                console.log("Result",result);

                if (result.error) {
                    let message = result.error.message
                    setBankError(message)
                    props.onLoad(false)
                } else {
                    setBankError(null)
                    setClientKey("")
                    props.onLoad(false)
                    message.success("Payment status is " + result.paymentIntent.status)
                    history.push("/invoice", {
                        registrationId: null,
                        userRegId: userRegId,
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
        // className="content-view"
        <div>
            <form id='my-form' className="form" onSubmit={handleSubmit} >
                {paymentOptions!= null && paymentOptions.length > 0 &&
                <div className="formView content-view pt-5">
                    <div className = "individual-header-view">
                        <div>
                            {AppConstants.securePaymentOptions}
                        </div>
                    </div>
                    {(paymentOptions || []).map((pay, pIndex) =>(
                    <div>
                        {pay.securePaymentOptionRefId == 2 &&
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
                        </div>}
                        {pay.securePaymentOptionRefId == 1 &&
                        <div className="row">
                            <div className='col-sm'>
                                <Radio key={"2"} onChange={(e) => changePaymentOption(e, "direct")} checked={selectedPaymentOption.direct}>{AppConstants.directDebit}</Radio>
                                {selectedPaymentOption.direct == true &&
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
                                }
                            </div>
                        </div>}
                        {pay.securePaymentOptionRefId == 3 &&
                        <div className="row">
                            <div className='col-sm'>
                                <Radio key={"3"} onChange={(e) => changePaymentOption(e, "cash")} checked={selectedPaymentOption.cash}>{AppConstants.cash}</Radio>
                            </div>
                        </div>}
                    </div>
                    ))}
                </div>
                }
                <div className="formView mt-5" style={{backgroundColor: "#f7fafc"}}>
                    <div style={{padding:0}}>
                        <div style={{display:"flex" , justifyContent:"space-between"}}>
                            <Button className="save-draft-text" type="save-draft-text"
                                onClick={() => previousCall()}>
                                {AppConstants.previous}
                            </Button>
                            {(paymentOptions.length > 0 || isSchoolRegistration == 1) ?
                                <Button
                                    className="open-reg-button"
                                    htmlType="submit"
                                    type="primary">
                                    {AppConstants.next}
                                </Button>
                            : null}
                        </div>
                    </div>
                </div>
            </form >

        </div >
    );
}

const stripePromise = loadStripe(StripeKeys.publicKey);


class TeamReviewProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonPressed: "",
            loading: false,
            userRegId: null,
            modalVisible: false,
            index: 0,
            subIndex: 0,
            onLoad: false
        }
        this.getReferenceData();
    }

    componentDidMount() {
        let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
        //let registrationUniqueKey = "1f8a3975-9b3f-498c-bd0b-b9414d8c68e3";
        this.setState({userRegId: userRegId});
        this.getApiInfo(userRegId);
    }

    componentDidUpdate(nextProps){
        // let registrationState = this.props.endUserRegistrationState;

    }

    getApiInfo = (userRegId) => {
        let payload = {
            userRegId: userRegId
        }
        this.props.getTeamRegistrationReviewProductAction(payload);
    }

    getReferenceData = () => {
    }

    previousCall = () =>{
        this.setState({ buttonPressed: "previous" });
        history.push("/teamRegistrationReview", {
            userRegId: this.state.userRegId
        })
    }

    editNavigation = () => {
        history.push("/teamRegistrationReview", {
            userRegId: this.state.userRegId
        })
    }

    deleteMemProd = (index, subIndex) =>{
        this.setState({index: index, subIndex: subIndex, modalVisible: true});
    }

    handleRegReviewModal = (key) =>{
        if(key == "ok"){
            this.props.updateReviewProductAction(null,"removeProduct", this.state.index, this.state.subIndex, "membershipProducts")
        }
        this.setState({modalVisible: false})
    }

     headerView = () => {
        return (
            <div className="header-view form-review" style = {{paddingLeft:0,marginBottom : 40}}>
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "flex-start",
                        padding:0

                    }}
                >
                    <Breadcrumb
                        style={{ alignItems: "center", alignSelf: "center" }}
                        separator=">"
                    >
                        {/* <NavLink to="/registration">
                            <Breadcrumb.Item className="breadcrumb-product">Products</Breadcrumb.Item>
                        </NavLink> */}
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.netballRegistration}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>

            </div>
        );
    };

    contentView = (getFieldDecorator) => {
        let {regTeamReviewPrdData} = this.props.endUserRegistrationState;
        let participantList = regTeamReviewPrdData!= null ? regTeamReviewPrdData.compParticipants: [];
        let securePaymentOptions = regTeamReviewPrdData!= null ? regTeamReviewPrdData.securePaymentOptions : [];
        return (
            <div>

                {(participantList || []).map((item,index) =>(
                <div style={{ marginBottom: 40}}>

                        {this.reviewProducts(getFieldDecorator, item, index)}
                </div>
               ))}
               <div style={{ marginBottom: 40}}>
                    {this.totalPaymentDue(getFieldDecorator)}
               </div>
               <div style={{ marginBottom: 40}}>
                    <Elements stripe={stripePromise} >
                        <CheckoutForm onLoad={(status)=>this.setState({onLoad: status})} paymentOptions={securePaymentOptions}
                        payload={regTeamReviewPrdData} userRegId = {this.state.userRegId}/>
                    </Elements>
               </div>

                <Modal
                     className="add-membership-type-modal"
                    title="Registration Review"
                    visible={this.state.modalVisible}
                    onOk={() => this.handleRegReviewModal("ok")}
                    onCancel={() => this.handleRegReviewModal("cancel")}>
                    <p>Do you want to delete the product? </p>
                </Modal>

            </div>
        )
    }

    reviewProducts = (getFieldDecorator, item, index) => {
        let paymentOptionRefId = item.selectedOptions.paymentOptionRefId;
        let paymentOptionTxt =   paymentOptionRefId == 1 ? AppConstants.payEachMatch :
                                (paymentOptionRefId == 2 ? AppConstants.gameVoucher :
                                (paymentOptionRefId == 3 ? AppConstants.payfullAmount :
                                (paymentOptionRefId == 4 ? AppConstants.weeklyInstalment :
                                (paymentOptionRefId == 5 ? AppConstants.schoolRegistration: ""))));
        return (
            <div className = "formView content-view pt-5 pb-5">
                {index == 0 &&
                 <div className = "individual-header-view" style={{marginBottom:20}}>
                    <div>
                        {AppConstants.reviewProducts}
                    </div>
                </div>
                }
                <div className='individual-header-view' style={{fontSize:20}}>
                    <div>
                    {AppConstants.teamRegistration}
                        {AppConstants.hyphen}
                        {item.firstName + ' ' + item.lastName}
                        {AppConstants.hyphen}
                        {item.organisationName}
                        {AppConstants.hyphen}
                        {item.competitionName}
                    </div>
                </div>
                {(item.membershipProducts || []).map((mem, memIndex) =>(
                <div>
                    <div className='product-text' style={{fontFamily: "inter-medium"}}>
                        <div style={{marginRight:"auto"}}>
                        {mem.membershipProductName + ' - ' + mem.membershipTypeName}
                        </div>
                        <div className='dolar-text'>
                            <div style={{fontFamily:"inter-medium",marginRight:20}}>
                                ${mem.feesToPay}
                            </div>
                            {/* <div>
                                <img
                                    className="pointer"
                                    src={AppImages.removeIcon}
                                    height="18"
                                    width="14"
                                    name={'image'}
                                    onClick={(e) => this.deleteMemProd(index,memIndex)}
                                />
                            </div>  */}
                        </div>
                    </div>
                    {(mem.discountsToDeduct!= "0.00" && mem.discountsToDeduct != "" )  &&
                    <div className='membership-text' style={{marginTop:2}}>
                        <div>
                            <span className="number-text-style">{AppConstants.less}</span>
                            <span>{":"+" "}</span>
                            <span>{AppConstants.discount}</span>
                        </div>
                        <div className='dolar-text'>
                            <div className="number-text-style" style={{marginRight:17}}>
                            (${mem.discountsToDeduct})
                            </div>
                        </div>
                    </div>
                    }
                    <div className='membership-text' style={{marginTop:5,color: "inherit"}}></div>
                    <div className='edit-header-main'>
                        <div className="text-editsection" style={{fontSize:15}}>
                            {paymentOptionTxt + (paymentOptionRefId == 2 ? " x " + item.selectedOptions.gameVoucherValue : "") }
                        </div>
                        { paymentOptionRefId == 4 &&  item.instalmentDates.length > 0 &&
                        <div className="heading-instalmentdate">
                            <div className="text-instalmentdate">{AppConstants.instalmentDates}</div>
                            {(item.instalmentDates || []).map((i, iIndex) => (
                                <span>{(i.instalmentDate != null ? moment(i.instalmentDate).format("DD/MM/YYYY") : "") +
                                        (item.instalmentDates.length != (iIndex + 1) ?   ', ' : '')}</span>
                            )) }
                        </div>
                        }
                        <div style={{ cursor: 'pointer' , textDecoration:"underline"}}
                        className="user-remove-text mr-0 mb-1" onClick={() => this.editNavigation()}>
                            {AppConstants.edit}
                        </div>
                    </div >
                    { memIndex != item.membershipProducts.length-1 ?
                        <div style={{borderBottom: "1.5px solid #7474",marginTop:18}}></div>
                    :null}
                </div>
                ))}
                <div className=''>
                    {item.selectedOptions.governmentVoucherRefId!= null &&
                    <div className='review-product-membership-text' style={{marginTop:0}}>
                        <div>
                            <span className="number-text-style">{AppConstants.less}</span>
                            <span>{":"+" "}</span>
                            <span>{AppConstants.governmentSportVouchers + item.selectedOptions.governmentVoucherCode}</span>
                        </div>
                        <div className="number-text-style">
                            ${0}
                        </div>
                    </div>
                    }
                    {/* <div className='review-product-membership-text' style={{marginTop:4}}>
                        <div>
                            <span className="number-text-style">{AppConstants.less}</span>
                            <span>{":"+" "}</span>
                            <span>{AppConstants.hardshipPlayer}</span>
                        </div>
                        <div className="number-text-style">
                            $20
                        </div>
                    </div>  */}
                </div>
            </div>
        )
    }

    totalPaymentDue = (getFieldDecorator) => {
        let {regTeamReviewPrdData} = this.props.endUserRegistrationState;
        let total = regTeamReviewPrdData!= null ? regTeamReviewPrdData.total: null;
        return (
            <div className = "formView content-view pt-5 pb-5">
             <div className = "individual-header-view">
                    <div>
                        {AppConstants.total}
                    </div>
                </div>
                <div className='text-common-spacing' style={{borderBottom: "1.5px solid #7474"}}>
                    <div className='review-product-membership-text' style={{marginTop:0}}>
                        <div>
                            <span>{AppConstants.subTotal}</span>
                        </div>
                        <div>
                            ${total!= null ? total.subTotal: 0}
                        </div>
                    </div>
                    <div className='review-product-membership-text' style={{marginTop:0 , paddingTop:5}}>
                        <div>
                            <span>{AppConstants.shipping}</span>
                        </div>
                        <div>
                            ${total!= null ? total.shipping: 0}
                        </div>
                    </div>
                    <div className='review-product-membership-text' style={{marginTop:4,paddingTop:5}}>
                        <div>
                            <span>{AppConstants.gst}</span>
                        </div>
                        <div>
                            ${total!= null ? total.gst: 0}
                        </div>
                    </div>
                    <div className='review-product-membership-text' style={{marginTop:4 , paddingTop:5}}>
                        <div>
                            <span>{AppConstants.charityRoundUp}</span>
                        </div>
                        <div>
                            ${total!= null ? total.charityValue: 0}
                        </div>
                    </div>
                </div>
                <div className='product-text' style={{width: "97%",marginTop: 22,fontWeight:600}}>
                    <div style={{marginRight:"auto"}}>
                        {AppConstants.totalPaymentDue}
                    </div>
                    <div>
                        <div style={{fontFamily:"inter-medium"}}>
                            ${total!= null ? total.targetValue: 0}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        // const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" >
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{ paddingLeft : 35 ,paddingRight : 35}}>
                    {this.headerView()}
                    {/* <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveReviewForm}
                        noValidate="noValidate"
                        className="form-review"> */}
                        <Content>
                            <div>
                                {this.contentView()}
                            </div>
                         <Loader visible={this.props.endUserRegistrationState.onRegReviewPrdLoad ||
                                     this.state.onLoad} />
                        </Content>
                        {/* <Footer style={{padding:0}}>{this.footerView()}</Footer> */}
                    {/* </Form> */}
                </Layout>
            </div>
        );
    }

}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getTeamRegistrationReviewProductAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState
    }
}

// POST the token ID to your backend.
async function stripeTokenHandler(token, props, selectedOption, setClientKey, setRegId, payload, userRegId) {
    console.log(token, props, screenProps)
    let paymentType = selectedOption;
    //let registrationId = screenProps.location.state ? screenProps.location.state.registrationId : null;
   // let invoiceId = screenProps.location.state ? screenProps.location.state.invoiceId : null
   //console.log("Payload::" + JSON.stringify(payload));

    let body;
    if (paymentType === "card") {
        let stripeToken = token.id
        body = {
            userRegId: userRegId,
           // invoiceId: invoiceId,
            paymentType: paymentType,
            payload: payload,
            token: {
                id: stripeToken
            }
        }
    }
    else if(paymentType === "direct_debit"){
        body = {
            userRegId: userRegId,
            //invoiceId: invoiceId,
            payload: payload,
            paymentType: paymentType,
        }
    }
    console.log("payload" + JSON.stringify(payload));
    return await new Promise((resolve, reject) => {
        fetch(`${StripeKeys.apiURL}/api/payments/createteampayments`, {
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

                            console.log("userRegId"+ userRegId);
                            history.push("/invoice", {
                                registrationId: null,
                                userRegId: userRegId,
                                paymentSuccess: true
                            })
                        }
                        else if(paymentType =="direct_debit") {
                            setClientKey(Response.clientSecret)
                            setRegId(userRegId)
                           // message.success(Response.message);
                        }
                        else{
                            history.push("/invoice", {
                                registrationId: null,
                                userRegId: userRegId,
                                paymentSuccess: true
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

export default connect(mapStatetoProps,mapDispatchToProps)(TeamReviewProducts);
