import React, { memo, useEffect, useState } from 'react';
import { Button, Radio } from 'antd';

import '../product.css';
import './UserAlreadyExists.css';
import AppConstants from '../../../themes/appConstants';
import { getStringWithPassedValues } from '../../../util/helpers';

function UserAlreadyExists({
  users=[],
  onCancelClick = () => {
    cancelSend();
  },
  onOkClick = (selected) => {
    const payload = {id: selected.user, type: selected.type};
    sendDigitCode(payload);
  },
  sendDigitCode,
  cancelSend
}) {
  const [selected, setSelected] = useState(null);
  const buttonsDisabled = selected? !(Boolean(selected.user) && Boolean(selected.type)): !selected;

  return (
    <div className="registration-form-view user-already-exists-section">
      {(users.length>0)&&(
        <>
          {
            users.length>1?
            <>
            <p>{getStringWithPassedValues(AppConstants.manyUsersAlreadyExists)}</p>
            <Radio.Group
              className="registration-radio-group user-already-exists-buttons"
              onChange={({ target: { value } }) => setSelected({...selected, user: value})}
              value={selected? selected.user : null}
            >
              {   
                users.map((user) => {
                  return (
                    <>
                    <Radio value={user.id} key={user.id} >
                      email: {user.email} <br />
                      phone: {user.phone}
                    </Radio>
                    </>
                  )
                })
              }
            </Radio.Group>
            </>
            :
            <p>{
              getStringWithPassedValues(AppConstants.oneUserAlreadyExists, { email:users[0].email, phone:users[0].phone })
            }</p>
          }
          <Radio.Group
            className="registration-radio-group user-already-exists-buttons"
            onChange={({ target: { value } }) => setSelected({...selected, user:users.length === 1?users[0].id:selected.user, type: value})}
            value={selected? selected.type : null}
          >
            {<Radio value={1} >{AppConstants.email}</Radio>}
            {<Radio value={2} >{AppConstants._sms}</Radio>}
          </Radio.Group>

          <div className="contextualHelp-RowDirection user-already-exists-buttons">
            <Button
              htmlType="button"
              type="primary"
              className="open-reg-button user-already-exists-button"
              onClick={onCancelClick}
            >
              {AppConstants.cancel}
            </Button>
            <Button
              htmlType="button"
              type="default"
              className="open-reg-button user-already-exists-button user-already-exists-ok"
              onClick={() => {onOkClick(selected)}}
              disabled={buttonsDisabled}
            >
              {AppConstants.ok}
            </Button>
          </div>
        </>
      )}
      {!(users) && (
        <p>{getStringWithPassedValues(AppConstants.userAlreadyExistsNoContact)}</p>
      )}
    </div>
  );
}

export default memo(UserAlreadyExists);
