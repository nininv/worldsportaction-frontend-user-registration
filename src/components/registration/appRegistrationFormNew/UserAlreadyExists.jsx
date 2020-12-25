import React, { memo, useEffect, useState } from 'react';
import { Button, Radio } from 'antd';

import '../product.css';
import './UserAlreadyExists.css';
import AppConstants from '../../../themes/appConstants';
import { getStringWithPassedValues } from '../../../util/helpers';

function UserAlreadyExists({
  email = '',
  phone = '',
  onCancelClick = () => { },
  onOkClick = () => { },
}) {
  const [selected, setSelected] = useState(null);
  const buttonsDisabled = selected === null;

  return (
    <div className="registration-form-view user-already-exists-section">
      <p>{getStringWithPassedValues(AppConstants.userAlreadyExists, { email, phone })}</p>

      <Radio.Group
        className="registration-radio-group user-already-exists-buttons"
        onChange={({ target: { value } }) => setSelected(value)}
        value={selected}
      >
        <Radio value={1}>{AppConstants.email}</Radio>
        <Radio value={2}>{AppConstants._sms}</Radio>
      </Radio.Group>

      <div className="contextualHelp-RowDirection user-already-exists-buttons">
        <Button
          htmlType="button"
          type="primary"
          className="open-reg-button user-already-exists-button"
          disabled={buttonsDisabled}
          onClick={onCancelClick}
        >
          {AppConstants.cancel}
        </Button>
        <Button
          htmlType="button"
          type="default"
          className="open-reg-button user-already-exists-button user-already-exists-ok"
          onClick={onOkClick}
          disabled={buttonsDisabled}
        >
          {AppConstants.ok}
        </Button>
      </div>
    </div>
  );
}

export default memo(UserAlreadyExists);