import React, { memo, useEffect, useState } from 'react';
import { Button, Radio } from 'antd';

import '../product.css';
import './UserAlreadyExists.css';
import AppConstants from '../../../themes/appConstants';
import { getStringWithPassedValues } from '../../../util/helpers';

function UserAlreadyExists({
  email = '',
  phone = '',
  id = '',
  onCancelClick = () => {
    cancelSend();
  },
  onOkClick = (selected) => {
    const payload = {id: selected.user, type: selected.type};
    sendDigitCode(payload);
    console.log(selected);
  },
  sendDigitCode,
  cancelSend
}) {
  const [selected, setSelected] = useState(null);
  const buttonsDisabled = selected? !(Boolean(selected.user) && Boolean(selected.type)): !selected;
  const emailList = email.split(',');
  const phoneList = phone.split(',');

  console.log(email, phone, id)
  return (
    <div className="registration-form-view user-already-exists-section">
      {(email || phone) && (
        <>
          {
            emailList.length>1?
            <>
            <p>{getStringWithPassedValues(AppConstants.manyUsersAlreadyExists, { email, phone })}</p>
            <Radio.Group
              className="registration-radio-group user-already-exists-buttons"
              onChange={({ target: { value } }) => setSelected({...selected, user: value})}
              value={selected? selected.user : null}
            >
              {
                emailList.map((email, index) => {
                  return (
                    <Radio value={id} key={id} >
                      email: {email} <br />
                      phone: {phoneList[index]}
                    </Radio>
                  )
                })
              }
            </Radio.Group>
            </>
            :
            <p>{
              getStringWithPassedValues(AppConstants.oneUserAlreadyExists, { email, phone })
            }</p>
          }
          <Radio.Group
            className="registration-radio-group user-already-exists-buttons"
            onChange={({ target: { value } }) => setSelected({...selected, user:emailList.length === 1?id:'', type: value})}
            value={selected? selected.type : null}
          >
            {email && <Radio value={1} >{AppConstants.email}</Radio>}
            {phone && <Radio value={2} >{AppConstants._sms}</Radio>}
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
      {!(email || phone) && (
        <p>{getStringWithPassedValues(AppConstants.userAlreadyExistsNoContact)}</p>
      )}
    </div>
  );
}

export default memo(UserAlreadyExists);
