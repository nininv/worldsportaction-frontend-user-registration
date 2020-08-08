import React, { Component } from "react";
import {
    Layout,Breadcrumb,Input,Select,Checkbox,Button, Table,DatePicker,Radio, Form, Modal, message
} from "antd";

import AppConstants from "../../themes/appConstants";
import "../../pages/layout.css";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import InputWithHead from '../../customComponents/InputWithHead';
import moment from 'moment';
import history from "../../util/history";
import { getRegistrationReviewAction,saveRegistrationReview, updateReviewInfoAction,
    validateDiscountCode} from 
            '../../store/actions/registrationAction/endUserRegistrationAction';
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

class RegistrationReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onInvLoad: false,
            buttonPressed: "",
            loading: false,
            registrationUniqueKey: "",
            membershipData: null
        }
        this.getReferenceData();
    }

    componentDidMount() {
         let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        // console.log("registrationUniqueKey"+registrationUniqueKey);
        //let registrationUniqueKey = "419c80a7-bd25-4825-a115-145697d591fb";
        this.setState({registrationUniqueKey: registrationUniqueKey});
        this.getApiInfo(registrationUniqueKey);
    }

    componentDidUpdate(nextProps){
        let registrationState = this.props.endUserRegistrationState;

        if(registrationState.onRegReviewLoad == false && this.state.loading === true)
       {
            this.setState({ loading: false });
            if(!registrationState.error)
            {
                if (this.state.buttonPressed == "save" ) {
                    let registrationId=registrationState.registrationId
                    console.log("registrationId",registrationId)
                    history.push("/reviewProducts", {
                        registrationId: this.state.registrationUniqueKey
                    })
                }
            }
       }
    }

    getApiInfo = (registrationUniqueKey) => {
        let payload = {
            registrationId: registrationUniqueKey
        }

        this.props.getRegistrationReviewAction(payload);
    }
  
    getReferenceData = () => {
    }

    setReviewInfo = (value, key, index, subkey, subIndex) => {
        if(key == "isSelected"){
            let payload = {
                "competitionMembershipProductTypeId":value.competitionMembershipProductTypeId,
                "membershipMappingId": value.membershipMappingId,
                "code":value.selectedCode
            }

            this.props.validateDiscountCode(payload, index, subIndex);
        }
        else{
            this.props.updateReviewInfoAction(value,key, index, subkey,subIndex);
        }
    }

    previousCall = () =>{
        this.setState({ buttonPressed: "previous" });
        history.push("/appRegistrationForm", {
            registrationId: this.state.registrationUniqueKey
        })
    }

    saveReviewForm = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
                let registrationReview = this.props.endUserRegistrationState.registrationReviewList;
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
                            {AppConstants.appRegoForm}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>

            </div>
        );
    };

    contentView = (getFieldDecorator) => {
        let {registrationReviewList} = this.props.endUserRegistrationState;
        let participantList = registrationReviewList!= null ? registrationReviewList.compParticipants: [];
        return (
            <div>
                {(participantList || []).map((item, index) => (
                <div  key={"part" + index}>
                    {(item.isTeamRegistration == 0 || item.isTeamRegistration == 1) &&
                        <div style={{backgroundColor: "#f7fafc", marginBottom: 40}}>
                            {this.productsView(getFieldDecorator, item, index)}
                        </div>
                    }
                     {/* {item.isTeamRegistration == 1 &&
                        <div style={{ marginBottom: 40}}>
                                {this.teamView(getFieldDecorator, item, index)}
                        </div>
                    } */}
                </div>
                ))}
               <div style={{ marginBottom: 40}}>
                    {this.charityView(getFieldDecorator)}
               </div>
            </div>
        )
    }

    productsView = (getFieldDecorator, item, index) => {
        let registrationState = this.props.endUserRegistrationState;
       
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        {item.isTeamRegistration == 0 ? AppConstants.individualRegistration :
                            AppConstants.teamRegistration}
                        {AppConstants.hyphen}
                        {item.firstName + ' ' + item.lastName}
                        {AppConstants.hyphen}
                        {item.organisationName}    
                        {AppConstants.hyphen}
                        {item.competitionName}     
                    </div>
                </div>
                {(item.membershipProducts || []).map((mem, memIndex) =>(
                <div key = {memIndex}>
                    <div className='membership-text'>
                        <div>
                            {mem.name} 
                        </div>
                        <div>
                           ${mem.feesToPay}
                        </div>
                    </div>
                    { mem.isDiscountApplied == 1 && 
                    <div className='membership-text' style={{marginTop:0}}>
                        <div>
                            <span className="number-text-style" style={{fontWeight:500}}>{AppConstants.less}</span>
                            <span>{":"+" "}</span>
                            <span>{AppConstants.discount}</span>
                        </div>
                        <div className="number-text-style">
                            (${mem.discountsToDeduct})
                        </div>
                    </div>
                     }
                </div>
                ))}
                {item.selectedOptions.governmentVoucherRefId!= null && 
                <div className='membership-text' style={{marginTop:0}}>
                    <div>
                        <span className="number-text-style">{AppConstants.less}</span>
                        <span>{":"+" "}</span>
                        <span>{AppConstants.governmentSportVouchers + item.selectedOptions.governmentVoucherCode}</span>
                    </div>
                    <div className="number-text-style">
                        (${item.selectedOptions.governmentVoucherValue!= null ? item.selectedOptions.governmentVoucherValue : 0})
                    </div>
                </div>  
                }
                {/* <div className='membership-text' style={{marginTop:4 , marginBottom:31}}>
                    <div>
                    <span className="number-text-style">{AppConstants.less}</span>                    
                    <span>{":"+" "}</span>                       
                    <span>{AppConstants.hardshipPlayer}</span>
                    </div>
                    <div className="number-text-style">
                        ($20)
                    </div>
                </div>                */}
                <Radio.Group className="reg-competition-radio" style={{marginBottom:10}}
                value={item.selectedOptions.paymentOptionRefId}
                onChange={(e) => this.setReviewInfo(e.target.value, "paymentOptionRefId", index,"selectedOptions")}
                >
                {(item.paymentOptions || []).map((p, pIndex) =>(
                <div style={{marginTop: '15px'}}>
                    {p.paymentOptionRefId == 1 && 
                        <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.payAsYou}</Radio>                    
                    }
                    {p.paymentOptionRefId == 2 && 
                        <div>
                            <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.gameVoucher}</Radio>
                            <Radio.Group className="reg-competition-radio" 
                                value={item.selectedOptions.gameVoucherValue}
                                onChange={(e) => this.setReviewInfo(e.target.value, "gameVoucherValue", index,"selectedOptions")}
                            style={{marginLeft:30}}>
                                {(item.gameVouchers || []).map((g, gIndex) => (
                                <Radio key={g} value={g}>{g}</Radio>  
                                ))}
                            </Radio.Group>  
                        </div>
                    }   
                    <div>
                        {p.paymentOptionRefId == 3 &&          
                            <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.payfullAmount}</Radio>
                        }
                        { p.paymentOptionRefId == 4 &&          
                            <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.weeklyInstalment}</Radio>
                        } 
                    </div>   
                    { p.paymentOptionRefId == 4 &&  item.instalmentDates.length > 0 &&                   
                    <div className="heading-instalmentdate">
                        <div className="text-instalmentdate">{AppConstants.instalmentDates}</div>
                        {(item.instalmentDates || []).map((i, iIndex) => (
                            <span>{(i.instalmentDate != null ? moment(i.instalmentDate).format("DD/MM/YYYY") : "") +
                                     (item.instalmentDates.length != (iIndex + 1) ?   ', ' : '')}</span>
                        )) }
                    </div>   
                    }
                    {p.paymentOptionRefId == 5 &&
                    <div style={{marginTop:5}}>
                        <Radio key={p.paymentOptionRefId} value={p.paymentOptionRefId}>{AppConstants.schoolRegistration}</Radio>
                    </div>
                    }
                </div>
                ))}
                </Radio.Group>
                {item.selectedOptions.paymentOptionRefId != 5 &&
                <div>
                    {(item.membershipProducts || []).map((mem, memIndex) =>(
                    <div>
                        {(mem.discounts.length > 0 && memIndex == 0) &&
                         <div style={{marginLeft:8}}>
                            <InputWithHead heading={AppConstants.discounts}/>
                        </div>
                        }
                        { mem.discounts.length > 0 && 
                        <div className="inputfield-style">                    
                            <div className="row" style={{marginLeft:0 , marginTop: 12}}>
                                <div  className="" style={{paddingLeft: 9, alignSelf: "center" , marginRight: 30}}>
                                    {mem.name} 
                                </div>
                                <div style={{ marginRight: 30}}>
                                    <InputWithHead 
                                        placeholder={AppConstants.code} 
                                        onChange={(e) => this.setReviewInfo(e.target.value, "selectedCode", index,"selectedOptions", memIndex)}
                                        value={mem.selectedCode}/>
                                </div>
                                <div className="" style={{alignSelf:"center"}}>
                                    {mem.isDiscountApplied == 1 ?
                                    <Button className="open-reg-button"
                                        onClick={(e) =>  this.setReviewInfo(e, "removeCode", index,"selectedOptions", memIndex)}
                                        type="primary">
                                        {AppConstants.removeCode}
                                    </Button> : 
                                    <Button className="open-reg-button"
                                    onClick={(e) =>  this.setReviewInfo(mem, "isSelected", index,"selectedOptions", memIndex)}
                                    type="primary">
                                    {AppConstants.applyCode}
                                </Button>}
                                </div>   
                                {mem.invalidCode == 1 && 
                                <div className="ml-4 discount-validation" style={{alignSelf:"center"}}>
                                    Invalid code
                                </div>
                                }
                            </div>                   
                        </div>}
                    </div>
                    ))}
                </div> }
                {item.governmentVouchers.length > 0 && 
                <div>
                    <div style={{marginLeft: 7,marginTop: 10}}>
                        <Checkbox className="single-checkbox mt-3" style={{color: "inherit"}}
                            checked={item.selectedOptions.isGovernmentVoucherChecked}
                            onChange={(e) => this.setReviewInfo(e.target.checked, "isGovernmentVoucherChecked", index,"selectedOptions")}>
                        {AppConstants.governmentSportsVoucher}
                        </Checkbox>
                    </div>
                    {item.selectedOptions.isGovernmentVoucherChecked == 1 && 
                    <div className="row" style={{marginLeft: 26 , marginTop: 12}}>
                        <div className="col-sm">
                            <InputWithHead required="pt-0" heading={'Type'} />
                            <Select
                                    required={"required-field pt-0 pb-0"}
                                    className="input-inside-table-venue-court team-mem_prod_type"
                                    onChange={(e) => this.setReviewInfo(e, "governmentVoucherRefId", index,"selectedOptions")}
                                    value={item.selectedOptions.governmentVoucherRefId}
                                    placeholder={'Code'}>
                                    {(item.governmentVouchers || []).map((gv, gvIndex) => (
                                            <Option key={gv.governmentVoucherRefId} 
                                            value={gv.governmentVoucherRefId} >{gv.description}</Option>
                                        ))
                                    }
                                
                                </Select>
                        </div>
                        <div className="col-sm">
                            <InputWithHead placeholder={"Code"} required="pt-0" heading={'Code'}
                            value ={item.selectedOptions.governmentVoucherCode} 
                            onChange={(e) => this.setReviewInfo(e.target.value, "governmentVoucherCode", index,"selectedOptions")}/>
                        </div>    
                    </div> }
                </div>
                }
            </div>
        )
    }

    charityView = (getFieldDecorator) => {
        let {registrationReviewList} = this.props.endUserRegistrationState;
        let charity = registrationReviewList!= null ? registrationReviewList.charity : null;
        let charityRoundUp = registrationReviewList!= null ? registrationReviewList.charityRoundUp : [];
        return (
            <div className = "individual-reg-view">
                 {charity!= null &&
                <div className = "individual-header-view">
                    <div>
                        {charity.name}
                    </div>     
                </div>
                }
                {charity!= null && 
                <div style={{marginTop:12}}>
                   {charity.description}
                </div>
                }
                {charityRoundUp.length > 0 && 
                <div style={{marginTop:10}}>
                    <Radio.Group className="reg-competition-radio" 
                        value={registrationReviewList.charityRoundUpRefId}
                        onChange={(e) => this.setReviewInfo(e.target.value, "charityRoundUpRefId", null,"charity")}>
                        {(charityRoundUp || []).map((x, cIndex) => (
                        <Radio key ={x.charityRoundUpRefId} value={x.charityRoundUpRefId}>{x.description}</Radio>  
                        ))}
                  
                    </Radio.Group>  
                </div>  
                }                         
            </div>
        )
    }


    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view" style={{padding:0}}>
                    <div style={{display:"flex" , justifyContent:"space-between"}}>
                        <Button className="save-draft-text" type="save-draft-text"
                            onClick={() => this.previousCall()}>
                            {AppConstants.previous}
                        </Button>
                        <Button
                            className="open-reg-button"
                            htmlType="submit"
                            type="primary"
                            disabled={isSubmitting}
                            onClick={() => this.setState({ buttonPressed: "save" })}>
                            {AppConstants.next}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" >
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{ paddingLeft : 35 ,paddingRight : 35}}>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveReviewForm}
                        noValidate="noValidate"
                        className="form-review">
                        <Content>
                            <div>
                                {this.contentView(getFieldDecorator)}
                            </div>
                         <Loader visible={this.props.endUserRegistrationState.onRegReviewLoad || 
                                this.props.endUserRegistrationState.onDiscountCodeValidLoad } />
                        </Content>
                        <Footer style={{paddingRight:'2px', paddingLeft: '2px'}}>{this.footerView()}</Footer>
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
        validateDiscountCode
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationReviewForm));
