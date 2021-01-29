import React, { memo, useState } from "react";
import { Button, Radio } from "antd";

import "../product.css";
import "./UserAlreadyExists.css";
import AppConstants from "../../../themes/appConstants";
import { getStringWithPassedValues } from "../../../util/helpers";

const UserAlreadyExists = ({ cancel, next, setUserId, matchingUsers }) => {
    const [selected, setSelected] = useState(null); // radio selection, not the real selected

    const buttonsDisabled = selected
        ? !(!!selected.user && !!selected.type)
        : !selected;

    const confirm = (selected) => {
        const payload = { id: selected.user, type: selected.type }; // todo: what use?
        // select this user
        setUserId(selected.user);
        next();
    };

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
                                    setSelected({ ...selected, user: value })
                                }
                                value={selected ? selected.user : null}
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
                        onChange={({ target: { value } }) =>
                            setSelected({
                                ...selected,
                                user:
                                    matchingUsers.length === 1
                                        ? matchingUsers[0].id
                                        : selected.user,
                                type: value,
                            })
                        }
                        value={selected ? selected.type : null}
                    >
                        {<Radio value={1}>{AppConstants.email}</Radio>}
                        {<Radio value={2}>{AppConstants._sms}</Radio>}
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
                            onClick={() => {
                                confirm(selected);
                            }}
                            disabled={buttonsDisabled}
                        >
                            {AppConstants.ok}
                        </Button>
                    </div>
                </>
            )}
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

export default memo(UserAlreadyExists);
