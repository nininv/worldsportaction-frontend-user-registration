import React, { Component } from "react";
import { Layout, Radio } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import AppImages from "../themes/appImages";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import "../pages/layout.css";
import { setAuthToken, setUserId, setOrganistaionId, setCompetitionID } from '../util/sessionStorage'

const { Content, Header } = Layout;

const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c954465629e6f7f4c6107cd93134ba406fb5726ae299e9d54cd58deaca70bd7a95fcb11433183ce2745bbb571eac480c8bc545b9c5dab0b779c5154c67db69e7f461a81cae8a8fabcae38f196308cfd6f5f12977e5a5bf571f83bb80e10c282f5798068bcc51f5e242adf1f64defab14968aae559a636a32b14ba39282a16150413';
const userId = 0;
class UserRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        const query = this.queryfie(this.props.location.search);
        let competitionUniqueKey = query.competitionId;
        let organisationUniqueKey = query.organisationId;
        setOrganistaionId(organisationUniqueKey);
        setCompetitionID(competitionUniqueKey);
      
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

export default UserRegistration;
