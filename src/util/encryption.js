import cryptoJs from 'crypto';

const ENCRYPTION_KEY = "ENCRYPTION_KEY"; // Must be 256 bits (32 characters)

export function Encrypt(text) {
    let mykey = cryptoJs.createCipher('aes-128-cbc', ENCRYPTION_KEY);
    let mystr = mykey.update(text, 'utf8', 'hex');
    mystr += mykey.final('hex');
    return mystr;
}

export function Decrypt(text) {
    let mykey = cryptoJs.createDecipher('aes-128-cbc', ENCRYPTION_KEY);
    let mystr = mykey.update(text, 'hex', 'utf8');
    mystr += mykey.final('utf8');
    return mystr;
}
