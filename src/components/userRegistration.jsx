import React, { Component } from "react";
import { Layout, Radio, message } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import AppImages from "../themes/appImages";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import "../pages/layout.css";
import { setAuthToken, setUserId, setOrganistaionId, setCompetitionID, getAuthToken, getUserId } from '../util/sessionStorage'
import { clearRegistrationDataAction } from '../store/actions/registrationAction/endUserRegistrationAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
const { Content, Header } = Layout;

const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c95d69a0e179191e4422d8df456c7dc7268069d560e9e677eb64ca0d506751ea12c34b087a73bc319ba9b17a67ffc69fde351109f091cb2e64e6a60042bcbb11bf6d73e2be792c9658cc5604e115967a82eb0f2f944a1e2950e0116df2065b0ba2fb5dcf34f9341f6b7b6f2e64839339d24123ea015526f05fe22cec9cf96aa86ff990588beafbc3675f550605d72d25247';
const userId = 0;
class UserRegistration extends Component {
    constructor(props) {
        super(props);
        this.props.clearRegistrationDataAction();
        this.state = {
            userIdFromLocalStorage: null,
            tokenFromLocalStorage: null
        }
    }

    async componentDidMount() {
        alert("componentDidMount");
        const query = this.queryfie(this.props.location.search);
        let competitionUniqueKey = query.competitionId;
        let organisationUniqueKey = query.organisationId;
        if(competitionUniqueKey!= undefined && organisationUniqueKey!= undefined)
        {
            setOrganistaionId(organisationUniqueKey);
            setCompetitionID(competitionUniqueKey);
        }

        let userIdFromLocalStorage = await getUserId();
        let tokenFromLocalStorage = await getAuthToken();
        alert("componentDidMount userIdFromLocalStorage::" + userIdFromLocalStorage);
        alert("componentDidMount tokenFromLocalStorage" + tokenFromLocalStorage);
       await this.setState({userIdFromLocalStorage: userIdFromLocalStorage, 
            tokenFromLocalStorage: tokenFromLocalStorage});

        console.log("userIdFromQuery" + userIdFromLocalStorage);
        console.log("tokenFromQuery::" + tokenFromLocalStorage);

        if(userIdFromLocalStorage!= undefined && tokenFromLocalStorage!= undefined && 
            userIdFromLocalStorage!= null && tokenFromLocalStorage!= null && 
            userIdFromLocalStorage!= "" && tokenFromLocalStorage!= "")
            {
                history.push("/appRegistrationForm")
            }
    }

    async componentWillMount(){
        alert("componentWillMount");
        let userIdFromLocalStorage = await getUserId();
        let tokenFromLocalStorage = await getAuthToken();
        alert("componentWillMount userIdFromLocalStorage::" + userIdFromLocalStorage);
        alert("componentWillMount tokenFromLocalStorage" + tokenFromLocalStorage);
       await this.setState({userIdFromLocalStorage: userIdFromLocalStorage, 
            tokenFromLocalStorage: tokenFromLocalStorage});
    }

    async componentWillUpdate(){
    //     alert("componentWillUpdate");
    //     let userIdFromLocalStorage = await getUserId();
    //     let tokenFromLocalStorage = await getAuthToken();
    //     alert("componentWillUpdate userIdFromLocalStorage::" + userIdFromLocalStorage);
    //     alert("componentWillUpdate tokenFromLocalStorage" + tokenFromLocalStorage);
    //    await this.setState({userIdFromLocalStorage: userIdFromLocalStorage, 
    //         tokenFromLocalStorage: tokenFromLocalStorage}); 
    }

    componentDidUpdate(nextProps){
        if(this.state.userIdFromLocalStorage!= undefined && this.state.tokenFromLocalStorage!= undefined && 
            this.state.userIdFromLocalStorage!= null && this.state.tokenFromLocalStorage!= null && 
            this.state.userIdFromLocalStorage!= "" && this.state.tokenFromLocalStorage!= "")
            {
                history.push("/appRegistrationForm")
            }
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
        console.log("value" + value)
        if(value === 1)
        {
            await localStorage.removeItem("userId");
            await localStorage.removeItem("token");
            history.push("/login")
        }
        else if(value === 2){
            setUserId(userId);
            setAuthToken(token);
            history.push("/appRegistrationForm")
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

    contentView = () => {
        return (
            <div className="content-view">
                <div>{"UserId::" + this.state.userIdFromLocalStorage}</div>
                <div>{"Token::" + this.state.tokenFromLocalStorage}</div>
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
                        <div className="formView">
                            {this.contentView()}
                        </div>
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

export default connect(mapStatetoProps,mapDispatchToProps)(UserRegistration);
