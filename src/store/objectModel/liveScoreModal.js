export function getPlayerListData(data) {
    const playerArray = [];
    for (let i in data) {
        const object = this.getPlayerListObject(data[i]);
        playerArray.push(object);
    }
    return playerArray;
}

export function getPlayerListObject(data) {
    return {
        playerId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        profilePicture: data.photoUrl ? data.photoUrl : null,
        phoneNumber: data.phoneNumber,
        dob: data.dateOfBirth,
        team: data.team,
        division: data.team.division,
    };
}
