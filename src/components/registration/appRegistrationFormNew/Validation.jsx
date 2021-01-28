import UserAlreadyExists from "./UserAlreadyExists";
import ConfirmDetails from "./ConfirmDetails";
import EnterCode from "./EnterCode";
import CodeCheckResult from "./CodeCheckResult";
import React, { useState } from "react";

export const UserValidation = () => {
    const [step, setStep] = useState(0);
    return (
        <>
            {step === 1 && <UserAlreadyExists cancel={setStep(0)} />}
            {step === 2 && <ConfirmDetails cancel={setStep(0)} />}
            {step === 3 && <EnterCode cancel={setStep(0)} />}
        </>
    );
};

export default UserValidation;
