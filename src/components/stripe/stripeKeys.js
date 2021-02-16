let stripeKeys = {
    publicKey: "pk_live_SExd4Lw0a6mOviFX2Sp5b6Pz004KYZzDm6",
    clientId: "ca_HT5y66oz3TeQAQ5Z5efjziFRcmRsYqny",
    url: `${process.env.REACT_APP_USER_REGISTRATION_URL}/userPersonal`,
    apiURL: process.env.REACT_APP_STRIPE_API_URL,
    apiShopUrl: process.env.REACT_APP_SHOP_API_URL
};

 const StripeKeys = stripeKeys 

export default StripeKeys;