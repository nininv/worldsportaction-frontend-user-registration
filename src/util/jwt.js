const JWT = require("jsonwebtoken");

const jwtSecertKey = "9sec_key_Value9";

function jwtEncrypt(data) {
  let mykey = JWT.sign(data, jwtSecertKey);
  return mykey;
}

function jwtDecrypt(token) {
  let mykey = JWT.verify(token, jwtSecertKey);
  return mykey;
}

module.exports = { JwtEncrypt: jwtEncrypt, JwtDecrypt: jwtDecrypt };
