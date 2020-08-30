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
import { getTeamRegistrationReviewAction,saveTeamRegistrationReview, updateTeamReviewInfoAction} from 
            '../../store/actions/registrationAction/endUserRegistrationAction';
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

class TeamRegistrationReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onInvLoad: false,
            buttonPressed: "",
            loading: false,
            userRegId: "",
            membershipData: null
        }
    }

    componentDidMount() {
         let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
        // console.log("registrationUniqueKey"+registrationUniqueKey);
        //let userRegId = "791e305e-9f1d-49a6-b9c3-6a2ca79b9364";
        this.setState({userRegId: userRegId});
        this.getApiInfo(userRegId);
    }

    componentDidUpdate(nextProps){
        let registrationState = this.props.endUserRegistrationState;

        if(registrationState.onRegReviewLoad == false && this.state.loading === true)
       {
            this.setState({ loading: false });
            if(!registrationState.error)
            {
                if (this.state.buttonPressed == "save" ) {
                    console.log("userRegId",this.state.userRegId)
                    history.push("/teamRegistrationReviewProducts", {
                        userRegId: this.state.userRegId
                    })
                }
            }
       }
    }

    getApiInfo = (userRegId) => {
        let payload = {
            userRegId: userRegId
        }
        this.props.getTeamRegistrationReviewAction(payload);
    }

    setReviewInfo = (value, key, index, subkey, subIndex) => {
        this.props.updateTeamReviewInfoAction(value,key, index, subkey,subIndex);
    }

    previousCall = () =>{
        this.setState({ buttonPressed: "previous" });
        history.push("/teamRegistrationForm", {
            userRegId: this.state.userRegId
        })
    }

    saveReviewForm = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
                let regTeamReviewData = this.props.endUserRegistrationState.regTeamReviewData;
                regTeamReviewData["userRegId"] = this.state.userRegId;

                console.log("registrationReview", regTeamReviewData);

              //  console.log("payload" + JSON.stringify(registrationReview));
                this.props.saveTeamRegistrationReview(regTeamReviewData);
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
        let {regTeamReviewData} = this.props.endUserRegistrationState;
        let participantList = regTeamReviewData!= null ? regTeamReviewData.compParticipants: [];
        let charityRoundUp = regTeamReviewData!= null ? regTeamReviewData.charityRoundUp : [];
        return (
            <div>
                {(participantList || []).map((item, index) => (
                <div  key={"part" + index}>
                   <div style={{backgroundColor: "#f7fafc", marginBottom: 40}}>
                            {this.productsView(getFieldDecorator, item, index)}
                    </div>
                </div>
                ))}
                
                { (charityRoundUp.length > 0)  && 
                    <div style={{ marginBottom: 40}}>
                        {this.charityView(getFieldDecorator)}
                    </div>
                }
            </div>
        )
    }

    productsView = (getFieldDecorator, item, index) => {
       
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        { AppConstants.teamRegistration}
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
                            {mem.membershipProductName + ' - ' + mem.membershipTypeName} 
                        </div>
                        <div>
                           ${mem.feesToPay}
                        </div>
                    </div>
                    { (mem.discountsToDeduct!= "0.00" && mem.discountsToDeduct != "" ) && 
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
                {/* {item.selectedOptions.governmentVoucherRefId!= null && 
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
                } */}
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
                </div>
                ))}
                </Radio.Group>
            </div>
        )
    }

    charityView = (getFieldDecorator) => {
        let {regTeamReviewData} = this.props.endUserRegistrationState;
        let charity = regTeamReviewData!= null ? regTeamReviewData.charity : null;
        let charityRoundUp = regTeamReviewData!= null ? regTeamReviewData.charityRoundUp : [];
        
        
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
                        value={regTeamReviewData.charityRoundUpRefId}
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
                         <Loader visible={this.props.endUserRegistrationState.onRegReviewLoad } />
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
        getTeamRegistrationReviewAction,
        saveTeamRegistrationReview,
        updateTeamReviewInfoAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamRegistrationReview));
