import React, { Component } from "react";
import { Layout, Radio, message } from 'antd';
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import AppConstants from "../../themes/appConstants";
import "../../pages/layout.css";
import { setAuthToken, setUserId, setUserRegId, getAuthToken, getUserId, setExistingUserRefId, setRegisteringYourselfRefId } from '../../util/sessionStorage'
import { clearRegistrationDataAction } from '../../store/actions/registrationAction/endUserRegistrationAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
const { Content, Header } = Layout;

const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c95d69a0e179191e4422d8df456c7dc7268069d560e9e677eb64ca0d506751ea12c34b087a73bc319ba9b17a67ffc69fde351109f091cb2e64e6a60042bcbb11bf6d73e2be792c9658cc5604e115967a82eb0f2f944a1e2950e0116df2065b0ba2fb5dcf34f9341f6b7b6f2e64839339d24123ea015526f05fe22cec9cf96aa86ff990588beafbc3675f550605d72d25247';
const userId = 0;
class TeamRegistration extends Component {
    constructor(props) {
        super(props);
        //this.props.clearRegistrationDataAction();
        this.state = {
            existingUserRefId: null,
            registeringYourselfRefId: null
        }
    }

    async componentWillMount(){
        await localStorage.clear();
    }

    async componentDidMount() {
       // console.log("componentDidMount");
        const query = this.queryfie(this.props.location.search);
        let userRegUniqueKey = query.userRegId;
        let userId = query.userId;
        let token = query.token;
        console.log("userRegUniqueKey::" + userRegUniqueKey);
        if(userRegUniqueKey!= undefined)
        {
            await setUserRegId(userRegUniqueKey);
        }

        if(userId!= undefined && token!= undefined){
            await setUserId(userId);
            await setAuthToken(token);
        }
        else{
            let authToken = await getAuthToken();
            let userIdFromStorage = await getUserId();
            if(userIdFromStorage!= undefined && authToken!= undefined && 
                userIdFromStorage!= null && authToken!= null && 
                userIdFromStorage!= "" && authToken!= "" &&
                userIdFromStorage!= 0)
                {
                   userId = userIdFromStorage;
                   token = authToken;
                }
        }

        // if(userId!= undefined && token!= undefined && 
        //     userId!= null && token!= null && 
        //     userId!= "" && token!= "" &&
        //     userId!= 0)
        //     {
        //         history.push("/teamRegistrationForm")
        //     }
    }


    parseHttpHeaders(httpHeaders) {
        return httpHeaders.split("\n")
         .map(x=>x.split(/: */,2))
         .filter(x=>x[0])
         .reduce((ac, x)=>{ac[x[0]] = x[1];return ac;}, {});
    }

    queryfie(string){
        return string
            .slice(1)
            .split('&')
            .map(q => q.split('='))
            .reduce((a, c) => { a[c[0]] = c[1]; return a; }, {});
    }

    


    onChange = async(value) => {
        this.setState({existingUserRefId: value});
    }

    onChangeRegYourself = async(value) => {
        setRegisteringYourselfRefId(value);
        setExistingUserRefId(this.state.existingUserRefId);
        if(this.state.existingUserRefId == 1){
            await localStorage.removeItem("userId");
            await localStorage.removeItem("token");
            history.push("/login")
        }
        else if(this.state.existingUserRefId == 2){
            await setUserId(userId);
            await setAuthToken(token);
            history.push("/teamRegistrationForm")
        }
    }

    headerView = () => {
        return (
            <Header className="site-header">
                <div className="header-wrap">
                    <div className="row m-0-res">
                        <div className="col-sm-12 d-flex">
                            <div className="logo-box">
                                <img src={AppImages.netballLogo1} alt="" />
                                <div className="col-sm dashboard-layout-menu-heading-view">
                                    <span className="dashboard-layout-menu-heading">
                                        {this.props.menuHeading}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Header>
        )
    }

    registeringYourselfView = () => {
        return (
            <div className="content-view">
                <InputWithHead heading={AppConstants.teamRegisteringYourself} required={"required-field"}></InputWithHead>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeRegYourself(e.target.value)}>
                    <Radio value={1}>{AppConstants.yes}</Radio>
                    <Radio value={2}>{AppConstants.no}</Radio>
                </Radio.Group>
            </div>
        )
    }



    contentView = () => {
        return (
            <div className="content-view">
                <InputWithHead heading={AppConstants.areYouAnExistingUser} required={"required-field"}></InputWithHead>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChange(e.target.value)}>
                    <Radio value={1}>{AppConstants.yes}</Radio>
                    <Radio value={2}>{AppConstants.no}</Radio>
                </Radio.Group>
            </div>
        )
    }

    render() {
        return (
            <div>
                 {this.headerView()}
                <Layout >
                    <Content className="container">
                        {this.state.existingUserRefId == null &&
                            <div className="formView">
                                {this.contentView()}
                            </div>
                        }
                        { this.state.existingUserRefId != null &&
                            <div className="formView">
                                {this.registeringYourselfView()}
                            </div>
                        }
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        clearRegistrationDataAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState,
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(TeamRegistration);