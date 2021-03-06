import React, { Component } from 'react';
import {
  Layout,
  Breadcrumb,
  Input,
  Select,
  Checkbox,
  Button,
  Table,
  DatePicker,
  Radio, Form, Modal, message
} from "antd";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import ValidationConstants from '../../themes/validationConstant';
import InputWithHead from "../../customComponents/InputWithHead";
import AppConstants from '../../themes/appConstants';
import DashboardLayout from '../dashboardLayout';
import InnerHorizontalMenu from '../innerHorizontalMenu';
import { updatePasswordFieldsAction, updatePasswordAction } from '../../store/actions/authentication'
import Loader from '../../customComponents/loader';
const { Header, Footer, Content } = Layout;

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  updatePassword = (e) => {
    try {
      e.preventDefault();
      const { passwordInputs } = this.props.LoginState;
      console.log(passwordInputs)

      if (passwordInputs.currentPassword == '') {
        message.error('Please enter current password')
        return
      }
      if (passwordInputs.newPassword == '' || passwordInputs.confirmPassword == '') {
        message.error('Password is required')
        return
      }
      if (passwordInputs.newPassword.length < 8 || passwordInputs.confirmPassword.length < 8) {
        message.error('Password must be minimum 8 characters')
        return
      }
      if (passwordInputs.newPassword !== passwordInputs.confirmPassword) {
        message.error('Password does not match')
        return
      }
      this.props.updatePasswordAction(passwordInputs);
    }
    catch (error) {
      console.log(error)
    }
  }

  //view for breadcrumb
  headerView = () => {
    return (
      <div className="header-view">
        <Header
          className="form-header-view"
          style={{
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "flex-start"
          }}
        >
          <Breadcrumb
            style={{ alignItems: "center", alignSelf: "center" }}
            separator=">"
          >
            <Breadcrumb.Item className="breadcrumb-add">
              {AppConstants.changeYourPassword}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>

      </div>
    );
  };

  //////footer view containing all the buttons like submit and cancel
  footerView = (isSubmitting) => {
    // let registrationState = this.props.endUserRegistrationState;
    // let registrationDetail = registrationState.registrationDetail;
    // let userRegistrations = registrationDetail.userRegistrations;
    return (
      <div className="footer-view" style={{ display: 'flex', justifyContent: 'flex-end' }}>

        <Button
          className="publish-button"
          type="primary"
          htmlType="submit"
        >
          {AppConstants.save}
        </Button>

      </div>
    );
  };

  updateFields = (value, type) => {
    this.props.updatePasswordFieldsAction(type, value)
    this.props.form.setFieldsValue({
      [type]: value,
    });

  }

  contentView = (getFieldDecorator) => {
    // const { getFieldDecorator } = this_Obj.props.form;
    return (
      <div className="product-details-view mt-0 pt-0" >
        <Form.Item >
          {getFieldDecorator(AppConstants.currentPassword, {
            rules: [{ required: true, message: ValidationConstants.currentPasswordRequired }],
          })(
            <InputWithHead
              required={"required-field pb-0"}
              heading={AppConstants.currentPassword}
              placeholder={AppConstants.enterCurrentPassword}
              minLength={8}
              type={'password'}
              onChange={(e) => this.updateFields(e.target.value, 'currentPassword')}

            />
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator(AppConstants.newPassword, {
            rules: [
              { required: true, message: ValidationConstants.newPasswordRequired },
              { min: 8, message: ValidationConstants.passwordVerification }
            ],
          })(
            <InputWithHead
              required="required-field"
              heading={AppConstants.newPassword}
              type="password"
              // name="newPassword"
              minLength={8}
              placeholder={AppConstants.enterNewPassword}
              onChange={(e) => this.updateFields(e.target.value, 'newPassword')}
            />
          )}
        </Form.Item>

        <Form.Item
        >
          {getFieldDecorator(AppConstants.confirmPassword, {
            rules: [
              { required: true, message: ValidationConstants.confirmPasswordRequired },
              { min: 8, message: ValidationConstants.passwordVerification }
            ],
          })(
            <InputWithHead
              required="required-field"
              heading={AppConstants.confirmPassword}
              type="password"
              // name="confirmPassword"
              minLength={8}
              placeholder={AppConstants.enterConfirmPassword}
              onChange={(e) => this.updateFields(e.target.value, 'confirmPassword')}
            />
          )}
        </Form.Item>

      </div>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
        <DashboardLayout
          menuHeading={""}
          menuName={AppConstants.home}
        />
        <InnerHorizontalMenu />
        <Layout>

          {this.headerView()}
          <Form
            autocomplete="off"
            scrollToFirstError={true}
            onSubmit={this.updatePassword}
            noValidate="noValidate">
            <Content>
              <div className="formView">
                {this.contentView(getFieldDecorator)}
              </div>
              <Loader visible={this.props.LoginState.onLoad} />
            </Content>
            <Footer>{this.footerView()}</Footer>
          </Form>
        </Layout >
      </div >
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePasswordFieldsAction,
    updatePasswordAction
  }, dispatch);

}

function mapStatetoProps(state) {
  return {
    LoginState: state.LoginState,
  }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(Password));
