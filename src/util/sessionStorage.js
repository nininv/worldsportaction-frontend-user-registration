// set competition id
export const setCompetitionID = competitionId => {
    localStorage.setItem("competitionId", competitionId)
}

// get competition id
export const getCompetitonId = key => {
    return localStorage.competitionId
}

export const getLiveScoreCompetition = () => {
    return localStorage.LiveScoreCompetition
}

// Set Auth Token
export const setAuthToken = token => {
    localStorage.setItem("token", token);
}

// get Auth Token
export const getAuthToken = token => {
    return localStorage.token
}

// Set User Id
export const setUserId = userId => {
    localStorage.setItem("userId", userId)
}

// get User Id
export const getUserId = () => {
    return localStorage.userId
}

export const getName = () => {
    return localStorage.name
}

export const setName = (name) => {
    localStorage.setItem("name", name)
}

export const getPhotoUrl = () => {
    return localStorage.photoUrl
}

export const setPhotoUrl = (photoUrl) => {
    localStorage.setItem("photoUrl", photoUrl)
}

// Set Own Year
export const setOwnCompetitionYear = own_year => {
    localStorage.setItem("own_year", own_year)
}

// get Own Year
export const getOwnCompetitionYear = () => {
    return localStorage.own_year
}

// Set own competition
export const setOwn_competition = own_competition => {
    localStorage.setItem("own_competition", own_competition)
}

/// get own competition
export const getOwn_competition = () => {
    return localStorage.own_competition
}

export const setOrganisationData = (organisationData) => {
    let data = JSON.stringify(organisationData)
    localStorage.setItem("setOrganisationData", data)
}

export const getOrganisationData = () => {
    return localStorage.setOrganisationData ? JSON.parse(localStorage.setOrganisationData) : null
}

// set Participating Year
export const setParticipatingYear = Participate_year => {
    localStorage.setItem("Participate_year", Participate_year)
}

// get Participating  Year
export const getParticipatingYear = () => {
    return localStorage.Participate_year
}

// Set Participating competition
export const setParticipating_competition = Participating_competition => {
    localStorage.setItem("Participating_competition", Participating_competition)
}

// get Participating competition
export const getParticipating_competition = () => {
    return localStorage.Participating_competition
}

export const setOrganistaionId = (organisationId) => {
    localStorage.setItem("organisationId", organisationId)
}

export const getOrganisationId = () => {
    return localStorage.organisationId;
}

export const setliveScoreOrgID = (Orgid) => {
    localStorage.setItem("liveScoreOrgID", Orgid)
}

export const getliveScoreOrgID = () => {
    return localStorage.liveScoreOrgID
}

export const setUserRegId = (userRegId) => {
    localStorage.setItem("userRegId", userRegId)
}

export const getUserRegId = () => {
    return localStorage.userRegId
}

export const setExistingUserRefId = (existingUserRefId) => {
    localStorage.setItem("existingUserRefId", existingUserRefId)
}

export const getExistingUserRefId = () => {
    return localStorage.existingUserRefId
}

export const setRegisteringYourselfRefId = (registeringYourselfRefId) => {
    localStorage.setItem("registeringYourselfRefId", registeringYourselfRefId)
}

export const getRegisteringYourselfRefId = () => {
    return localStorage.registeringYourselfRefId
}

export const setIsUserRegistration = (isUserRegistration) => {
    localStorage.setItem("isUserRegistration", isUserRegistration)
}

export const getIsUserRegistration = () => {
    return localStorage.isUserRegistration
}

// Set Temp User Id
export const setTempUserId = userId => {
    localStorage.setItem("tempUserId", userId)
}

// get Temp User Id
export const getTempUserId = () => {
    return localStorage.tempUserId
}

// set source system flag
export const setSourceSystemFlag = sourceSystem => {
    localStorage.setItem("sourceSystem", sourceSystem)
}

// get source system flag
export const getSourceSystemFlag = key => {
    return localStorage.sourceSystem
}

// Set stripe account id
export const setStripeAccountId = stripeCustomerAccountId => {
    localStorage.setItem("stripeCustomerAccountId", stripeCustomerAccountId)
}

/// Set stripe account id
export const getStripeAccountId = () => {
    return localStorage.stripeCustomerAccountId
}

export const getStripeAccountConnectId = () => {
    return localStorage.stripeAccountId
}

export const setStripeAccountConnectId = stripeAccountId => {
    localStorage.setItem("stripeAccountId", stripeAccountId || "")
}
