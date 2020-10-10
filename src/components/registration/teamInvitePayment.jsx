import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button, 
    Table,
    DatePicker,
    Radio, 
    Form, 
    Modal, 
    message, 
    Steps,
    Tag,
    Pagination,
    Carousel
} from "antd";
import { connect } from 'react-redux';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import { bindActionCreators } from "redux";
import "./product.css";
import "../user/user.css";
import '../competition/competition.css';
import { isEmptyArray } from "formik";
import Loader from '../../customComponents/loader';
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import {getOrganisationId,  getCompetitonId, getUserId, getAuthToken, getSourceSystemFlag, getUserRegId,getExistingUserRefId } from "../../util/sessionStorage";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import { captializedString } from "../../util/helpers";
import { 
    getInviteTeamReviewProductAction
} from '../../store/actions/registrationAction/teamInviteAction';

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

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
    let isHardshipEnabled = props.isHardshipEnabled;
    let payload = props.payload;
    let registrationUniqueKey = props.registrationUniqueKey;
    
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
            stripeTokenHandler("", props, 'direct_debit', setClientKey, setRegId, payload, registrationUniqueKey);
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
            registrationId: registrationUniqueKey
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
        if (auBankAccount || card || isSchoolRegistration == 1 || isHardshipEnabled == 1) {
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

                    stripeTokenHandler(result.token, props, selectedPaymentOption.selectedOption,null, null, payload, registrationUniqueKey);
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
                        registrationId: regId,
                        userRegId: null,
                        paymentSuccess: true
                    })
                }
            }
            else if(isSchoolRegistration || isHardshipEnabled){
                props.onLoad(true)
                stripeTokenHandler(null, props, selectedPaymentOption.selectedOption,null, null, payload, registrationUniqueKey);
            }
        }
        else {
            if(!isSchoolRegistration && !isHardshipEnabled){
                message.config({
                    maxCount: 1, duration: 0.9
                })
                message.error(AppConstants.selectedPaymentOption)
            }
        }
    }

    return (
        // className="content-view"
        <div>
            <form id='my-form' className="form" onSubmit={handleSubmit} >
                {(paymentOptions.length > 0  && !isSchoolRegistration  && !isHardshipEnabled) ?
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
                            {(paymentOptions.length > 0 || isSchoolRegistration == 1 || isHardshipEnabled == 1) ?
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
            
        }
    }

    componentDidMount(){
        try{

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

    paymentLeftView = ()=>{
        try{
            return(
                <div className="col-sm-8 product-left-view outline-style">              
                    <div className="product-text-common" style={{fontSize:22}}>
                        {AppConstants.securePaymentOptions}
                    </div>  
                    <div>
                        {/* <Elements stripe={stripePromise} >
                            <CheckoutForm 
                            onLoad={(status)=>this.setState({onLoad: status})} 
                            paymentOptions={securePaymentOptions}
                            payload={registrationReviewList} 
                            registrationUniqueKey = {this.state.registrationUniqueKey}
                            isSchoolRegistration={isSchoolRegistration} 
                            isHardshipEnabled = {isHardshipEnabled}/>
                        </Elements> */}
                   </div>              
                </div>
            )
        }catch(ex){
            console.log("Error in paymentLeftView::"+ex);
        }
    }

    yourOrderView = () =>{
        try{
            return(
                <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                    <div className="product-text-common" style={{fontSize: 21}}>
                        {AppConstants.yourOrder}
                    </div>
                    {/* {(compParticipants || []).map((item, index) => {
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
                                </div>
                            ))}
                            <div style={{color: "var(--app-bbbbc6)"}}>
                                {paymentOptionTxt}
                                <span className="link-text-common pointer" 
                                onClick={() => this.goToRegistrationProducts()}
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
                        <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.subTotal}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.subTotal}</div>
                        </div>
                        <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.shipping}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.shipping}</div>
                        </div>
                        <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.gst}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.gst}</div>
                        </div>
                        <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.charityRoundUp}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.charityValue}</div>
                        </div>
                    </div>
                    <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.targetValue}</div>
                    </div> */}
                </div>
            )
        }catch(ex){
            console.log("Error in yourOrderView::"+ex);
        } 
    }

    buttonView = () =>{
        try{
            return(
            <div style={{marginTop:23}}>          
                <div style={{marginTop:23}}> 
                    <Button className="back-btn-text" style={{boxShadow: "0px 1px 3px 0px" , width:"100%",textTransform: "uppercase"}}
                    >
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
                        <Content>{this.contentView()}</Content>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamInviteState: state.teamInviteState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInvitePayment));