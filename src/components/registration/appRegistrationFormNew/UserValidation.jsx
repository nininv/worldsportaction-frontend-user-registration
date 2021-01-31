import UserAlreadyExists from "./UserAlreadyExists";
import ConfirmDetails from "./ConfirmDetails";
import EnterCode from "./EnterCode";
import CodeCheckSuccess from "./CodeCheckSuccess";
import React, { useState } from "react";

/**
 *
 * @param user: user we want to verify:
 * {
 *     userId: null / ID
 *     isVerified: true if this process is completed
 *     isVerifyTouched: whether user is already in progress of validation
 *     matchingUsers: User[]
 * }
 * @param updateUser: function that update the user (add result userId / verified: true to user)
 * @returns {JSX.Element}
 * @constructor
 */

export const UserValidation = ({ user, updateUser }) => {
    // steps:
    // 0: verification hasn't started, or have finished
    // 1
    // 2
    // 3
    // 4: result

    const [step, setStep] = useState(0);
    const [userId, setUserId] = useState(null); // when we select a target userId, store it here
    const [type, setType] = useState(null); // email / sms

    const { matchingUsers, isVerified, isVerifyTouched } = user; // store the matching users under a User, whether it is a Participant / Parent

    return (
        isVerifyTouched &&
        !isVerified && (
            <>
                {step === 1 && (
                    <UserAlreadyExists
                        cancel={setStep(0)}
                        next={setStep(2)}
                        matchingUsers={matchingUsers}
                        userId={userId}
                        setUserId={setUserId}
                        type={type}
                        setType={setType}
                    />
                )}
                {step === 2 && (
                    <ConfirmDetails
                        cancel={setStep(0)}
                        next={setStep(3)}
                        userId={userId}
                    />
                )}
                {step === 3 && (
                    <EnterCode
                        cancel={setStep(0)}
                        next={setStep(4)}
                        userId={userId}
                    />
                )}
                {step === 4 && (
                    <CodeCheckSuccess
                        updateUser={updateUser}
                        user={user}
                        userId={userId}
                    />
                )}
            </>
        )
    );
};

export default UserValidation;
