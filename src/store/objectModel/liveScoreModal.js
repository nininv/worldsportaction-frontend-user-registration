function getPlayerListData(data) {

    var PlayerArray = []
    for (let i in data) {
        var object = this.getPlayerListObject(data[i])
        PlayerArray.push(object)
    }
    return PlayerArray
}

function getPlayerListObject(data) {
    console.log(data, 'playerListData')
    return {
        playerId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        profilePicture: data.photoUrl ? data.photoUrl : null,
        phoneNumber: data.phoneNumber,
        dob: data.dateOfBirth,
        team: data.team,
        division: data.team.division
    }
}


module.exports = { getPlayerListData, getPlayerListObject, }