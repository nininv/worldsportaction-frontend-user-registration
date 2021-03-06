import React, { Component } from "react";
import { Layout, Radio, message } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import AppImages from "../themes/appImages";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import "../pages/layout.css";
import { setAuthToken, setUserId, setOrganistaionId, 
    setCompetitionID, getAuthToken, getUserId,
    setIsUserRegistration, setSourceSystemFlag, getIsUserRegistration } from '../util/sessionStorage'
import { clearRegistrationDataAction } from '../store/actions/registrationAction/endUserRegistrationAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { NavLink } from "react-router-dom";

const { Content, Header } = Layout;

const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c9510c51d401fe5d10f9767759bbce7833692b87ccb78bc79cfff4edadaa661befa2039bc8fb88298d311d214306eea43776af229593a760ac82fff319046758e375b271a1756924aa4624b3435f458cef2e115e5ac93a4871d3b1daaf56c1a510218f2c680ba127512a358c990c3201c494b23833f9812beaf69f52213212a90d222e997040179e955f153593d9532905d';
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
        let sourceSystem = query.sourceSystem;		
        console.log("sourceSystem" + sourceSystem);							  
        let userId = query.userId;
        let token = query.token;
        
        if(competitionUniqueKey!= undefined && organisationUniqueKey!= undefined)
        {
            await setOrganistaionId(organisationUniqueKey);
            await setCompetitionID(competitionUniqueKey);
        }
		if(sourceSystem!= undefined){
			await setSourceSystemFlag(sourceSystem);
        }
        else{
            await localStorage.removeItem("sourceSystem");
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
            else{
                await setIsUserRegistration(1);
                history.push({pathname: "/login",state: {isUserRegistration: 1}});
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
                                <NavLink to={{ pathname: "/" }} className="site-brand">
                                    <img src={AppImages.netballLogo1} alt="" />
                                </NavLink>
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
                {/* <InputWithHead heading={AppConstants.areYouAnExistingUser} required={"required-field"}></InputWithHead>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChange(e.target.value)}>
                    <Radio value={1}>{AppConstants.yes}</Radio>
                    <Radio value={2}>{AppConstants.no}</Radio>
                </Radio.Group> */}
                <div className="comp-warning-info">This feature is not enabled yet</div>
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
