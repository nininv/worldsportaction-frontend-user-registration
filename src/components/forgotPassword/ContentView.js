import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "antd";

import AppImages from "../../themes/appImages";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";

function ContentView(props) {
  const {
    values,
    errors,
    touched,
    source,
    loginState,
    resetType,
    // setFieldValue,
    handleChange,
    handleBlur,
    emailSearch,
  } = props;
  return (
    <div className="content-view">
      <div className="d-flex justify-content-center">
        <NavLink to={{ pathname: "/" }} className="site-brand">
          <img src={AppImages.netballLogo1} alt="" />
        </NavLink>
      </div>

      {loginState.forgotPasswordSuccess ? (
        <div>
          <span className={`input-style-bold justify-content-center`}> {loginState.forgotPasswordMessage} </span>

          {source !== "mobile" && (
            <div className="forgot-password-success-button-div">
              <NavLink to={{ pathname: "/login" }}>
                <Button className="open-reg-button" type="primary">{AppConstants.returnToLogin}</Button>
              </NavLink>
            </div>
          )}
        </div>
      ) : (
          <div>
            <InputWithHead
              heading={AppConstants.username}
              placeholder={AppConstants.username}
              name="userName"
              onChange={handleChange}
              onBlur={handleBlur}
              // value={emailSearch ? decodeURIComponent(emailSearch) : values.userName}
              value={emailSearch}
            />
            {errors.userName && touched.userName && !emailSearch && (
              <span className="form-err">{errors.userName}</span>
            )}

            {resetType === "sms" && (
              <p className="mt-3 mb-0">
                We will send the SMS to your registered phone number.
                Please confirm you would like to proceed.
              </p>
            )}

            <div className="row pt-5">
              <div className="col-sm">
                <div className={`comp-finals-button-view d-flex justify-content-${source !== "mobile" ? "between" : "center"}`}>
                  {source !== "mobile" && (
                    <div className="pr-5">
                      <NavLink to={{ pathname: "/login" }}>
                        <Button
                          className="open-reg-button"
                          type="primary"
                          disabled={loginState.onLoad}
                        >
                          {AppConstants.returnToLogin}
                        </Button>
                      </NavLink>
                    </div>
                  )}

                  <Button
                    className="open-reg-button"
                    htmlType="submit"
                    type="primary"
                    disabled={loginState.onLoad}
                  >
                    {AppConstants.submit}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ContentView;
