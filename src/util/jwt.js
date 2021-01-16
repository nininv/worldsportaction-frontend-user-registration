import JWT from "jsonwebtoken";

const jwtSecretKey = "9sec_key_Value9";

export function JwtEncrypt(data) {
    return JWT.sign(data, jwtSecretKey);
}

export function JwtDecrypt(token) {
    return JWT.verify(token, jwtSecretKey);
}
