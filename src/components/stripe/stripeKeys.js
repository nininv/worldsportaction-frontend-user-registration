let stripeKeys = {
    publicKey: "pk_test_mxxrmGxL3Z0FoKhELpnDQykk007volnWs2",
    clientId: "ca_GciWEdWxJlRdyKn5pJN8ogDDCmMC2Rof",
    url: `${process.env.REACT_APP_USER_REGISTRATION_URL}/userPersonal`,
    apiURL: process.env.REACT_APP_STRIPE_API_URL,
    apiShopUrl: process.env.REACT_APP_SHOP_API_URL
};

 const StripeKeys = stripeKeys  

export default StripeKeys;