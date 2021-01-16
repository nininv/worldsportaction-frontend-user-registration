export function getTeamViewPlayerListData(playerData) {
    const playerArray = [];
    for (let i in playerData) {
        const object = this.getTeamViewPlayerListObject(playerData[i]);
        playerArray.push(object);
    }
    return playerArray;
}

export function getTeamViewPlayerListObject(playerData) {
    return {
        // profilePic: playerData.photoUrl,
        name: playerData.firstName + " " + playerData.lastName,
        dob: playerData.dateOfBirth,
        number: playerData.phoneNumber,
    };
}
