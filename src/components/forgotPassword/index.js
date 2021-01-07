import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";

import AppImages from "../../themes/appImages";
import { forgotPasswordAction, clearReducerAction } from "../../store/actions/authentication"
import Loader from "../../customComponents/loader";
import SelectResetType from "./SelectResetType";
import ContentView from "./ContentView";
import history from "../../util/history";

import "./style.css";

const { Content } = Layout;
const loginFormSchema = Yup.object().shape({
  userName: Yup.string().min(2, "Username must be at least 2 characters").required("Username is required"),
});



function ForgotPassword(props) {
  const { loginState, location, forgotPasswordAction } = props;

  let source;
  if (location.search) {
    source = new URLSearchParams(location.search).get('source');
  }

  const [step, setStep] = useState(props.location.search.length > 0 ? 2 : 1);
  const [resetType, setResetType] = useState("email");

  const onSubmitType = (type) => {
    setResetType(type);
    setStep(2);
  };
  let search_data = props.location.search
  let filterData = null
  if (search_data.length > 0) {
    filterData = search_data.slice(1)
      .split('&')
      .map(q => q.split('='))
      .reduce((a, c) => { a[c[0]] = c[1]; return a; }, {});
    console.log(filterData)
    localStorage.setItem('ForgotPasswordEmail', decodeURIComponent(filterData.email))
    localStorage.setItem('channel', filterData.channel)

  }

  let getEmailId = localStorage.getItem('ForgotPasswordEmail')
  let getMobileCheked = localStorage.getItem('channel')
  // localStorage.clear('ForgotPasswordEmail')

  let emailValues = getEmailId ? getEmailId : location.state ? location.state.email : ''
  let mobileChecked = getMobileCheked ? getMobileCheked : false
  const [emailField, setEmailField] = useState(emailValues)

  useEffect(() => {
    history.push('/forgotPassword')
  }, []);

  return (
    <div className="fluid-width">
      <img src={AppImages.loginImage} className="bg" alt="" />

      <Layout>
        <Content className="container" style={{ zIndex: 15 }}>
          {step === 1 && (
            <SelectResetType source={mobileChecked} submitType={onSubmitType} />
          )}

          {step === 2 && (
            <Formik
              enableReinitialize
              initialValues={{
                // userName: filterData ? filterData[1] : location.state ? location.state.email : "",
                userName: emailField,
              }}
              validationSchema={loginFormSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (loginState.onLoad === false) {
                  // forgotPasswordAction(values.userName, resetType);
                  forgotPasswordAction(emailField, resetType, mobileChecked);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                // isSubmitting,
                setFieldValue
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="auth-form login-formView" style={{ zIndex: 15 }}>
                    <ContentView
                      values={emailField}
                      errors={errors}
                      touched={touched}
                      source={mobileChecked}
                      loginState={loginState}
                      resetType={resetType}
                      setFieldValue={setFieldValue}
                      handleChange={(e) => setEmailField(e.target.value)}
                      handleBlur={handleBlur}
                      // emailSearch={filterData ? filterData[1] : null}
                      emailSearch={emailField}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}

          <Loader visible={loginState.onLoad} />
        </Content>
      </Layout>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ forgotPasswordAction, clearReducerAction }, dispatch)
}

function mapStateToProps(state) {
  return {
    loginState: state.LoginState
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
