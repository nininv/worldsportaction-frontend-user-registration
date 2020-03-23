const cryptoJs = require('crypto');

const ENCRYPTION_KEY = "ENCRYPTION_KEY"; // Must be 256 bits (32 characters)

function encrypt(text) {
    let mykey = cryptoJs.createCipher('aes-128-cbc', ENCRYPTION_KEY);
    let mystr = mykey.update(text, 'utf8', 'hex')
    mystr += mykey.final('hex');
    console.log("encrypt mystr", mystr)
    return mystr;
}

function decrypt(text) {
    let mykey = cryptoJs.createDecipher('aes-128-cbc', ENCRYPTION_KEY);
    let mystr = mykey.update(text, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    console.log("decrypt mystr", mystr)
    return mystr;
}


module.exports = {
    Encrypt: encrypt,
    Decrypt: decrypt
}