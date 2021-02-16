import React from "react";
import { Button } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";

const CodeCheckSuccess = ({ updateUser, user, userId }) => {
    const confirm = () => {
        // set this as verified
        updateUser({
            ...user,
            isVerified: true,
            userId,
        });
    };

    return (
        <div className="registration-form-view user-already-exists-section">
            <p>
                {getStringWithPassedValues(AppConstants.successCheckDigitCode)}
            </p>
            <Button
                htmlType="button"
                type="primary"
                className="open-reg-button user-already-exists-button"
                onClick={confirm}
            >
                {AppConstants.next}
            </Button>
        </div>
    );
};

export default CodeCheckSuccess;
