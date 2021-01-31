import React, { useState } from "react";
import { Button, Form, Input } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";
import userHttpApi from "../../../store/http/userHttp/userAxiosApi";

// step 2
// choose SMS / phone and request code
// need to input correct phone / email
const ConfirmDetails = ({ type, next, cancel, userId }) => {
    const [contactValue, setContactValue] = useState(null);
    const [error, setError] = useState(false);

    const confirm = async () => {
        try {
            const result = await userHttpApi.requestDigitCode({
                type,
                contactValue,
                userId,
            });
            if (result.result.data.success) {
                next();
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
            console.error(error);
        }
    };

    return (
        <div className="registration-form-view user-already-exists-section">
            <p>
                {error
                    ? AppConstants.incorrectContactDetails
                    : getStringWithPassedValues(AppConstants.confirmDetails, {
                          detail:
                              type === "email"
                                  ? AppConstants.emailAdd.toLowerCase()
                                  : AppConstants.phoneNumber.toLowerCase(),
                      })}
            </p>
            <Form.Item className="place-auto-complete-container">
                <Input
                    onChange={({ target: { value } }) => setContactValue(value)}
                    value={contactValue}
                />
            </Form.Item>
            <div className="contextualHelp-RowDirection user-already-exists-buttons">
                <Button
                    htmlType="button"
                    type="primary"
                    className="open-reg-button user-already-exists-button"
                    onClick={cancel}
                >
                    {AppConstants.cancel}
                </Button>
                <Button
                    htmlType="button"
                    type="default"
                    className="open-reg-button user-already-exists-button user-already-exists-ok"
                    onClick={confirm}
                >
                    {AppConstants.ok}
                </Button>
            </div>
        </div>
    );
};

export default ConfirmDetails;
