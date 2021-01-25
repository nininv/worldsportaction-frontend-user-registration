import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';

import '../product.css';
import './UserAlreadyExists.css';
import AppConstants from '../../../themes/appConstants';
import { getStringWithPassedValues } from '../../../util/helpers';

const CODE_LENGTH = 6;

function CodeCheckResult({
  checkDigitCode,
  id,
  message,
  startStepNavigation,
  onOkClick = () => {
    cancelSend();
  },
  onNextClick = () => {
    startStepNavigation()
  },
  cancelSend
}) {

  return (
    <div className="registration-form-view user-already-exists-section">
      { message === "decline" ?
      <>
        <p>{getStringWithPassedValues(AppConstants.declineCheckDigitCode )}</p>
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
        <p>{getStringWithPassedValues(AppConstants.successCheckDigitCode )}</p>
        <Button
          htmlType="button"
          type="primary"
          className="open-reg-button user-already-exists-button"
          onClick={onNextClick}
        >
          {AppConstants.next}
        </Button>
      </>
    }
    </div>
  );
}

export default memo(CodeCheckResult);