import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Spin } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import { Formik } from "formik";
import * as Yup from 'yup';
import loginAction from "../store/actions/authentication"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../util/history";
import AppConstants from "../themes/appConstants";

const { Header, Content } = Layout;
const loginFormSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Username must be at least 2 characters').required('Username is required'),
    password: Yup.string().min(5, 'Too Short!').required('Password is required')
});
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginButton: false,

        }
    }

    componentDidMount() {
        // if (localStorage.token != null) {
        //     history.push("/")
        // }
    }

    componentDidUpdate(nextProps) {

        let loginstate = this.props.loginstate;

        if(loginstate.onLoad == false && this.state.loginButton == false)
        {
            history.push('/appRegistrationForm');
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="login-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb style={{
                            display: 'flex', lignItems: 'center', alignSelf: 'center'
                        }} separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.login}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    contentView = (values, errors, setFieldValue, touched, handleChange, handleBlur) => {
        return (
            <div className="content-view">
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
            </div>
        )
    }

    //////footer view containing all the buttons
    footerView = (isSubmitting) => {
        return (
            <div className="container" >
                <div className="login-footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div className="comp-finals-button-view">
                                <Button className="open-reg-button" htmlType="submit" type="primary" disabled={this.state.loginButton}>{AppConstants.login}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <Layout >

                    <Content className="container">
                        {this.headerView()}
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
                                        <div className="login-formView">
                                            {this.contentView(values, errors, setFieldValue, touched, handleChange, handleBlur)}
                                        </div>
                                        {this.footerView(isSubmitting)}
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
    return bindActionCreators({ loginAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        loginstate: state.LoginState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Login));