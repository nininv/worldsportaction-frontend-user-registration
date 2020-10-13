import React, { Component } from "react";
import {
    Layout,
    Button, 
    Form, 
    Input,
    Select,
    Radio, Modal, message
} from "antd";
import { connect } from 'react-redux';
import moment from 'moment';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import { bindActionCreators } from "redux";
import "./product.css";
import "../user/user.css";
import '../competition/competition.css';
import Loader from '../../customComponents/loader';
import {isArrayNotEmpty} from '../../util/helpers';
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { liveScore_formateDate } from "../../themes/dateformate";
import InputWithHead from "../../customComponents/InputWithHead";

import { 
    getTeamInviteReviewAction,saveTeamInviteReviewAction,
    updateTeamInviteAction
} from '../../store/actions/registrationAction/teamInviteAction';
import {getRegistrationShopProductAction } from 
            '../../store/actions/registrationAction/registrationProductsAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;


class TeamInviteProducts extends Component{
    constructor(props){
        super(props);
        this.state = {
            userRegId: null,
            productModalVisible: false,
            loading: false,
        }
    }

    componentDidMount(){
        try{
            //let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
            let userRegId = "bb881a03-6292-405a-8e49-d57f9e9ec9ce"
            this.setState({userRegId: userRegId});
            this.getApiInfo(userRegId);
        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            let teamInviteState = this.props.teamInviteState;
            let registrationProductState = this.props.registrationProductState;
            if(this.state.loading == true && teamInviteState.onTeamInviteReviewLoad == false){
                if(this.state.buttonPressed == "save"){
                    if(isArrayNotEmpty(registrationProductState.shopProductList)){
                        this.goToShop();
                    }else{
                        this.goToRegistrationPayments();
                    } 
                }
            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    goToShop = () =>{
        history.push({pathname: '/teamInviteShop', state: {userRegId: this.state.userRegId}})
    }

     
    getApiInfo = (userRegId) => {
        this.setState({onLoading: true});
        let payload = {
            userRegId: userRegId
        }
        this.props.getTeamInviteReviewAction(payload);
        this.getShopProducts(userRegId, 1, -1);
    }

    goToRegistrationPayments = () =>{
        history.push({pathname: '/registrationPayment', state: {userRegId: this.state.userRegId}})
    }

    
    getShopProducts = (userRegId, page, typeId) =>{
        let {registrationId} = this.props.teamInviteState;
        let payload = {
            registrationId: registrationId,
            userRegId: userRegId,
            typeId: typeId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }
        this.props.getRegistrationShopProductAction(payload);
    }

    getOrdinalString = (position) => {
        try{
            if((position % 10) == 1){
                return 'st';
            }else if((position % 10) == 2 && position != 12){
                return 'nd';
            }else if((position % 10) == 3 && position != 13){
                return 'rd';
            }else{
                return 'th';
            }
        }catch(ex){
            console.log("Error in getOrdinalString::"+ex);
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
        let teamInviteReview = this.props.teamInviteState.teamInviteReviewList;
        let registrationId = this.props.teamInviteState.registrationId;
        teamInviteReview["registrationId"] = registrationId;
        teamInviteReview["userRegId"] = this.state.userRegId;
        teamInviteReview["index"] = index;
        this.props.updateTeamInviteAction(value,key, index, subkey,subIndex);
        if(key == "paymentOptionRefId"){
           this.callSaveRegistrationProducts(key, teamInviteReview)
        }
        else if(key == "voucher"){
            this.callSaveRegistrationProducts(key, teamInviteReview)
        }
        else if(key == "removeVoucher"){
            this.callSaveRegistrationProducts("voucher", teamInviteReview);
        }
    }

    callSaveRegistrationProducts = (key, teamInviteReview) =>{
        try{
            teamInviteReview["key"] = key;
            console.log("teamInviteReview" , teamInviteReview);
            this.props.saveTeamInviteReviewAction(teamInviteReview);
            this.setState({loading: true, buttonPressed: key});
        }catch(ex){
            console.log("Error in callSaveRegistrationProducts::"+ex);
        }
    }

    teamInviteProductSave = (e) => {
        try{
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                    let {teamInviteReviewList, registrationId} = this.props.teamInviteState;
                    teamInviteReviewList["registrationId"] = registrationId;
                    teamInviteReviewList["userRegId"] = this.state.userRegId;
                    console.log("teamInviteReviewList", teamInviteReviewList);
                    this.callSaveRegistrationProducts("save", teamInviteReviewList);
                }
            });
        }catch(ex){
            console.log("Error in ");
        }
    }
    

    headerView = () => {
        try{
            return(
                <div style={{display:"flex",flexWrap: "wrap" , width:"105%"}}>
                    <div className="headline-text-common col-lg-6" style={{padding:0,marginLeft: "20px"}}> {AppConstants.participant}</div>
                </div>
            );
        }catch(ex){
            console.log("Error in headerView::"+ex);
        }
    }

    userInfoView = (item, index) => {
        try{
            return(
                <div>
                    <div style={{display:"flex",flexWrap:'wrap'}}>
                        <div className="circular--landscape" style={{height: "67px" , width: "67px"}}>
                        {
                            item.photoUrl ? (
                                <img src={item.photoUrl}/>
                            ):
                            (
                                <img src={AppImages.userIcon} alt=""/>     
                            )
                        }
                        </div>
                        <div class="pt-3 pl-2" style={{marginLeft:10,marginRight: "auto"}}>
                            <div className="headline-text-common">{item.firstName + ' ' + item.lastName}</div>
                            <div className="body-text-common">{item.gender + ', ' + 
                                liveScore_formateDate(item.dateOfBirth) == "Invalid date" ? "" : liveScore_formateDate(item.dateOfBirth)}
                            </div>
                        </div>
                    
                        <div className="transfer-image-view pointer" style={{paddingRight:"15px"}}>                   
                            <span className="link-text-common" style={{margin: "0px 15px 0px 10px"}}>
                                {AppConstants.edit}
                            </span>
                            <span className="user-remove-btn" ><img class="marginIcon" src={AppImages.editIcon} /></span>
                        </div> 
                    </div>
                    <div style={{display:"flex" , marginTop:30}}>
                     <div className="circular--landscape" style={{height: "67px" , width: "67px"}}>
                     {
                            item.competitionLogoUrl ? (
                                <img src={item.competitionLogoUrl} alt="" />
                            ):
                            (
                                <img src={AppImages.userIcon} alt=""/>     
                            )
                        }              
                    </div>
                    <div class = "pt-3 pl-2" style={{marginLeft:10}}>
                        <div className="body-text-common">Competition</div>
                        <div className="headline-text-common">{item.competitionName}</div>
                        <div className="body-text-common">{item.organisationName}</div>
                    </div>
                </div>   
                </div>
            )
        }catch(ex){
            console.log("Error in userInfoView::"+ex);
        }
    }

    productsView = (item, index) => {
        try{
            return(
                <div className="innerview-outline">
                    <div style={{borderBottom:"1px solid var(--app-d9d9d9)", paddingBottom: "16px"}}>
                        <div className = "body-text-common">
                            {AppConstants.registration}{"(s)"}
                        </div>
                        { (item.membershipProducts || []).map((mem, memIndex) =>(
                            <div key={mem.competitionMembershipProductTypeId + "#" + memIndex} className="subtitle-text-common" 
                            style={{fontFamily: "inherit",fontSize: 16 ,marginTop: "5px"}}>
                                {mem.membershipTypeName + (mem.divisionId!= null ? ' - ' + mem.divisionName : "")}
                            </div>
                        )) }
                    </div>
                                
                    <div className="subtitle-text-common" style={{marginTop: "16px"}}>
                        {AppConstants.wouldYouLikeTopay}
                    </div>
                    <div style={{marginTop:6}}>
                        <Radio.Group className="body-text-common"
                            value={item.selectedOptions.paymentOptionRefId}
                            onChange={(e) => this.setReviewInfo(e.target.value, "paymentOptionRefId", index,"selectedOptions")}>  
                            {(item.paymentOptions || []).map((p, pIndex) =>(  
                                <span key={p.paymentOptionRefId}>
                                    {p.paymentOptionRefId == 1 && 
                                        <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.payAsYou}</Radio>                    
                                    }  
                                    {p.paymentOptionRefId == 3 &&          
                                        <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.payfullAmount}</Radio>
                                    }
                                    { p.paymentOptionRefId == 4 &&          
                                        <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.weeklyInstalment}</Radio>
                                    } 
                                    {/* { p.paymentOptionRefId == 5 &&          
                                    <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.schoolRegistration}</Radio>
                                    }  */}

                                </span>                  
                            ))}
                        </Radio.Group>
                    </div>
                    {item.selectedOptions.paymentOptionRefId == 4 && 
                    <div className="row" style={{marginTop: '20px'}}>
                        {(item.instalmentDates || []).map((i, iIndex) => (
                            <div className="col-sm-3" key={iIndex}>
                            <div>{(iIndex + 1) + this.getOrdinalString(iIndex + 1) +" instalment"}</div>
                            <div>{(i.instalmentDate != null ? moment(i.instalmentDate).format("DD/MM/YYYY") : "")}</div>
                        </div>
                        )) }
                    </div>}
                </div>
            )
        }catch(ex){
            console.log("Error in productsView::"+ex);
        }
    }

    governmentVoucherView = (item, index) =>{
        let selectedVouchers = item.selectedOptions.vouchers;
        return(
            <div>
                {isArrayNotEmpty(selectedVouchers) && (
                    <div className="headline-text-common" style={{marginTop: "30px"}}>
                        {AppConstants.governmentVouchers}
                    </div>
                )}
                {(selectedVouchers || []).map((gov, govIndex) =>(
                    <div className="row">
                        <div class ="col-sm-11 col-lg-6"  style={{ width: "100%",margin: "15px 0px 0px 0px"}}>
                            <div className="subtitle-text-common" style={{marginBottom:7}}>{AppConstants.favouriteTeam}</div>
                            <div>
                                <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182  }}  
                                        required={"required-field pt-0 pb-0"}
                                        className="input-inside-table-venue-court"
                                        onChange={(e) => this.setReviewInfo(e, "governmentVoucherRefId", index,"selectedOptions", govIndex)}
                                        value={gov.governmentVoucherRefId}
                                        placeholder={'Code'}>
                                        {(item.governmentVouchers || []).map((gv, gvIndex) => (
                                                <Option key={gv.governmentVoucherRefId + "#" + gvIndex} 
                                                value={gv.governmentVoucherRefId} >{gv.description}</Option>
                                            ))
                                        }
                                    
                                    </Select>
                            </div>
                        </div>                   
                        <div class="col-sm-11 col-lg-5 col-9" style={{ width: "100%",margin: "15px 0px 0px 0px"}} >
                            <div className="subtitle-text-common" style={{marginBottom:7}}>{AppConstants.code}</div>
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                placeholder={AppConstants.code}  
                                value={gov.voucherCode} 
                                onChange={(e) => this.setReviewInfo(e.target.value, "voucherCode", index,"selectedOptions", govIndex)}                    
                            />
                        </div>
                        <div className="transfer-image-view pointer" style={{paddingLeft: '15px',paddingTop:44}}
                            onClick={() => this.setReviewInfo(null, "removeVoucher", index,"selectedOptions", govIndex)}>                   
                            <span className="user-remove-btn" >
                                <img class="marginIcon" src={AppImages.removeIcon} />
                            </span>
                        </div>    
                        {gov.isValid == 0 && 
                        <div className="ml-4 discount-validation" style={{alignSelf:"center"}}>
                            {gov.message}
                        </div>
                        }                          
                    </div>
                ))}
                <div style={{display: 'flex',flexWrap:"wrap",justifyContent:"space-between",width: "99%"}}>
                    {isArrayNotEmpty(item.governmentVouchers) && (
                        <div style={{marginTop: "13px", alignSelf: "center"}}>
                            <span className="btn-text-common pointer" style={{paddingTop: 7}} 
                                    onClick={() => this.setReviewInfo(null, "addVoucher", index,"selectedOptions", null)}>
                                + {AppConstants.addGovernmentVoucher}
                            </span>
                        </div>  
                    )}
                    {selectedVouchers && selectedVouchers.length > 0 && 
                    <div style={{paddingTop:'15px'}}>
                        <Button className="open-reg-button"
                            onClick={(e) =>  this.setReviewInfo(null, "voucher", index,null, null)}
                            type="primary">
                            {AppConstants.applyCode}
                        </Button>
                    </div> 
                    }   
                </div>           
            </div>
        )
    }

    productLeftView = (getFieldDecorator)=>{
        const {teamInviteReviewList} = this.props.teamInviteState;
        //console.log("registrationReviewList", this.props.registrationProductState);
        let compParticipants = teamInviteReviewList!= null ? 
                    isArrayNotEmpty(teamInviteReviewList.compParticipants) ?
                    teamInviteReviewList.compParticipants : [] : [];
        try{
            return(
                (compParticipants || []).map((item, index) =>(
                    <div className="col-sm-12 col-md-8 col-lg-8 " key={index}>
                        <div className="product-left-view outline-style">
                            {this.userInfoView(item, index)}
                            {this.productsView(item, index)}
                            {this.governmentVoucherView(item, index)}
                        </div>
                    </div>
                ))
            )
        }catch(ex){
            console.log("Error in productLeftView::"+ex);
        }
    }

    yourOrderView = (getFieldDecorator) => {
        const {teamInviteReviewList} = this.props.teamInviteState;
        let compParticipants = teamInviteReviewList!= null ? 
                    isArrayNotEmpty(teamInviteReviewList.compParticipants) ?
                    teamInviteReviewList.compParticipants : [] : [];
        let total = teamInviteReviewList!= null ? teamInviteReviewList.total : null;
        let shopProducts = teamInviteReviewList!= null ? 
                            isArrayNotEmpty(teamInviteReviewList.shopProducts) ?
                            teamInviteReviewList.shopProducts : [] : [];
        try{
            return(
                <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                    <div className="headline-text-common">
                        {AppConstants.yourOrder}
                    </div>
                    {(compParticipants || []).map((item, index) => {
                        let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId)
                        return(
                        <div style={{paddingBottom:12}} key={item.participantId + "#" + index}>
                            <div className = "body-text-common" style={{marginTop: "17px"}}>
                                {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                            </div>
                            {(item.membershipProducts || []).map((mem, memIndex) =>(
                                <div key={mem.competitionMembershipProductTypeId + "#" + memIndex}>
                                    <div  className="subtitle-text-common mt-10" style={{display:"flex"}}>
                                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{mem.membershipTypeName  + (mem.divisionId!= null ? ' - '+ mem.divisionName : '')}</div>
                                        <div className="alignself-center pt-2" style={{marginRight:10}}>${mem.feesToPay}</div>
                                    </div>
                                    
                                    {mem.discountsToDeduct!= "0.00" && 
                                    <div  className="body-text-common mr-4" style={{display:"flex"}}>
                                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                                        <div className="alignself-center pt-2" style={{marginRight:10}}>(${mem.discountsToDeduct})</div>
                                    </div>
                                    }
                                    {/* {mem.childDiscountsToDeduct!= "0.00" && 
                                    <div  className="body-text-common mr-4" style={{display:"flex"}}>
                                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.familyDiscount}</div>
                                        <div className="alignself-center pt-2" style={{marginRight:10}}>(${mem.childDiscountsToDeduct})</div>
                                    </div>
                                    } */}
                                   
                                </div>
                            ))}
                             
                            <div style={{color: "var(--app-bbbbc6)" , fontFamily: "inter"}}>
                                {paymentOptionTxt}
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
                        <div  className="subtitle-text-common" style={{display:"flex" , fontWeight:500 ,borderBottom:"1px solid var(--app-e1e1f5)" , borderTop:"1px solid var(--app-e1e1f5)"}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto" , display: "flex",marginTop: "12px" , padding: "8px"}}>
                                <div>
                                    <img style={{width:'50px'}} src={shop.productImgUrl ? shop.productImgUrl : AppImages.userIcon}/>
                                </div>
                                <div style={{marginLeft:"6px"}}>
                                    <div>
                                        {shop.productName}
                                    </div>
                                    <div>({shop.optionName})</div>                               
                                </div>
                            </div>
                            <div className="alignself-center pt-5" style={{fontWeight:600 , marginRight:10}}>${shop.totalAmt ? shop.totalAmt.toFixed(2): '0.00'}</div>
                            <div style={{paddingTop:26}} onClick ={() => this.removeFromCart(index,'removeShopProduct', 'shopProducts')}>
                                <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                            </div>
                        </div>
                    ))} 
                    <div  className="subtitle-text-common mt-10 mr-4" style={{display:"flex"}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.targetValue}</div>
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in yourOrderView::"+ex);
        }
    } 

    buttonView = () => {
        try{
            return(
                <div style={{marginTop:23}}>
                     <Button className="open-reg-button link-text-common" 
                      htmlType="submit"
                      type="primary"
                     style={{ width:"100%",textTransform: "uppercase"}}>
                        {AppConstants.continue}
                    </Button>     
                </div>
            )
        }catch(ex){
            console.log("Error in buttonView::"+ex);
        }
    }

    productRightView = (termsAndConditionsView)=>{
        return(
            <div className="col-lg-4 col-md-4 col-sm-12 product-right-view" style={{paddingLeft:0,paddingRight:0}}>
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    contentView = (getFieldDecorator) =>{
        return(
            <div className="row" style={{margin:0}}>
                {this.productLeftView(getFieldDecorator)}
                {this.productRightView(getFieldDecorator)}                
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
                    {this.headerView()}
                    <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.teamInviteProductSave}
                        noValidate="noValidate">
                        <Content>
                            <Loader visible={this.props.teamInviteState.onTeamInviteReviewLoad || 
                            this.props.teamInviteState.teamInviteProductsOnLoad} />
                            {this.contentView(getFieldDecorator)}</Content>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
        getTeamInviteReviewAction,
        saveTeamInviteReviewAction,
        updateTeamInviteAction,
        getRegistrationShopProductAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamInviteState: state.TeamInviteState,
        registrationProductState: state.RegistrationProductState,
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInviteProducts));