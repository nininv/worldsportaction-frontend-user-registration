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
    Radio, Form, Modal, message
} from "antd";
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
import { NavLink } from "react-router-dom";
import { liveScore_formateDate } from "../../themes/dateformate";
import {getRegistrationReviewAction,saveRegistrationReview,updateReviewInfoAction, } from 
            '../../store/actions/registrationAction/registrationProductsAction';
import ValidationConstants from "../../themes/validationConstant";
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;


class RegistrationProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
           buttonPressed: null,
           registrationUniqueKey: null
        };
    }

    componentDidMount(){
        //let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        // console.log("registrationUniqueKey"+registrationUniqueKey);
        let registrationUniqueKey = "ddd181dc-cf8a-4327-a28a-bfa6a789417b";
        this.setState({registrationUniqueKey: registrationUniqueKey});
        this.getApiInfo(registrationUniqueKey);
    }
    componentDidUpdate(nextProps){

    }  
    
    getApiInfo = (registrationUniqueKey) => {
        let payload = {
            registrationId: registrationUniqueKey
        }
        this.props.getRegistrationReviewAction(payload);
    }

    saveReviewForm = (e) =>{
        e.preventDefault();
        let registrationState = this.props.registrationProductState;
        let registrationReviewList = registrationState.registrationReviewList;
        let incompletePaymentMessage = this.checkPayment(registrationReviewList);
        if(incompletePaymentMessage != ''){
            incompletePaymentMessage = "Payment Options are not configured for " + incompletePaymentMessage + ". Please contact administrator.";
            message.error(incompletePaymentMessage);
            return;
        }else{
            incompletePaymentMessage = null;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
                let registrationReview = this.props.registrationProductState.registrationReviewList;
                registrationReview["registrationId"] = this.state.registrationUniqueKey;
                // let payload = {
                //     "registrationId": this.state.registrationUniqueKey,
                //     "charityRoundUpRefId":registrationReview.charityRoundUpRefId,
                //     "compParticipants":[]
                // }

                console.log("registrationReview", registrationReview);

                registrationReview.compParticipants.map((x, index) => {
                    let arr = [];
                    x.membershipProducts.map((y) => {
                        arr.push(...y.selectedDiscounts);
                     });
                     x.selectedOptions.selectedDiscounts = arr;
                });

              //  console.log("payload" + JSON.stringify(registrationReview));
                this.props.saveRegistrationReview(registrationReview);
                this.setState({loading: true});

            }
        });
    }

    checkPayment = (regReviewData) => {
        try{
            let competitionNames = '';
            let competitionNameMap = new Map();
            regReviewData.compParticipants.map((participant,index) =>{
                let paymentOptionTemp = participant.paymentOptions != null ? participant.paymentOptions.find((paymentOption) => paymentOption.paymentOptionRefId <= 5) : undefined;
                if(paymentOptionTemp == undefined){
                    if(competitionNameMap.get(participant.competitionName) == undefined){
                        competitionNameMap.set(participant.competitionName,index);
                            if(index == regReviewData.compParticipants.length - 1  && competitionNameMap.size != 1){
                                competitionNames = competitionNames.slice(0,-2);
                                competitionNames += " and " + participant.competitionName + ', ';
                            }else{
                                competitionNames += participant.competitionName + ', ';
                            }
                    }
                }
            });
            console.log("comp name::"+competitionNames);
            return competitionNames.slice(0,-2);
        }catch(error){
            throw error;
        }
    }

    getPaymentOptionText = (paymentOptionRefId) =>{
        let paymentOptionTxt =   paymentOptionRefId == 1 ? AppConstants.payAsYou : 
        (paymentOptionRefId == 2 ? AppConstants.gameVoucher : 
        (paymentOptionRefId == 3 ? AppConstants.payfullAmount : 
        (paymentOptionRefId == 4 ? AppConstants.weeklyInstalment : 
        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration: ""))));

        return paymentOptionTxt;
    }

    setReviewInfo = (value, key, index, subkey, subIndex) => {
        let registrationReview = this.props.registrationProductState.registrationReviewList;
        registrationReview["registrationId"] = this.state.registrationUniqueKey;
        // if(key == "isSelected"){
        //     let payload = {
        //         "competitionMembershipProductTypeId":value.competitionMembershipProductTypeId,
        //         "membershipMappingId": value.membershipMappingId,
        //         "code":value.selectedCode,
        //         "key": "discount"
        //     }
        //     if(value.selectedCode!= null && value.selectedCode!= ""){
        //         this.props.validateDiscountCode(payload, index, subIndex);
        //     }
        // }
        // else if (key == "isSchoolRegCodeApplied"){
        //     let payload = {
        //         "isTeamRegistration":value.isTeamRegistration,
        //         "competitionUniqueKey": value.competitionUniqueKey,
        //         "code":value.selectedOptions.selectedSchoolRegCode,
        //         "key": "school"
        //     }
        //     if(payload.code!= null && payload.code!= ""){
        //         this.props.validateDiscountCode(payload, index, subIndex);
        //     }
        // }
        // else{
        //     this.props.updateReviewInfoAction(value,key, index, subkey,subIndex);
        // }

        this.props.updateReviewInfoAction(value,key, index, subkey,subIndex);
        if(key == "paymentOptionRefId"){
           this.callSaveRegistrationProducts(key, registrationReview)
        }
       
    }

    callSaveRegistrationProducts = (flag, registrationReview) =>{
      
        registrationReview["flag"] = flag;
        console.log("registrationReview", registrationReview);
        this.props.saveRegistrationReview(registrationReview);
        this.setState({loading: true, buttonPressed: flag});
    }


    headerView = () =>{
        return(
            <div className="col-sm-8" style={{display:"flex" , justifyContent:"space-between" , paddingRight:0}}>
                <div className="product-text-common" style={{fontSize: 21}}> {AppConstants.participants}</div>
                <div style={{padding: 7}}>
                    <span className="btn-text-common pointer" style={{marginRight:0}}>
                        + {AppConstants.addAnotherParticipant}
                    </span>
                </div>
            </div>
        );

    }

    participantDetailView = () =>{
        const {registrationReviewList} = this.props.registrationProductState;
        console.log("registrationReviewList", this.props.registrationProductState);
        let compParticipants = registrationReviewList!= null ? 
                    isArrayNotEmpty(registrationReviewList.compParticipants) ?
                    registrationReviewList.compParticipants : [] : [];
        return(
            <div>
                {(compParticipants || []).map((item, index) =>(
                    <div>
                        {this.userInfoView(item, index)}
                        {this.productsView(item, index)}
                        {this.discountcodeView(item, index)}
                        {this.governmentVoucherView(item, index)}
                    </div>
                ))}
                
            </div>
        )
    } 

    userInfoView = (item, index) =>{
        return(
            <div>
                <div style={{display:"flex"}}>
                    <div className="circular--landscape">
                        {
                            item.photoUrl ? (
                                <img src={item.photoUrl} alt="" />
                            ):
                            (
                                <img src={AppImages.userIcon} alt=""/>     
                            )
                        }
                    </div>
                    <div style={{marginLeft:10}}>
                        <div className="product-text-common" style={{fontSize:21}}>{item.firstName + ' ' + item.lastName}</div>
                        <div className="product-text-common" style={{fontWeight:500}}>{item.gender + ', ' + 
                            liveScore_formateDate(item.dateOfBirth) == "Invalid date" ? "" : liveScore_formateDate(item.dateOfBirth)}
                        </div>
                    </div>
                    <div className="transfer-image-view pointer" style={{marginLeft: 'auto'}}>                   
                        <span className="btn-text-common">
                            {AppConstants.edit}
                        </span>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div> 
                    <div className="transfer-image-view pointer" style={{paddingLeft: '15px',}}>                   
                        <span className="btn-text-common">
                            {AppConstants.remove}
                        </span>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div> 
                </div>
                <div style={{display:"flex" , marginTop:30}}>
                     <div className="circular--landscape">
                     {
                            item.competitionLogoUrl ? (
                                <img src={item.competitionLogoUrl} alt="" />
                            ):
                            (
                                <img src={AppImages.userIcon} alt=""/>     
                            )
                        }              
                    </div>
                    <div style={{marginLeft:10}}>
                        <div className="product-text-common" style={{fontWeight:500}}>Competition</div>
                        <div className="product-text-common" style={{fontSize:21}}>{item.competitionName}</div>
                        <div className="product-text-common" style={{fontWeight:500}}>{item.organisationName}</div>
                    </div>
                </div>               
            </div>
        )
    }

    productsView = (item, index) =>{
        return(
            <div className="innerview-outline">
                <div style={{borderBottom:"1px solid var(--app-d9d9d9)", paddingBottom: "16px"}}>
                    <div className = "product-text-common" style={{fontWeight:500}}>
                        {AppConstants.registration}{"(s)"}
                    </div>
                    { (item.membershipProducts || []).map((mem, memIndex) =>(
                        <div className="product-text-common" style={{fontFamily: "inherit",fontSize: 16 ,marginTop: "5px"}}>
                            {mem.membershipTypeName + (mem.divisionId!= null ? ' - ' + mem.divisionName : "")}
                        </div>
                    )) }
                </div>               
                <div className="product-text-common" style={{fontFamily: "inherit" ,marginTop: "16px"}}>
                    {AppConstants.wouldYouLikeTopay}
                </div>
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group"
                        value={item.selectedOptions.paymentOptionRefId}
                        onChange={(e) => this.setReviewInfo(e.target.value, "paymentOptionRefId", index,"selectedOptions")}>  
                        {(item.paymentOptions || []).map((p, pIndex) =>(  
                            <span>
                                {p.paymentOptionRefId == 1 && 
                                    <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.payAsYou}</Radio>                    
                                }  
                                {p.paymentOptionRefId == 3 &&          
                                    <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.payfullAmount}</Radio>
                                }
                                { p.paymentOptionRefId == 4 &&          
                                    <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.weeklyInstalment}</Radio>
                                } 
                                { p.paymentOptionRefId == 5 &&          
                                   <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.schoolRegistration}</Radio>
                                } 

                            </span>                  
                        ))}
                    </Radio.Group>
                </div>
                {item.selectedOptions.paymentOptionRefId == 4 && 
                <div className="row" style={{marginTop: '20px'}}>
                    {(item.instalmentDates || []).map((i, iIndex) => (
                        <div className="col-sm-2">
                        <div>{(iIndex + 1) + " instalment"}</div>
                        <div>{(i.instalmentDate != null ? moment(i.instalmentDate).format("DD/MM/YYYY") : "")}</div>
                    </div>
                    )) }
                </div>}
            </div>
        )
    }

    discountcodeView = (item, index) =>{
        let selectedOptions = item.selectedOptions;
        return(
            <div>
                <div className="product-text-common" style={{fontSize: 21 , marginTop: "5px"}}>
                    {AppConstants.discountCode}
                </div>
                {(selectedOptions.selectedDiscounts || []).map((dis, disIndex) =>(
                    <div style={{display:"flex" , marginTop: "15px" , justifyContent:"space-between"}}>
                        <div style={{ width: "100%"}}>
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                placeholder={AppConstants.discountCode} 
                                value={dis.discountCode}
                                onChange={(e) => this.setReviewInfo(e.target.value, "discountCode", index,"selectedOptions", disIndex)}                      
                            />
                        </div>
                        
                        <div className="transfer-image-view pointer" style={{paddingLeft: '15px',}}>                   
                            <span className="user-remove-btn" 
                                    onClick={() => this.setReviewInfo(null, "removeDiscount", index,"selectedOptions", disIndex)}>
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                        </div>                    
                    </div>
                ))
                }
                <div style={{display: 'flex'}}>
                    <div style={{marginTop: "13px"}}>
                        <span className="btn-text-common pointer" style={{paddingTop: 7}}
                        onClick={(e) => this.setReviewInfo(null, "addDiscount", index,"selectedOptions")}>
                            + {AppConstants.addDiscountCode}
                        </span>
                    </div>  
                    {selectedOptions.selectedDiscounts.length > 0 && 
                    <div style={{marginLeft: 'auto', paddingTop:'15px'}}>
                        <Button className="open-reg-button"
                            onClick={(e) =>  this.setReviewInfo(null, "applyDiscountCode", index,"selectedOptions", null)}
                            type="primary">
                            {AppConstants.applyCode}
                        </Button>
                    </div> 
                    }
                </div>
            </div>
        )
    }

    governmentVoucherView = (item, index) =>{
        return(
            <div>
                <div className="product-text-common" style={{fontSize: 21 , marginTop: "30px"}}>
                    {AppConstants.governmentVouchers}
                </div>
                <div style={{display:"flex" , marginTop: "15px" , justifyContent:"space-between"}}>
                    <div style={{ width: "100%" , marginRight: "30px"}}>
                        <div className="product-text-common" style={{fontFamily:"inherit" , marginBottom:7}}>{AppConstants.favouriteTeam}</div>
                        <div>
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}                  
                                placeholder={AppConstants.selectVenue}                               
                            >
                                <Option value={1}>1</Option>     
                            </Select>
                        </div>
                    </div>                   
                    <div style={{ width: "100%"}}>
                        <div className="product-text-common" style={{fontFamily:"inherit" , marginBottom:7}}>{AppConstants.code}</div>
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            placeholder={AppConstants.discountCode}                       
                        />
                    </div>
                    <div className="transfer-image-view pointer" style={{paddingLeft: '15px',paddingTop:26}}>                   
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>                    
                </div>
                <div style={{marginTop: "13px"}}>
                    <span className="btn-text-common pointer" style={{paddingTop: 7}}>
                        + {AppConstants.addGovernmentVoucher}
                    </span>
                </div>                
            </div>
        )
    }

    charityView = () => {
        const {registrationReviewList} = this.props.registrationProductState;
        let charity = registrationReviewList!= null ? registrationReviewList.charity : null;
        let charityRoundUp = registrationReviewList!= null ? registrationReviewList.charityRoundUp : [];
        return(
            <div style={{marginTop: "23px"}}>   
                {charity!= null &&             
                <div className="product-text-common" style={{fontSize: 21 ,marginTop: "5px"}}>
                    {charity.name}
                </div>}
                {charity!= null && 
                <div className = "product-text-common" style={{fontWeight:500 ,  marginTop: "8px" ,width: "92%" }}>
                    {charity.description}
                </div>
                }
                {charityRoundUp.length > 0 &&
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group"
                     value={registrationReviewList.charityRoundUpRefId}
                     onChange={(e) => this.setReviewInfo(e.target.value, "charityRoundUpRefId", null,"charity")}>
                        {(charityRoundUp || []).map((x, cIndex) => (
                            <Radio key ={x.charityRoundUpRefId} value={x.charityRoundUpRefId}>{x.description}</Radio>  
                        ))}
                    </Radio.Group>
                </div>}
            </div>
        )
    }

    otherinfoView = () =>{
        return(
            <div style={{marginTop: "23px"}}>                  
            <div className="product-text-common" style={{fontSize: 21 ,marginTop: "5px"}}>
                {AppConstants.otherInformation}
            </div>
            <div className = "product-text-common" style={{fontWeight:500 ,  marginTop: "8px" ,width: "92%" , textAlign: "left"}}>
                {AppConstants.continuedSuccessOfOurClub}
            </div>
            <div style={{marginTop:6}}>
            <Checkbox className="single-checkbox">
                {AppConstants.coach}
            </Checkbox>
            </div>
        </div>
        )
    }

    contentView = () =>{
        return(
            <div style={{display:"flex"}}>
                {this.productLeftView()}
                {this.productRightView()}                
            </div>
        );
    }

    productLeftView = ()=>{
        return(
            <div className="col-sm-8 product-left-view outline-style">
                {this.participantDetailView()}
                {this.charityView()}
                {this.otherinfoView()}
            </div>
        )
    }

    productRightView = ()=>{
        return(
            <div className="product-right-view">
                {this.yourOrderView()}
                {this.termsAndConditionsView()}
                {this.buttonView()}
            </div>
        )
    }

    yourOrderView = () =>{
        const {registrationReviewList} = this.props.registrationProductState;
        let compParticipants = registrationReviewList!= null ? 
                    isArrayNotEmpty(registrationReviewList.compParticipants) ?
                    registrationReviewList.compParticipants : [] : [];
        return(
            <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                <div className="product-text-common" style={{fontSize: 21}}>
                    {AppConstants.yourOrder}
                </div>
                {(compParticipants || []).map((item, index) => {
                    let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId)
                    return(
                    <div style={{paddingBottom:12}}>
                        <div className = "product-text-common" style={{fontWeight:500 , marginTop: "17px"}}>
                            {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                        </div>
                        {(item.membershipProducts || []).map((mem, memIndex) =>(
                            <div>
                                <div  className="product-text-common mt-10" style={{display:"flex",fontSize:17}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{mem.membershipTypeName  + (mem.divisionId!= null ? ' - '+ mem.divisionName : '')}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>${mem.feesToPay}</div>
                                    <div>
                                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
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
                        </div>
                    </div> 
                    )}
                )}
                <div  className="product-text-common" style={{display:"flex" , fontWeight:500 ,borderBottom:"1px solid var(--app-e1e1f5)" , borderTop:"1px solid var(--app-e1e1f5)"}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto" , display: "flex",marginTop: "12px" , padding: "8px"}}>
                        <div>
                            <img src={AppImages.userIcon}/>
                        </div>
                        <div style={{marginLeft:"6px",fontFamily:"inter-medium"}}>
                            <div>
                                {AppConstants.vixensWarmUpShirt}
                            </div>
                            <div>(X1)</div>                               
                        </div>
                    </div>
                    <div className="alignself-center pt-5" style={{fontWeight:600 , marginRight:10}}>-$20</div>
                    <div style={{paddingTop:26}}>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>
                </div> 
                <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>$123.00</div>
                </div>
            </div>
        )
    }

    termsAndConditionsView = () =>{
        return(
            <div className="termsView-main outline-style" style={{padding: "36px 20px 36px 20px"}}>
                <span className="form-heading" style={{textAlign: "left"}}> {AppConstants.termsAndConditionsHeading} </span>
                <div className="pt-2">                  
                    <div className="pb-4 btn-text-common">
                    <a  target='_blank' >
                        {AppConstants.ConditionsForNetballQLD}
                    </a>
                    </div>                   
                </div>                           
                <div className="single-checkbox mt-0" style={{display:"flex"}}>
                    <div>
                        <Checkbox></Checkbox>
                    </div>
                    <span style={{marginLeft:"5px"}}> {AppConstants.agreeTerm}</span>                   
                </div>                      
            </div>
        )
    }

    buttonView = () =>{
        return(
            <div style={{marginTop:23}}>
                 <Button className="open-reg-button" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}>
                    {AppConstants.continue}
                </Button>     
            </div>
        )
    }
    
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{margin: "32px 40px 10px 40px"}}>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveRegistrationForm}
                        noValidate="noValidate"
                    >
                        <Content>
                        <Loader visible={this.props.registrationProductState.onRegReviewLoad} />
                            <div>
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>
                    </Form>
                </Layout>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getRegistrationReviewAction,
        saveRegistrationReview,
        updateReviewInfoAction,					 
    }, dispatch);

}

function mapStatetoProps(state){
    return {
       registrationProductState: state.RegistrationProductState 
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationProducts));
