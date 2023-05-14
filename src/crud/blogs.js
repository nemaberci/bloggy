const { Firestore } = require('@google-cloud/firestore')
const fs = require('fs')
var jwt = require('jsonwebtoken');
const {likeRead} = require('./like');

let blogRead = {

    /**
     * @param {Firestore} firestore
     */
    allBlogs: async (firestore, username) => {

        let users = await firestore.collection("users")
        .where("username", "==", username)
        .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        let posts = firestore.collection("posts");
        let documents = (await posts.get()).docs;
        let documentData = []
        for (doc of documents) {
            let blog = doc.data();
            blog.likes =  await likeRead.likesByBlog(firestore, doc.id)
            blog.likedByYou = await likeRead.userLikesBlog(firestore, doc.id, userId)
            documentData.push(blog);
        }

        return documentData

    }

}

let blogCreate = {

    /**
     * @param {Firestore} firestore
     * @param {{content: String, title: String, username: String}} blogInput
     */
    createBlog: async (firestore, blogInput) => {

        let posts = firestore.collection("posts");
        let users = await firestore.collection("users")
        .where("username", "==", blogInput.username)
        .get();
        if (users.docs.length === 0) {
            return "";
        }
        let userId = users.docs[0].id;
        await posts.add({
            title: blogInput.title,
            content: blogInput.content,
            userId: userId
        });
        return blogInput;

    }

}

let blogUpdate = {

    /**
     * @param {Firestore} firestore
     * @param {string} id
     * @param {{content: String, title: String}} blogInput
     */
    updateBlog: async (firestore, id, blogInput) => {

        let post = firestore.collection("posts")
        .doc(id);
        await post.set({
            content: blogInput.content,
            title: blogInput.title
        }, {
            merge: true
        });
        return blogInput;

    }

}

let blogDelete = {

    /**
     * @param {Firestore} firestore
     * @param {string} id
     */
    deleteBlog: async (firestore, id) => {

        let post = firestore.collection("posts")
        .doc(id);
        await post.delete();
        return true;

    }

}

module.exports = {
    blogRead,
    blogCreate,
    blogDelete,
    blogUpdate
}