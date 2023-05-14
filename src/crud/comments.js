const { Firestore } = require('@google-cloud/firestore')
const fs = require('fs')
const {likeRead} = require('./like');

let commentRead = {

    /**
     * @param {Firestore} firestore
     */
    commentsByUserId: async (firestore, userId, username) => {

        let comments = firestore.collection(`comments`)
        .where("userId", "==", userId);
        let documents = (await comments.get()).docs;
        let documentData = []
        let users = await firestore.collection("users")
        .where("username", "==", username)
        .get();
        if (users.docs.length === 0) {
            return "";
        }
        let yourUsedId = users.docs[0].id;
        for (doc of documents) {
            let comment = doc.data();
            comment.likes =  await likeRead.likesByComment(firestore, doc.id)
            comment.likedByYou = await likeRead.userLikesComment(firestore, doc.id, yourUsedId)
            documentData.push(comment);
        }
        return documentData

    },

    /**
     * @param {Firestore} firestore
     */
    commentsByBlogId: async (firestore, blogId, username) => {

        let comments = firestore.collection(`comments`)
        .where("blogId", "==", blogId);
        let documents = (await comments.get()).docs;
        let documentData = []
        let users = await firestore.collection("users")
        .where("username", "==", username)
        .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        for (doc of documents) {
            let comment = doc.data();
            comment.likes =  await likeRead.likesByComment(firestore, doc.id)
            comment.likedByYou = await likeRead.userLikesComment(firestore, doc.id, userId)
            documentData.push(comment);
        }
        return documentData

    }

}

let commentCreate = {

    /**
     * @param {Firestore} firestore
     * @param {{content: String, username: String, blogId: String}} commentInput
     */
    createComment: async (firestore, commentInput) => {

        let comments = firestore.collection("comments");
        let users = await firestore.collection("users")
        .where("username", "==", commentInput.username)
        .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        await comments.add({
            content: commentInput.content,
            userId: userId,
            blogId: commentInput.blogId
        });
        return commentInput;

    }

}

let commentUpdate = {

    /**
     * @param {Firestore} firestore
     * @param {string} id
     * @param {{content: String}} commentInput
     */
    updateComment: async (firestore, id, commentInput) => {

        let post = firestore.collection("comments")
        .doc(id);
        await post.set({
            title: commentInput.title
        }, {
            merge: true
        });
        return commentInput;

    }

}

let commentDelete = {

    /**
     * @param {Firestore} firestore
     * @param {string} id
     */
    deleteComment: async (firestore, id) => {

        let post = firestore.collection("comments")
        .doc(id);
        await post.delete();
        return true;

    }

}

module.exports = {
    commentRead,
    commentCreate,
    commentDelete,
    commentUpdate
}