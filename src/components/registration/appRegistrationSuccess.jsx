import React, { Component } from "react";
import AppImages from "../../themes/appImages";
import { Layout } from 'antd';
import "../../pages/layout.css";
import { NavLink } from "react-router-dom";

const { Header, Content } = Layout;

class AppRegistrationSuccess extends Component {

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
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexDirection: 'column', height: '350px'
            }}>
                <div className="form-heading">Thank You!</div>
                <div>
                    <img src={AppImages.suceessImg} height="90" width="90" />
                </div>
                <div className="form-heading">Your Registration is Successful.</div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                {this.headerView()}
                <Layout>
                    <Content>
                        <div className="success-screen-view">
                            {this.contentView()}
                        </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}

export default AppRegistrationSuccess;