import React, { Component } from "react";
import { Layout, Radio, message } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import AppImages from "../themes/appImages";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import "../pages/layout.css";
import { setAuthToken, setUserId, setOrganistaionId, 
    setCompetitionID, getAuthToken, getUserId,
    setIsUserRegistration } from '../util/sessionStorage'
import { clearRegistrationDataAction } from '../store/actions/registrationAction/endUserRegistrationAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
const { Content, Header } = Layout;

const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c9578a18b0605ead797aee4263a4cb6a10dc5dfc60170e2b10a37eade9f7dc86a3298ba7e5642cdb5a4b88b4e7b932851f80b9a5389c362e6f939711875d92f76015583478e9a57cd4fba380d411583d0925262a49c34e783650864c4ad81d90af2a4cac53ea7a31136e1943de8fdfd1378dcf58a08abcc5a90d4b54b94c6a419797ae6408f65828b09d2b479827f37374c508e0461ab9c8daae6736a0d950cbb3e';
const userId = 0;
class UserRegistration extends Component {
    constructor(props) {
        super(props);
        this.props.clearRegistrationDataAction();
        this.state = {}
    }

    async componentDidMount() {
       // alert("componentDidMount");

        const query = this.queryfie(this.props.location.search);
        let competitionUniqueKey = query.competitionId;
        let organisationUniqueKey = query.organisationId;
        let userId = query.userId;
        let token = query.token;
        
        if(competitionUniqueKey!= undefined && organisationUniqueKey!= undefined)
        {
            await setOrganistaionId(organisationUniqueKey);
            await setCompetitionID(competitionUniqueKey);
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

        if(userId!= undefined && token!= undefined && 
            userId!= null && token!= null && 
            userId!= "" && token!= "" &&
            userId!= 0)
            {
                await setIsUserRegistration(1);
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
        await setIsUserRegistration(1);
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
