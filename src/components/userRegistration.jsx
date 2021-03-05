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

const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c9578a18b0605ead797aee4263a4cb6a10d5c65747ce2197239ea4f6fe9d001110857f75cb4e47dfef3defcace5a0999d4750f7d8b42d02462b71f0c7dee3972ee46d417e8b1249017f16e17f1b3cc0f04eef15d12ab0191991fc8bd7d7d299acbdfd0911854c68d7cbc6812d823d9b108e4dc7aeb99184f804e020d5f9a213107d5b853f5bbcdda9165dfefb966ef288be908670c28c8e2227af1db6d6a65ffb86';
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
