import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';

import '../product.css';
import './UserAlreadyExists.css';
import AppConstants from '../../../themes/appConstants';
import { getStringWithPassedValues } from '../../../util/helpers';

function ConfirmDetails({
    id,
    type,
  onCancelClick = () => {
    cancelSend();
  },
  onOkClick = (value) => {
    if(value) {
        const payload = { detail: value.detail, id, type};
        sendConfirmDetails(payload);
    }
  },
  sendConfirmDetails,
  cancelSend,
}) {
  const [value, setValue] = useState(null);

  return (
    <div className="registration-form-view user-already-exists-section">
        <p>{getStringWithPassedValues(AppConstants.confirmDetails, { detail:type===1?AppConstants.emailAdd.toLowerCase(): AppConstants.phoneNumber.toLowerCase() })}</p>
        <Form.Item className="place-auto-complete-container">
            <Input
              onChange={({ target: { value } }) => setValue({...value, detail: value})}
              value={value? value.detail : null}
            />
        </Form.Item>
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
              onClick={() => {onOkClick(value)}}
            >
              {AppConstants.ok}
            </Button>
          </div>
      </div>
  );
}

export default memo(ConfirmDetails);
