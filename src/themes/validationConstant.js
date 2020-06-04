const ValidationConstants = {
    nameField: ["Name is required.", "Last name is required.", "Name is required."],
    teamName: "Team name is required.",
    firstName: 'Name is required.',
    dateField: 'Date is required.',
    divisionField: 'Division field is required.',
    typeField: 'Type is required.',
    homeField: 'Home team is required.',
    awayField: 'Away team is required.',
    venueField: 'Venue is required.',
    roundField: 'Round is required.',
    durationField: 'Duration time is required.',
    emailField: ['Email is required.', 'Pleae enter valid email.'],
    contactField: 'Contact is required.',
    competitionField: 'Competition is required.',
    timerField: 'Timer is required.',
    newsValidation: ['News title is required.', 'Author is required'],
    bannerImage: 'Banner image is required',
    selectYear: 'Year is required.',
    registrationDateField: ['Registration close date is required.'],
    addressField: ["Address is required."],
    searchManager: "Manager search is required.",
    searchScorer: "Scorer search is required.",
    affiliateField: "Affiliate is required",
    rolesField: ["Roles field is mandatory"],
    genderField: "Gender is required",
    dateOfBirth: "DOB is required",
    membershipProductRequired: "Please select the competition membership product",
    membershipProductDivisionRequired: "Please select the competition membership product division",
    emergencyContactNumber: ["Emergency contact number is required"],
    emergencyContactName: ["Emergency contact name is required"],
    existingMedicalCondition: ["Existing Medical Conditions is required"],
    regularMedication: ["Regular Medications is required"],
    heardBy: ["HeardBy is required"],
    favoriteTeamField: ["Favorite Team is required"],
    firebirdField: ["Firebird is required"],
    termsAndCondition: ["Terms and Condition is required"],
    whoAreYouRegistering: ["Who are you registering is required"],
    whatTypeOfRegistration: ["What type of registration is required"],

    /////////////membership 
    membershipProductIsRequired: "Membership product name is required.",
    pleaseSelectValidity: "Please select validity.",
    pleaseSelectYear: "Please select Year.",
    pleaseSelectDOBFrom: "Please select DOB From.",
    PleaseSelectDOBTo: "Please select DOB To.",
    pleaseSelectMembershipTypes: "Please select membership types.",
    competitionLogoIsRequired: "Competition logo is required.",
    disclaimersIsRequired: "Disclaimers is required.",
    DisclaimerLinkIsRequired: "Disclaimer link is required.",
    pleaseSelectMembershipProduct: "Please select membership product.",
    userPhotoIsRequired: "User photo is required.",
    membershipProductValidation: "Memberhsip product must be unique amoung products",

    /////Venuew and times
    suburbField: ["Suburb is required."],
    stateField: ['State field is required.'],
    dayField: ['Day field is required.'],
    courtField: ["Court number field is required.", "Longitude field is required.", "Latitude field is required.", "Court field is required."],
    postCodeField: ["Postcode is required"],

    //////comp fees
    competitionNameIsRequired: "Competition name is required.",
    pleaseSelectCompetitionType: "Please select competition type.",
    pleaseSelectCompetitionFormat: "Please select competition format.",
    numberOfRoundsNameIsRequired: 'Number of rounds Name is required.',
    registrationOpenDateIsRequired: "Registration open date is required.",
    registrationCloseDateIsRequired: 'Registration close date is required.',

    //time slot 
    timeSlotPreference: "Please select time slot preference",
    timeSlotVenue: "Please select venueId",
    gradeField: 'Grade field is required.',


    ///401 message
    messageStatus401: "The user is not authorized to make the request.",

    //venue court
    emptyAddCourtValidation: "Please add court to add venue.",
    organisationRequired: "Please select Organisation",
    competitionRequired: "Please select Competition"
};

export default ValidationConstants;
