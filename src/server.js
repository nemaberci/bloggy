// load node http module
const http = require('http')

// load third party Express module
const express = require('express')
const app = express()
const jwt = require("jsonwebtoken")

// load modules
const {blogRead, blogCreate, blogDelete, blogUpdate} = require('./crud/blogs')
const {commentCreate, commentDelete, commentRead, commentUpdate} = require('./crud/comments')
const {likeCreate, likeDelete, likeRead} = require('./crud/like')
const {userRead, userCreate} = require('./crud/users')
const logger = require('./modules/logger')

const {Firestore} = require('@google-cloud/firestore');
const validJwt = require('./middleware/validJwt')

// use middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// use logger module
app.use(logger);
// app.use('/posts', validJwt);
app.use(express.json())

// define routes
app.get('/posts', async (req, res) => {
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  const firestore = new Firestore();
  res.send(await blogRead.allBlogs(firestore, username));
  firestore.terminate();
})

app.post('/posts/create', async (req, res) => {
  const input = req.body;
  input.username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  const firestore = new Firestore();
  res.send(await blogCreate.createBlog(firestore, input));
  firestore.terminate();
})

app.post('/posts/update/:id', async (req, res) => {
  const input = req.body;
  let id = req.params.id
  const firestore = new Firestore();
  res.send(await blogUpdate.updateBlog(firestore, id, input));
  firestore.terminate();
})

app.post('/posts/delete/:id', async (req, res) => {
  let id = req.params.id
  const firestore = new Firestore();
  res.send(await blogDelete.deleteBlog(firestore, id));
  firestore.terminate();
})

app.get('/comments/user/:id', async (req, res) => {
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  let id = req.params.id
  const firestore = new Firestore();
  res.send(await commentRead.commentsByUserId(firestore, id, username));
  firestore.terminate();
})

app.get('/comments/blog/:id', async (req, res) => {
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  let id = req.params.id
  const firestore = new Firestore();
  res.send(await commentRead.commentsByBlogId(firestore, id, username));
  firestore.terminate();
})

app.post('/comments/create/blog/:id', async (req, res) => {
  let id = req.params.id
  const input = req.body;
  input.username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  input.blogId = id
  const firestore = new Firestore();
  res.send(await commentCreate.createComment(firestore, input));
  firestore.terminate();
})

app.post('/comments/update/:id', async (req, res) => {
  const input = req.body;
  input.username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  let id = req.params.id
  const firestore = new Firestore();
  res.send(await commentUpdate.updateComment(firestore, id, input));
  firestore.terminate();
})

app.post('/comments/delete/:id', async (req, res) => {
  let id = req.params.id
  const firestore = new Firestore();
  res.send(await commentDelete.deleteComment(firestore, id));
  firestore.terminate();
})

app.post('/comments/like/:id', async (req, res) => {
  let id = req.params.id
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  const firestore = new Firestore();
  res.send(await likeCreate.likeComment(firestore, id, username));
  firestore.terminate();
})

app.post('/comments/dislike/:id', async (req, res) => {
  let id = req.params.id
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  const firestore = new Firestore();
  res.send(await likeDelete.dislikeComment(firestore, id, username));
  firestore.terminate();
})

app.post('/posts/like/:id', async (req, res) => {
  let id = req.params.id
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  const firestore = new Firestore();
  res.send(await likeCreate.likeBlog(firestore, id, username));
  firestore.terminate();
})

app.post('/posts/dislike/:id', async (req, res) => {
  let id = req.params.id
  let username = jwt.decode(req.header("Authorization").substring("Bearer ".length))
  const firestore = new Firestore();
  res.send(await likeDelete.dislikeBlog(firestore, id, username));
  firestore.terminate();
})

app.post("/login", async (req, res) => {
  let username = req.body["username"];
  let password = req.body["password"];
  const firestore = new Firestore();
  res.send(await userRead.loginUser(firestore, username, password))
  firestore.terminate();
})

app.post("/users/create", async (req, res) => {
  let username = req.body["username"];
  let password = req.body["password"];
  const firestore = new Firestore();
  console.log(username, password);
  res.send(await userCreate.createUser(firestore, username, password))
  firestore.terminate();
})

// create the server
const server = http.createServer(app);

// server listen for any incoming requests
server.listen(3000);

console.log('My express web server is alive and running at port 3000')