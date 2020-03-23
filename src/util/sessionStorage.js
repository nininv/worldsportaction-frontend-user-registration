// set competition id
const setCompetitionID = competitionId => {
    console.log(competitionId, " is id");
    localStorage.setItem("competitionId", competitionId)

}
// get competition id
const getCompetitonId = key => {
    return localStorage.competitionId
}
// Set Auth Token
const setAuthToken = token => {
    // console.log(token, 'token')
    localStorage.setItem("token", token);
}
// get Auth Token
const getAuthToken = token => {
    return localStorage.token
}
// Set User Id
const setUserId = userId => {
    localStorage.setItem("userId", userId)
}
// get User Id
const getUserId = () => {
    return localStorage.userId
}
// Set Own  Year
const setOwnCompetitionYear = own_year => {
    localStorage.setItem("own_year", own_year)
}
// get Own  Year
const getOwnCompetitionYear = () => {
    return localStorage.own_year
}

// Set  own competition 
const setOwn_competition = own_competition => {
    localStorage.setItem("own_competition", own_competition)
}
/// get own competition
const getOwn_competition = () => {
    return localStorage.own_competition
}

const setOrganisationData = (organisationData) => {
    let data = JSON.stringify(organisationData)
    localStorage.setItem("setOrganisationData", data)
}

const getOrganisationData = () => {
    return localStorage.setOrganisationData ? JSON.parse(localStorage.setOrganisationData) : null
}
// set Participating Year
const setParticipatingYear = Participate_year => {
    localStorage.setItem("Participate_year", Participate_year)
}

// get Participating  Year
const getParticipatingYear = () => {
    return localStorage.Participate_year
}

// Set  Participating competition 
const setParticipating_competition = Participating_competition => {
    localStorage.setItem("Participating_competition", Participating_competition)
}

// get Participating competition
const getParticipating_competition = () => {
    return localStorage.Participating_competition
}

const setOrganistaionId = (organisationId) => {
    localStorage.setItem("organisationId", organisationId)
}

const getOrganisationId = () => {
    return localStorage.organisationId;
}


module.exports = {
    setCompetitionID, getCompetitonId,
    setAuthToken, getAuthToken,
    setUserId, getUserId,
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    setOrganisationData,
    getOrganisationData,
    setParticipatingYear,
    getParticipatingYear,
    setParticipating_competition,
    getParticipating_competition,
    getOrganisationId,
    setOrganistaionId
}