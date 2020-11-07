import React, { Component } from "react";
import { Button } from 'antd';
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import "../home/home.css";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }


  componentDidCatch(error, errorInfo) {
    console.log("error, errorInfo", error, errorInfo)
    if (process.env.REACT_APP_FRIENDLY_ERROR === "true") {
      this.setState({
        error: error,
        errorInfo: errorInfo
      });
    }
  }

  navigateToHome = () => {
    history.push("/")
    window.location.reload()
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <DashboardLayout isManuNotVisible={true} isUserTabNotVisible={true} />
          <div className="error-boundry-main-div">
            <img
              src={AppImages.wentWrong}
              alt=""
              className="went-wrong-img"
            />
            <Button className="open-reg-button mt-5" type="primary" onClick={() => this.navigateToHome()}>
              {AppConstants.backToHome}
            </Button>
          </div>
          {/* <details style={{ whiteSpace: 'pre-wrap' }}>
                 {this.state.error && this.state.error.toString()}
                 <br />
                 {this.state.errorInfo.componentStack}
               </details> */}
        </div>
      );
    }
    return this.props.children;
  }
}



export default ErrorBoundary;
