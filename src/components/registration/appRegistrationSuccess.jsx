import React, { Component } from "react";
import AppImages from "../../themes/appImages";
import { Layout} from 'antd';
import "../../pages/layout.css";

const { Header, Content } = Layout;

class AppRegistrationSuccess extends Component{

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
            <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center',
                            flexDirection: 'column', height: '450px'}}>
                <div className="form-heading">Thank You!</div>
                <div>
                    <img src={AppImages.successTick}  height="120" width="120"/>
                </div>
                <div className="form-heading">Your Registration is successfull</div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.headerView()}
                <Layout>
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}

export default AppRegistrationSuccess;