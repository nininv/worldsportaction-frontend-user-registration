let devStripeKeys = {
    publicKey: "pk_test_51Gu96PGcVNe3VoimvobxGBfwoOkQpxt1McZ9LDzrVC3PLNl56GFzeoVMjEPuAkWxMpWWE8UM900VrmRP2DGi14aT00qPb1NHzU",
    clientId: "ca_HT5y1KYLSE47kgRu3UgRHUQmb9raFwWb",
    url: "https://netball-comp-admin-dev.worldsportaction.com",////////dev server
    apiURL: "https://registration-api-dev.worldsportaction.com",
};

let stgStripeKeys = {
    publicKey: "pk_test_51Gu96PGcVNe3VoimvobxGBfwoOkQpxt1McZ9LDzrVC3PLNl56GFzeoVMjEPuAkWxMpWWE8UM900VrmRP2DGi14aT00qPb1NHzU",
    clientId: "ca_HT5y1KYLSE47kgRu3UgRHUQmb9raFwWb",
    url: "https://netball-comp-admin-stg.worldsportaction.com",////staging server
    apiURL: "https://netball-api-stg.worldsportaction.com/registration",
};

const StripeKeys = devStripeKeys  ////dev server
// const StripeKeys = stgStripeKeys   ///staging server

export default StripeKeys;