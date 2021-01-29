import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';

import '../product.css';
import './UserAlreadyExists.css';
import AppConstants from '../../../themes/appConstants';
import { getStringWithPassedValues } from '../../../util/helpers';

const CODE_LENGTH = 6;

function EnterCode({
  checkDigitCode,
  id,
  message,
  onOkClick = () => {
    cancelSend();
  },
  cancelSend
}) {
  const [value, setValue] = useState('');

  const onChange = ({ target: { value } }) => {
    const sanitizedValue = value.replace(/\D/g, '');
    setValue(sanitizedValue);
  };

  useEffect(() => {
    if (value.length === CODE_LENGTH) {
      const payload = {
        id, digitCode:value
      }
      checkDigitCode(payload);
    }
  }, [value]);
  return (
    <div className="registration-form-view user-already-exists-section">
      { message === "decline" ?
      <>
        <p>{getStringWithPassedValues(AppConstants.declineConfirmDetails )}</p>
        <Button
              htmlType="button"
              type="primary"
              className="open-reg-button user-already-exists-button"
              onClick={onOkClick}
            >
              {AppConstants.ok}
            </Button>
      </>
      :
      <>
        <p>{getStringWithPassedValues(AppConstants.enterXDigitCode, { number: CODE_LENGTH })}</p>
        <Form.Item className="place-auto-complete-container">
          <Input
            maxLength={CODE_LENGTH}
            value={value}
            onChange={onChange}
          />
        </Form.Item>
      </>
    }
    </div>
  );
}

export default memo(EnterCode);