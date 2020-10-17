let devStripeKeys = {
    publicKey: "pk_test_51GucJDEnewRwSTgnqNBzaTR1MD6u6N9wqFTNgFtWXQHAxx8bOnQAnSZQkpptj4Quyc8CEwNw1ZBFk8X9dTTs5aOx00FWRr6ClF",
    clientId: "ca_HTZksXTH0PEabfP0wIh7KG9VRCQZcUsu",
    url: "https://netball-comp-admin-dev.worldsportaction.com",////////dev server
    apiURL: "https://registration-api-dev.worldsportaction.com",
};

let stgStripeKeys = {
    publicKey: "pk_test_mxxrmGxL3Z0FoKhELpnDQykk007volnWs2",
    clientId: "ca_GciWEdWxJlRdyKn5pJN8ogDDCmMC2Rof",
    url: "https://netball-comp-admin-stg.worldsportaction.com",////staging server
    apiURL: "https://netball-api-stg.worldsportaction.com/registration",
};

let stripeKeys = {
    publicKey: "pk_live_SExd4Lw0a6mOviFX2Sp5b6Pz004KYZzDm6",
    clientId: "ca_HT5y66oz3TeQAQ5Z5efjziFRcmRsYqny",
    url: "https://netball-comp-admin.worldsportaction.com",////production server
};

//const StripeKeys = devStripeKeys  ////dev server
 const StripeKeys = stripeKeys   ///staging server

export default StripeKeys;