import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "antd";

import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";

function SelectResetType(props) {
  const { source, submitType } = props;
  const [resetType, setResetType] = useState("email");

  const onChangeType = useCallback((e) => {
    setResetType(e.target.value);
  }, []);

  const onSubmitType = useCallback(() => {
    submitType(resetType);
  }, [submitType, resetType]);

  return (
    <div className="auth-form text-center" style={{ fontSize: 14, zIndex: 15 }}>
      <div className="content-view">
        <div className="d-flex justify-content-center">
          <img src={AppImages.netballLogo1} alt=""/>
        </div>

        <p className="mt-4" style={{ fontSize: 18 }}>
          Would you like this link to sent via SMS or Email?
        </p>

        <div className="d-flex justify-content-around">
          <div className="d-flex">
            <input
              id="email"
              type="radio"
              name="resetType"
              value="email"
              checked={resetType === "email"}
              onChange={onChangeType}
            />
            <label className="ml-3" htmlFor="email">Email</label>
          </div>

          <div className="d-flex">
            <input
              id="sms"
              type="radio"
              name="resetType"
              value="sms"
              checked={resetType === "sms"}
              onChange={onChangeType}
            />
            <label className="ml-3" htmlFor="sms">SMS</label>
          </div>
        </div>

        <div className={`comp-finals-button-view d-flex justify-content-${source !== "mobile" ? "between" : "center"} mt-4`}>
          {source !== "mobile" && (
            <div className="pr-5">
              <NavLink to={{ pathname: "/login" }}>
                <Button className="open-reg-button" type="primary">
                  {AppConstants.returnToLogin}
                </Button>
              </NavLink>
            </div>
          )}

          <Button
            className="open-reg-button"
            type="primary"
            onClick={onSubmitType}
          >
            {AppConstants.next}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectResetType;
