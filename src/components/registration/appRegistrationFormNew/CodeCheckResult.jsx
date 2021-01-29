import React, { memo, useState } from "react";
import { Button } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";

const CodeCheckResult = ({ updateUser, cancel, user, userId }) => {
    const [error, setError] = useState(false);

    const verifyUser = () => {
        // set this as verified
        updateUser({
            ...user,
            isVerified: true,
            userId,
        });
    };

    return (
        <div className="registration-form-view user-already-exists-section">
            {error && (
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
                        onClick={cancel}
                    >
                        {AppConstants.ok}
                    </Button>
                </>
            )}
            <p>
                {getStringWithPassedValues(AppConstants.successCheckDigitCode)}
            </p>
            <Button
                htmlType="button"
                type="primary"
                className="open-reg-button user-already-exists-button"
                onClick={verifyUser}
            >
                {AppConstants.next}
            </Button>
        </div>
    );
};

export default memo(CodeCheckResult);
