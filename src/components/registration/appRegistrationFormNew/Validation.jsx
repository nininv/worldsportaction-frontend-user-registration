import UserAlreadyExists from "./UserAlreadyExists";
import ConfirmDetails from "./ConfirmDetails";
import EnterCode from "./EnterCode";
import CodeCheckResult from "./CodeCheckResult";
import React, { useState } from "react";

/**
 *
 * @param user: user we want to verify
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

    const { matchingUsers } = user; // store the matching users under a User, whether it is a Participant / Parent

    return (
        !user.isVerified && (
            <>
                {step === 1 && (
                    <UserAlreadyExists
                        cancel={setStep(0)}
                        next={setStep(2)}
                        setUserId={setUserId}
                        matchingUsers={matchingUsers}
                    />
                )}
                {step === 2 && (
                    <ConfirmDetails cancel={setStep(0)} next={setStep(3)} />
                )}
                {step === 3 && (
                    <EnterCode cancel={setStep(0)} next={setStep(4)} />
                )}
                {step === 4 && (
                    <CodeCheckResult
                        cancel={setStep(0)}
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
