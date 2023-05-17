const { Firestore } = require('@google-cloud/firestore')
const fs = require('fs')
const bcrypt = require('bcrypt')
const {privateKey} = require("../data/keypair")
const jwt = require("jsonwebtoken")

let userRead = {

    /**
     * @param {Firestore} firestore
     * @param {string} username
     * @param {string} pw
     */
    loginUser: async (firestore, username, pw) => {
        let users = await firestore.collection("users")
        .where("username", "==", username)
        .select("salt", "password")
        .get();
        if (users.docs.length === 0) {
            return "";
        }
        let user = users.docs[0].data();
        let salt = user.salt;
        console.log(user, salt)

        let hashedPw = bcrypt.hashSync(pw, salt);
        console.log(username, salt, hashedPw, user.password)
        if (hashedPw === user.password) {
            return jwt.sign(username, privateKey, {
                algorithm: "RS256"
            })
        } else {
            return "";
        }
    },

    getUserById: async (firestore, id) => {

        let user = await firestore.doc(`users/${id}`)
        .get();
        if (!user) {
            return null;
        }
        return {
            username: user.data().username
        }

    }

}

let userCreate = {

    /**
     * @param {Firestore} firestore
     * @param {string} username
     * @param {string} pw
     */
    createUser: async (firestore, username, pw) => {
        let salt = bcrypt.genSaltSync(11)
        let hashedPw = bcrypt.hashSync(pw, salt);
        let users = await firestore.collection("users")
        .where("username", "==", username)
        .where("password", "==", hashedPw)
        .get();
        if (users.docs.length === 0) {
            await firestore.collection("users").add({
                username: username,
                password: hashedPw,
                salt: salt
            });
            return username;
        } else {
            return "";
        }
    }  

}

let userUpdate = {

}

let userDelete = {

}

let userLogin = {

    logInUser: (username, password) => {

    },

}

module.exports = {
    userCreate,
    userDelete,
    userRead,
    userUpdate
}