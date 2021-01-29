import React, { memo, useState } from "react";
import { Button, Form, Input } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";
import { useSelector } from "react-redux";
import userHttpApi from "../../../store/http/userHttp/userAxiosApi";

const CODE_LENGTH = 6;

const EnterCode = ({ cancel, next }) => {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);

    const {
        currentUser: { id },
    } = useSelector((state) => state.UserRegistrationState.userAlreadyExist);

    const onChange = async ({ target: { value } }) => {
        const sanitizedValue = value.replace(/\D/g, "");
        setValue(sanitizedValue);

        if (sanitizedValue.length === CODE_LENGTH) {
            try {
                const result = await userHttpApi.checkDigitCode({
                    id,
                    digitCode: sanitizedValue,
                });
                if (result.success) {
                    next();
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="registration-form-view user-already-exists-section">
            {error ? (
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
            ) : (
                <>
                    <p>
                        {getStringWithPassedValues(
                            AppConstants.enterXDigitCode,
                            { number: CODE_LENGTH }
                        )}
                    </p>
                </>
            )}
            <Form.Item className="place-auto-complete-container">
                <Input
                    maxLength={CODE_LENGTH}
                    value={value}
                    onChange={onChange}
                />
            </Form.Item>
        </div>
    );
};

export default memo(EnterCode);
