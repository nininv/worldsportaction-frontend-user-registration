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

const getName = () =>{
    return localStorage.name
}

const setName = (name) => {
    localStorage.setItem("name", name)
}

const getPhotoUrl = () => {
    return localStorage.photoUrl
}

const setPhotoUrl = (photoUrl) => {
    localStorage.setItem("photoUrl", photoUrl)
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

const setliveScoreOrgID=(Orgid)=>{
    localStorage.setItem("liveScoreOrgID", Orgid)
}

const getliveScoreOrgID = () => {
    return localStorage.liveScoreOrgID
}

const setUserRegId=(userRegId)=>{
    localStorage.setItem("userRegId", userRegId)
}

const getUserRegId = () => {
    return localStorage.userRegId
}

const setExistingUserRefId = (existingUserRefId) => {
    localStorage.setItem("existingUserRefId", existingUserRefId)
}

const getExistingUserRefId = () => {
    return localStorage.existingUserRefId
}


const setRegisteringYourselfRefId = (registeringYourselfRefId) => {
    localStorage.setItem("registeringYourselfRefId", registeringYourselfRefId)
}

const getRegisteringYourselfRefId = () => {
    return localStorage.registeringYourselfRefId
}




module.exports = {
    setCompetitionID, getCompetitonId,
    setAuthToken, getAuthToken,
    setUserId, getUserId,
    setName, getName,
    setPhotoUrl, getPhotoUrl,
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
    setOrganistaionId,
    setliveScoreOrgID,
    getliveScoreOrgID,
    setUserRegId,getUserRegId,
    setExistingUserRefId,getExistingUserRefId,
    setRegisteringYourselfRefId,getRegisteringYourselfRefId
}