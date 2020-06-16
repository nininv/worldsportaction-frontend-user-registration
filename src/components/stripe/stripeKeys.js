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

//const StripeKeys = devStripeKeys  ////dev server
 const StripeKeys = stgStripeKeys   ///staging server

export default StripeKeys;