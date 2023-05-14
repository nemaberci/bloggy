const { Firestore } = require('@google-cloud/firestore')
const fs = require('fs')

let likeRead = {

    /**
     * @param {Firestore} firestore
     * @param {string} blogId
     */
    likesByBlog: async (firestore, blogId) => {

        let likes = firestore.collection(`posts/${blogId}/likedBy`);
        return (await likes.count().get()).data().count;

    },

    /**
     * @param {Firestore} firestore
     * @param {string} commentId
     */
    likesByComment: async (firestore, commentId) => {

        let likes = firestore.collection(`comments/${commentId}/likedBy`);
        return (await likes.count().get()).data().count;

    },

    /**
     * @param {Firestore} firestore
     * @param {string} blogId
     * @param {string} userId
     */
    userLikesBlog: async (firestore, blogId, userId) => {

        return (
            await firestore.collection(`posts/${blogId}/likedBy`)
                .get()
        ).docs.some(doc => {
            return doc.data()["userId"] === userId
        });

    },

    /**
     * @param {Firestore} firestore
     * @param {string} commentId
     * @param {string} userId
     */
    userLikesComment: async (firestore, commentId, userId) => {

        return (
            await firestore.collection(`comments/${commentId}/likedBy`)
                .get()
        ).docs.some(doc => {
            return doc.data()["userId"] === userId
        });

    }

}

let likeCreate = {

    /**
     * @param {Firestore} firestore
     * @param {string} blogId
     * @param {string} username
     */
    likeBlog: async (firestore, blogId, username) => {

        let users = await firestore.collection("users")
            .where("username", "==", username)
            .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        let likes = firestore.collection(`posts/${blogId}/likedBy`);
        await likes.add(
            {
                userId: userId
            }
        )

    },

    /**
     * @param {Firestore} firestore
     * @param {string} commentId
     * @param {string} username
     */
    likeComment: async (firestore, commentId, username) => {

        let users = await firestore.collection("users")
            .where("username", "==", username)
            .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        let likes = firestore.collection(`comments/${commentId}/likedBy`);
        await likes.add(
            {
                userId: userId
            }
        )

    }

}

let likeDelete = {

    /**
     * @param {Firestore} firestore
     * @param {string} blogId
     * @param {string} username
     */
    dislikeBlog: async (firestore, blogId, username) => {


        let users = await firestore.collection("users")
            .where("username", "==", username)
            .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        let toDelete = await firestore.collection(`posts/${blogId}/likedBy`)
        .where("userId", "==", userId)
        .get();
        for (let doc of toDelete.docs) {
            await doc.ref.delete();
        }

    },

    /**
     * @param {Firestore} firestore
     * @param {string} commentId
     * @param {string} username
     */
    dislikeComment: async (firestore, commentId, username) => {


        let users = await firestore.collection("users")
            .where("username", "==", username)
            .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        let toDelete = await firestore.collection(`comments/${commentId}/likedBy`)
        .where("userId", "==", userId)
        .get();
        for (let doc of toDelete.docs) {
            await doc.ref.delete();
        }

    }

}

module.exports = {
    likeRead,
    likeCreate,
    likeDelete
}