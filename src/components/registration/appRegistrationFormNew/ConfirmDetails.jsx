import React, { memo, useState } from "react";
import { Button, Form, Input } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";
import { cancelSend } from "../../../store/actions/registrationAction/userRegistrationAction";
import { useDispatch, useSelector } from "react-redux";

function ConfirmDetails({ type, sendConfirmDetails }) {
    const dispatch = useDispatch();
    const [value, setValue] = useState(null);

    const onOkClick = (value) => {
        if (value) {
            const payload = { detail: value.detail, id, type };
            sendConfirmDetails(payload);
        }
    };

    const {
        currentUser: { id },
    } = useSelector((state) => state.UserRegistrationState.userAlreadyExist);

    return (
        <div className="registration-form-view user-already-exists-section">
            <p>
                {getStringWithPassedValues(AppConstants.confirmDetails, {
                    detail:
                        type === 1
                            ? AppConstants.emailAdd.toLowerCase()
                            : AppConstants.phoneNumber.toLowerCase(),
                })}
            </p>
            <Form.Item className="place-auto-complete-container">
                <Input
                    onChange={({ target: { value } }) =>
                        setValue({ ...value, detail: value })
                    }
                    value={value ? value.detail : null}
                />
            </Form.Item>
            <div className="contextualHelp-RowDirection user-already-exists-buttons">
                <Button
                    htmlType="button"
                    type="primary"
                    className="open-reg-button user-already-exists-button"
                    onClick={() => dispatch(cancelSend())}
                >
                    {AppConstants.cancel}
                </Button>
                <Button
                    htmlType="button"
                    type="default"
                    className="open-reg-button user-already-exists-button user-already-exists-ok"
                    onClick={() => {
                        onOkClick(value);
                    }}
                >
                    {AppConstants.ok}
                </Button>
            </div>
        </div>
    );
}

export default memo(ConfirmDetails);
