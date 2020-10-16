import React, {useState, Component } from "react";
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
import {loadStripe} from '@stripe/stripe-js';
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
import {isArrayNotEmpty} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import { updateTeamInviteAction} from 
'../../store/actions/registrationAction/teamInviteAction';
import {getRegistrationByIdAction} 
from '../../store/actions/registrationAction/registrationProductsAction';
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
    
    const stripe = useStripe();
    const elements = useElements();
    let paymentOptions = props.paymentOptions;
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
        history.push("/registrationReview", {
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
                {(paymentOptions.length > 0 ) ?
                <div className="content-view pt-5">
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
                                    <div class="sr-root">
                                        <div class="sr-main">
                                            {/* <div class="sr-combo-inputs-row">
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
                                            </div> */}
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
                        </div>}
                        {pay.securePaymentOptionRefId == 3 && 
                        <div className="row">
                            <div className='col-sm'>
                                <Radio key={"3"} onChange={(e) => changePaymentOption(e, "cash")} checked={selectedPaymentOption.cash}>{AppConstants.cash}</Radio>
                            </div>
                        </div>}
                    </div>
                    ))}
                </div> : 
                <div className="content-view pt-5 secure-payment-msg">
                    {AppConstants.securePaymentMsg}
                </div>
                }
                <div className="mt-5">
                    <div style={{padding:0}}>
                        <div style={{display:"flex" , justifyContent:"flex-end"}}>
                            {(paymentOptions.length > 0) ?
                                <Button
                                    className="open-reg-button"
                                    htmlType="submit"
                                    type="primary">
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

class TeamInvitePayment extends Component{
    constructor(props){
        super(props);
        this.state = {
            showCardView:false,
            userRegId: null,  
            productModalVisible: false ,
            id: null,
            onLoad: false            
        }
    }

    componentDidMount(){
        try{
            let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
            console.log("Payment::(((((((((((((((" + userRegId)
            this.setState({userRegId: userRegId});
    
            this.getApiInfo(userRegId);
        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    getApiInfo = (userRegId) => {
        let registrationId = this.props.teamInviteState.registrationId;
        let payload = {
            registrationId: registrationId,
            userRegId: userRegId
        }
        console.log("payload",payload);
        this.props.getRegistrationByIdAction(payload);
    }

    goToShipping = () =>{
        history.push({pathname: '/teamInviteShipping', state: {userRegId: this.state.userRegId}})
    }

    goToShop = () =>{
        history.push({pathname: '/teamInviteShop', state: {userRegId: this.state.userRegId}})
    }

    goToTeamInviteProducts = () =>{
        history.push({pathname: '/teamInviteProductsReview', state: {userRegId: this.state.userRegId}})
    }

    getPaymentOptionText = (paymentOptionRefId) =>{
        let paymentOptionTxt =   paymentOptionRefId == 1 ? AppConstants.payAsYou : 
        (paymentOptionRefId == 2 ? AppConstants.gameVoucher : 
        (paymentOptionRefId == 3 ? AppConstants.payfullAmount : 
        (paymentOptionRefId == 4 ? AppConstants.weeklyInstalment : 
        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration: ""))));

        return paymentOptionTxt;
    }

    removeFromCart = (index, key, subKey) =>{
        this.props.updateReviewInfoAction(null,key, index, subKey,null);
    }

    back = () => {
        try{
            const {teamInviteReviewList} = this.props.teamInviteState;
            const {shopProductList} = this.props.registrationProductState;
            if(!isArrayNotEmpty(shopProductList)){
                this.goToTeamInviteProducts();
            }else if(isArrayNotEmpty(teamInviteReviewList.shopProducts)){
                this.goToShipping();
            }else{
                this.goToShop();
            }
        }catch(ex){
            console.log("Error in back::"+ex);
        }
    }

    paymentLeftView = ()=>{
        const {teamInviteReviewList} = this.props.teamInviteState;
        let securePaymentOptions = teamInviteReviewList!= null ? teamInviteReviewList.securePaymentOptions : [];
        try{
            return(
                <div className="col-sm-8 product-left-view outline-style">              
                    <div className="product-text-common" style={{fontSize:22}}>
                        {AppConstants.securePaymentOptions}
                    </div>  
                    <div>
                        <Elements stripe={stripePromise} >
                            <CheckoutForm 
                            onLoad={(status)=>this.setState({onLoad: status})} 
                            paymentOptions={securePaymentOptions}
                            payload={teamInviteReviewList} 
                            userRegId = {this.state.userRegId}/>
                        </Elements>
                   </div>              
                </div>
            )
        }catch(ex){
            console.log("Error in paymentLeftView::"+ex);
        }
    }

    yourOrderView = () =>{
        const {teamInviteReviewList} = this.props.teamInviteState;
        let compParticipants = teamInviteReviewList!= null ? 
                    isArrayNotEmpty(teamInviteReviewList.compParticipants) ?
                    teamInviteReviewList.compParticipants : [] : [];
        let total = teamInviteReviewList!= null ? teamInviteReviewList.total : null;
        let shopProducts = teamInviteReviewList!= null ? 
                isArrayNotEmpty(teamInviteReviewList.shopProducts) ?
                teamInviteReviewList.shopProducts : [] : [];
        return(
            <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                <div className="product-text-common" style={{fontSize: 21}}>
                    {AppConstants.yourOrder}
                </div>
                {(compParticipants || []).map((item, index) => {
                    let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId)
                    return(
                    <div style={{paddingBottom:12}} key={item.participantId}>
                        <div className = "product-text-common" style={{fontWeight:500 , marginTop: "17px"}}>
                            {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                        </div>
                        {(item.membershipProducts || []).map((mem, memIndex) =>(
                            <div key={mem.competitionMembershipProductTypeId + "#" + memIndex}>
                                <div  className="product-text-common mt-10" style={{display:"flex",fontSize:17}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{mem.membershipTypeName  + (mem.divisionId!= null ? ' - '+ mem.divisionName : '')}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>${mem.feesToPay}</div>
                                    <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId)}>
                                        <span className="user-remove-btn pointer" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                                    </div>
                                </div>
                                
                                {mem.discountsToDeduct!= "0.00" && 
                                <div  className="product-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                                    <div className="alignself-center pt-2 number-text-style" style={{marginRight:10}}>(${mem.discountsToDeduct})</div>
                                </div>
                                }
                                {mem.childDiscountsToDeduct!= "0.00" && 
                                <div  className="product-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.familyDiscount}</div>
                                    <div className="alignself-center pt-2 number-text-style" style={{marginRight:10}}>(${mem.childDiscountsToDeduct})</div>
                                </div>
                                }
                                {/* <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                                </div>  */}
                            </div>
                        ))}
                        <div style={{color: "var(--app-bbbbc6)"}}>
                            {paymentOptionTxt}
                            <span className="link-text-common pointer" 
                            onClick={() => this.goToTeamInviteProducts()}
                            style={{margin: "0px 15px 0px 10px"}}>
                                {AppConstants.edit}
                            </span>
                        </div>
                        {item.governmentVoucherAmount != "0.00" && 
                        <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>(${item.governmentVoucherAmount})</div>
                        </div> 
                        }
                    </div> 
                    )}
                )}
                {(shopProducts).map((shop, index) =>(
                    <div  className="product-text-common" style={{display:"flex" , fontWeight:500 ,borderBottom:"1px solid var(--app-e1e1f5)" , borderTop:"1px solid var(--app-e1e1f5)"}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto" , display: "flex",marginTop: "12px" , padding: "8px"}}>
                            <div>
                                <img style={{width:'50px'}} src={shop.productImgUrl ? shop.productImgUrl : AppImages.userIcon}/>
                            </div>
                            <div style={{marginLeft:"6px",fontFamily:"inter-medium"}}>
                                <div>
                                    {shop.productName}
                                </div>
                                <div>({shop.optionName}) {AppConstants.qty} : {shop.quantity}</div>                               
                            </div>
                        </div>
                        <div className="alignself-center pt-5" style={{fontWeight:600 , marginRight:10}}>${shop.totalAmt ? shop.totalAmt.toFixed(2): '0.00'}</div>
                        <div style={{paddingTop:26}} onClick ={() => this.removeFromCart(index,'removeShopProduct', 'shopProducts')}>
                            <span className="user-remove-btn pointer" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                        </div>
                    </div>
                ))} 
                <div style={{borderBottom:"1px solid var(--app-e1e1f5)"}}>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.subTotal}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.subTotal}</div>
                    </div>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.shipping}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.shipping}</div>
                    </div>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.gst}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.gst}</div>
                    </div>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.charityRoundUp}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.charityValue}</div>
                    </div>
                </div>

                <div  style={{borderBottom:"1px solid var(--app-e1e1f5)"}}>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.total}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.total}</div>
                    </div>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.transactionFee}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.transactionFee}</div>
                    </div>
                </div>
                
                <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17,fontWeight: 100}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.targetValue}</div>
                </div>
            </div>
        )
    }

    buttonView = () =>{
        try{
            return(
            <div style={{marginTop:23}}>          
                <div style={{marginTop:23}}> 
                    <Button className="back-btn-text" style={{boxShadow: "0px 1px 3px 0px" , width:"100%",textTransform: "uppercase"}}
                     onClick={() => this.back()}>
                        {AppConstants.back}
                    </Button> 
                </div>     
            </div>            
        )
        }catch(ex){
            console.log("Error in buttonView::"+ex);
        }
    }

    paymentRightView = ()=>{
        return(
            <div className="product-right-view">
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    contentView = () =>{
        return(
            <div style={{display:"flex"}}>
                {this.paymentLeftView()}
                {this.paymentRightView()}                
            </div>
        );
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{margin: "32px 40px 10px 40px"}}>
                    <Form>

                        <Content>
                            <Loader visible={this.props.teamInviteState.onTeamInviteReviewLoad ||
                             this.state.onLoad} />
                            {this.contentView()}
                            </Content>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
        getRegistrationByIdAction,
        updateTeamInviteAction,			
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamInviteState: state.TeamInviteState,
        registrationProductState: state.RegistrationProductState,
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
                                userRegId: userRegId,
                                registrationId: null,
                                paymentSuccess: true
                            })
                        }
                        else if(paymentType =="direct_debit") {
                            if(Response.clientSecret == null && Response.totalFee == 0){
                                history.push("/invoice", {
                                    registrationId: null,
                                    userRegId: userRegId,
                                    paymentSuccess: true
                                })
                            }
                            else{
                                setClientKey(Response.clientSecret)
                                setRegId(userRegId)
                            }
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

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInvitePayment));