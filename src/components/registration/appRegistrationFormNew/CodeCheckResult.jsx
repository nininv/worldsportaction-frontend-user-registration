import React, { memo } from "react";
import { Button } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";
import { useSelector } from "react-redux";

function CodeCheckResult({ message, cancelSend }) {
    const { verificationNavigationListener } = useSelector(
        (state) => state.UserRegistrationState.userAlreadyExist
    );

    return (
        <div className="registration-form-view user-already-exists-section">
            {message === "decline" ? (
                <>
                    <p>
                        {getStringWithPassedValues(
                            AppConstants.declineCheckDigitCode
                        )}
                    </p>
                    <Button
                        htmlType="button"
                        type="primary"
                        className="open-reg-button user-already-exists-button"
                        onClick={cancelSend}
                    >
                        {AppConstants.ok}
                    </Button>
                </>
            ) : (
                <>
                    <p>
                        {getStringWithPassedValues(
                            AppConstants.successCheckDigitCode
                        )}
                    </p>
                    <Button
                        htmlType="button"
                        type="primary"
                        className="open-reg-button user-already-exists-button"
                        onClick={verificationNavigationListener}
                    >
                        {AppConstants.next}
                    </Button>
                </>
            )}
        </div>
    );
}

export default memo(CodeCheckResult);
