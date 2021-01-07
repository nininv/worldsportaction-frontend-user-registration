import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Spin } from 'antd';
import { NavLink } from "react-router-dom";
import InputWithHead from "../customComponents/InputWithHead";
import { Formik } from "formik";
import * as Yup from 'yup';
import { loginAction, clearReducerAction } from "../store/actions/authentication"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import AppImages from "../themes/appImages";
import {
    getExistingUserRefId, getRegisteringYourselfRefId, getUserRegId,
    getAuthToken, getUserId, setUserId, setAuthToken
} from '../util/sessionStorage'

const { Header, Content } = Layout;
const token = 'f68a1ffd26dd50c0fafa1f496a92e7b674e07fb0cfab5c778c2cf47cf6f61f784f7b1981fa99c057ce5607ffba2f8c9578a18b0605ead797aee4263a4cb6a10d5c65747ce2197239ea4f6fe9d001110857f75cb4e47dfef3defcace5a0999d4750f7d8b42d02462b71f0c7dee3972ee46d417e8b1249017f16e17f1b3cc0f04eef15d12ab0191991fc8bd7d7d299acbdfd0911854c68d7cbc6812d823d9b108e4dc7aeb99184f804e020d5f9a213107d5b853f5bbcdda9165dfefb966ef288be908670c28c8e2227af1db6d6a65ffb86';
const userId = 0;
const loginFormSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Username must be at least 2 characters').required('Username is required'),
    password: Yup.string().min(5, 'Too Short!').required('Password is required')
});
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginButton: false,
            isUserRegistration: null,
            userRegId: null
        }
    }

    componentDidMount() {
        let isUserRegistration = this.props.location.state ? this.props.location.state.isUserRegistration : null;
        let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
        this.setState({ isUserRegistration: isUserRegistration, userRegId: userRegId });
        if (getUserId() == 0) {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("isUserRegistration")
            localStorage.removeItem("userRegId");
            localStorage.removeItem("registeringYourselfRefId");
            localStorage.removeItem("existingUserRefId");
            localStorage.removeItem("sourceSystem")
        }
    }

    componentDidUpdate(nextProps) {
        let loginstate = this.props.loginstate;
        if (loginstate.onLoad == false && this.state.loginButton == false) {

            if (loginstate.status == 1 && getAuthToken()) {
                //this.setState({loginButton: true});
                // if(getExistingUserRefId() && getRegisteringYourselfRefId() && getUserRegId()){
                //     history.push("/teamRegistrationForm");
                // }
                if (this.state.userRegId) {
                    history.push("/teamRegistrationForm");
                }
                else if (this.state.isUserRegistration == 1) {
                    history.push('/appRegistrationForm');
                }
                else {
                    history.push('/userPersonal');
                }
            }
        }
    }

    redirect = async () => {
        setUserId(userId);
        setAuthToken(token);
        if (this.state.userRegId) {
            history.push('/teamRegistrationForm');
        } else {
            history.push('/appRegistrationForm');
        }
    }

    ///////view for breadcrumb
    // headerView = () => {
    //     return (
    //         <Header className="login-header-view" >
    //             <div className="row" >
    //                 <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
    //                     <Breadcrumb style={{
    //                         display: 'flex', lignItems: 'center', alignSelf: 'center'
    //                     }} separator=" > ">
    //                         <Breadcrumb.Item className="breadcrumb-add">{AppConstants.login}</Breadcrumb.Item>
    //                     </Breadcrumb>
    //                 </div>
    //             </div>
    //         </Header >
    //     )
    // }

    contentView = (values, errors, setFieldValue, touched, handleChange, handleBlur) => {
        return (
            <div className="content-view">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={AppImages.netballLogo1} alt="" />
                </div>
                <InputWithHead heading={AppConstants.username} placeholder={AppConstants.username}
                    name={"userName"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.userName}
                />
                {errors.userName && touched.userName && (
                    <span className="form-err">{errors.userName}</span>
                )}
                <InputWithHead heading={AppConstants.password} placeholder={AppConstants.password}
                    name={"password"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={"password"}
                    value={values.password}
                />
                {errors.password && touched.password && (
                    <span className="form-err">{errors.password}</span>
                )}
                <NavLink onClick={() => this.props.clearReducerAction("clearPasswordSuccess")} to={{ pathname: `/forgotPassword`, state: { email: values.userName } }}>
                    <span className="forgot-password-link-text">{AppConstants.forgotResetPassword}</span>
                </NavLink>

                {/* {this.state.isUserRegistration == 1 || this.state.userRegId ? */}
                <div className="row pt-5" >
                    <div className="col-sm" >
                        <div style={{ display: 'flex' }}>
                            <Button className="ant-btn-proceed-text login-btn-login-proceed" htmlType="submit" type="primary" disabled={this.state.loginButton}>{AppConstants.loginAndProceedRegistration}</Button>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div className="login-or-border"></div>
                            <div className="login-or">or</div>
                            <div className="login-or-border"></div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Button className="ant-btn-proceed-text login-btn-proceed" onClick={() => this.redirect()} type="primary" disabled={this.state.loginButton}>{AppConstants.proceedToRegistration}</Button>
                        </div>
                    </div>
                </div>
                {/* :
                <div className="row pt-5" >
                    <div className="col-sm" >
                        <div className="comp-finals-button-view">
                            <Button className="open-reg-button" htmlType="submit" type="primary" disabled={this.state.loginButton}>{AppConstants.login}</Button>
                        </div>
                    </div>
                </div> } */}
            </div>
        )
    }

    //////footer view containing all the buttons
    // footerView = (isSubmitting) => {
    //     return (
    //         <div className="container" >
    //             <div className="login-footer-view">
    //                 <div className="row" >
    //                     <div className="col-sm" >
    //                         <div className="comp-finals-button-view">
    //                             <Button className="open-reg-button" htmlType="submit" type="primary" disabled={this.state.loginButton}>{AppConstants.login}</Button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div >
    //     )
    // }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <img src={AppImages.loginImage} className="bg" />
                <Layout >
                    <Content className="container" style={{ zIndex: 15 }}>
                        {/* {this.headerView()} */}
                        <Formik
                            enableReinitialize
                            initialValues={{
                                userName: "",
                                password: "",
                            }}
                            validationSchema={loginFormSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(false);
                                this.setState({ loginButton: true })

                                if (this.props.loginstate.onLoad == false) {
                                    this.props.loginAction(values)
                                }
                                setTimeout(() => {
                                    this.setState({ loginButton: false })
                                }, 1000);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="login-formView" style={{ zIndex: 15 }}>
                                        {this.contentView(values, errors, setFieldValue, touched, handleChange, handleBlur)}
                                    </div>
                                    {/* {this.footerView(isSubmitting)} */}
                                </Form>
                            )}
                        </Formik>
                    </Content>
                </Layout>
                {/* {this.props.loginstate.onLoad && <Spin className="spinn-container" />} */}
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loginAction, clearReducerAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        loginstate: state.LoginState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Login));
