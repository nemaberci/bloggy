const {  generateKeyPairSync } = require('crypto');
const {privateKey, publicKey} = generateKeyPairSync("rsa", {
    modulusLength: 2048
});
module.exports = {
    privateKey, 
    publicKey
}