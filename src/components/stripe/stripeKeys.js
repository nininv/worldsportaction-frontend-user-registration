let stripeKeys = {
    publicKey: "pk_test_51GucJDEnewRwSTgnqNBzaTR1MD6u6N9wqFTNgFtWXQHAxx8bOnQAnSZQkpptj4Quyc8CEwNw1ZBFk8X9dTTs5aOx00FWRr6ClF",
    clientId: "ca_HTZksXTH0PEabfP0wIh7KG9VRCQZcUsu",
    url: `${process.env.REACT_APP_USER_REGISTRATION_URL}/userPersonal`,
    apiURL: process.env.REACT_APP_STRIPE_API_URL,
};

const StripeKeys = stripeKeys
export default StripeKeys;
