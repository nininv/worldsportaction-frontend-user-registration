import React, { memo, useState } from "react";
import { Button, Form, Input } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
    cancelSend,
    checkDigitCode,
} from "../../../store/actions/registrationAction/userRegistrationAction";

const CODE_LENGTH = 6;

const EnterCode = () => {
    const [value, setValue] = useState("");

    const {
        currentUser: { id },
        codeValidationSuccess,
    } = useSelector((state) => state.UserRegistrationState.userAlreadyExist);

    const dispatch = useDispatch();

    const onChange = ({ target: { value } }) => {
        const sanitizedValue = value.replace(/\D/g, "");
        setValue(sanitizedValue);

        if (sanitizedValue.length === CODE_LENGTH) {
            const payload = {
                id,
                digitCode: sanitizedValue,
            };
            dispatch(checkDigitCode(payload));
        }
    };

    return (
        <div className="registration-form-view user-already-exists-section">
            {codeValidationSuccess === false ? (
                <>
                    <p>
                        {getStringWithPassedValues(
                            AppConstants.declineConfirmDetails
                        )}
                    </p>
                    <Button
                        htmlType="button"
                        type="primary"
                        className="open-reg-button user-already-exists-button"
                        onClick={() => dispatch(cancelSend())}
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
                    <Form.Item className="place-auto-complete-container">
                        <Input
                            maxLength={CODE_LENGTH}
                            value={value}
                            onChange={onChange}
                        />
                    </Form.Item>
                </>
            )}
        </div>
    );
};

export default memo(EnterCode);
