import React from "react";
import { Button, Radio } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";

const UserAlreadyExists = ({
    cancel,
    next,
    userId,
    setUserId,
    matchingUsers,
    type,
    setType,
}) => {
    return (
        <div className="registration-form-view user-already-exists-section">
            {matchingUsers.length > 0 && (
                <>
                    {matchingUsers.length > 1 ? (
                        <>
                            <p>
                                {getStringWithPassedValues(
                                    AppConstants.manyUsersAlreadyExists
                                )}
                            </p>
                            <Radio.Group
                                className="registration-radio-group user-already-exists-buttons"
                                onChange={({ target: { value } }) =>
                                    setUserId(value)
                                }
                                value={userId}
                            >
                                {matchingUsers.map((user) => {
                                    return (
                                        <Radio
                                            className="registration-radio-group__radio"
                                            value={user.id}
                                            key={user.id}
                                        >
                                            {user.firstName} {user.lastName} -
                                            Email: {user.email}, Phone:{" "}
                                            {user.phone}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </>
                    ) : (
                        <p>
                            {getStringWithPassedValues(
                                AppConstants.oneUserAlreadyExists,
                                {
                                    email: matchingUsers[0].email,
                                    phone: matchingUsers[0].phone,
                                }
                            )}
                        </p>
                    )}
                    <Radio.Group
                        className="registration-radio-group user-already-exists-buttons"
                        onChange={({ target: { value } }) => setType(value)}
                        value={type}
                    >
                        {<Radio value={"email"}>{AppConstants.email}</Radio>}
                        {<Radio value={"sms"}>{AppConstants._sms}</Radio>}
                    </Radio.Group>

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
                            onClick={next}
                            disabled={
                                (matchingUsers.length > 1 && !userId) || !type
                            }
                        >
                            {AppConstants.ok}
                        </Button>
                    </div>
                </>
            )}
            {/* todo: below - shouldn't be in this process in total */}
            {!matchingUsers && (
                <p>
                    {getStringWithPassedValues(
                        AppConstants.userAlreadyExistsNoContact
                    )}
                </p>
            )}
        </div>
    );
};

export default UserAlreadyExists;
