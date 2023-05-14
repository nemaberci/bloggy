var jwt = require('jsonwebtoken');
let { publicKey } = require("../data/keypair");

module.exports = (req, res, next) => {
    let authorizationHeader = req.header("Authorization")
    if (typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ")) {
        let bearerToken = authorizationHeader.substring("Bearer ".length)
        try {
            console.log(bearerToken)
            jwt.verify(bearerToken, publicKey)
            let decoded = jwt.decode(bearerToken)
            console.log("Current user: ", decoded)
            next()
        } catch (e) {
            res.status(401).send("Unauthorized")
        }
    } else {
        res.status(401).send("Unauthorized")
    }
}