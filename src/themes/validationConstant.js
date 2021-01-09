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
    emailField: ['Email is required.', 'Pleae enter valid email.','After changing your email address, you will need to relogin with your new email address'],
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
    emergencyContactName: ["Emergency contact first name is required","Emergency contact last name is required"],
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
    competitionRequired: "Please select Competition",

    divisionValidation: "Please review your competition selections.",
    personRegRoleRequired: "Please select person registering role",
    pleaseEnterMobileNumber: "Please enter mobile number",
    pleaseEnterUserName: "Please enter user name",
    variantIsRequired: 'Variant is required.',

    email_validation: "Please enter valid email address!",
	
	addressRequiredError: "Address is required",
    addressDetailsError: "Please input Address in details",
    userRequired: "Please select User",
    teamRequired: "Please select Team",
    deRegisterReasonRequired: "Please select the reason to De-register",
    deRegisterChangeTypeRequired: "Please select the De-register change type",

    countryField: ['Country field is required.'],

    parentDetailsIsRequired: "Parent details is required",
    addressDetailsIsRequired: "Address details is required",

    selectAddressRequired: "Select address required",
    fillMembershipProductInformation: "Please fill Membership product information",
    fillMembershipProductDivisionInformation:"Please choose Registration Divisions.",

    additionalInfoQuestions: [
        "Do you identify as field is required",
        "Existing medical condition field is required",
        "Regular medication field is required",
        "Injury field is required",
        "Allergies field is required",
        "Disability Care Number is required",
        "This field is required",
        "Other participation is required",
        "This field is required",
    ],
    memberTypeIsRequired: "Member type is required",
    currentPasswordRequired : "Current Password is required",
    newPasswordRequired : "New Password is required",
    confirmPasswordRequired : "Confirm Password is required",
    passwordVerification: 'Password must be minimum 8 characters',
    mobileLength: 'Contact number must be 10 digits',
    invalidNumber : 'Invalid Number',

    fillTshirtSizeInformation: "Please choose a T'Shirt Size",
    accreditationLevelUmpire: "National accreditation level umpire is required.",
    prerequisitesTrainingUmpire:"Prerequisites training umpire is required.",
    accreditationLevelCoach: "National accreditation level coach is required.",
};

export default ValidationConstants;
