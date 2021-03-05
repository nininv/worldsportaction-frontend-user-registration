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
    const confirm = () => {
        // in case for a single user, user Id would be not set
        if (matchingUsers.length === 1) setUserId(matchingUsers[0].id);

        // otherwise, user id is set on selecting radio
        next();
    };
    const isInvalidSMS = (profileUserId) => {
        const user = matchingUsers.find(item => item.id === profileUserId);
        if (!!user) {
            if (user.phone == null || user.phone == undefined || user.phone.length == 0) {
                if (profileUserId === userId)
                    setType("email");
                return true;
            }
        }
        return false;
    };
    const isInvalidEmail = (profileUserId) => {
        const user = matchingUsers.find(item => item.id === profileUserId);
        if (!!user) {
            if ((!!user.email && user.email.indexOf("player") == 0 && user.email.indexOf("wsa.com") == user.email.length - 7) || user.email == null || user.email == undefined || user.email.length == 0) {
                if (profileUserId === userId)
                    setType("sms");
                return true;
            }
        }
        return false;
    }
    const showProfileString = (user) => {
        let profileString = `${user.firstName} ${user.lastName}`;
        if (!isInvalidEmail(user.id)) {
            profileString += ` - Email: ${user.email}`;
        }
        if (!isInvalidSMS(user.id)) {
            if (!isInvalidEmail(user.id)) {
                profileString += ', ';
            } else {
                profileString += ' - ';
            }
            profileString += `Phone: ${user.phone}`
        }
        return profileString;
    }
    return (
        <div className="registration-form-view user-already-exists-section">
            {matchingUsers && matchingUsers.length > 0 && (
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
                                            {showProfileString(user)}
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
                        <Radio
                            value={"email"}
                            disabled={isInvalidEmail(userId)}
                        >
                            {AppConstants.email}
                        </Radio>
                        <Radio
                            value={"sms"}
                            disabled={isInvalidSMS(userId)}
                        >
                            {AppConstants._sms}
                        </Radio>
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
                            onClick={confirm}
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
