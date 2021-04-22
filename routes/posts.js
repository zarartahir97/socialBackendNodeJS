const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const authentication = require("./middleware/authentication");

//Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get all posts for a user
router.get("/user", authentication, async (req, res) => {
    try {
        const posts = await Post.find({ userID: req.query.id });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get feed for a user
router.get("/feed", authentication, async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 3;
    try {
        const user = await User.findById(req.query.id);
        if (user === null)
            return res.status(401).json({ message: "User not found" });
        let posts = await Post.find({
            userID: { $in: user.followingList },
        })
            .skip((page - 1) * limit)
            .limit(limit);
        if (req.query.filter)
            posts = posts.filter((post) =>
                post.caption.includes(req.query.filter)
            );
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Create post
router.post("/create", authentication, async (req, res) => {
    const post = new Post({
        userID: req.body.userID,
        caption: req.body.caption,
    });
    try {
        user = await User.findById(req.body.userID);
        if (user === null)
            return res.status(404).json({ message: "Cannot find user" });
        const newPost = await post.save();
        const io = req.app.get("socketIO");
        io.emit("postAdded", newPost.toObject());
        res.json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Get post
router.get("/:id", authentication, getPost, (req, res) => {
    res.json(res.post);
});

//Delete post
router.get("/delete/:id", authentication, getPost, async (req, res) => {
    try {
        await res.post.remove();
        res.json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Update Post
router.post("/update/:id", authentication, getPost, async (req, res) => {
    if (req.body.caption != null) {
        res.post.caption = req.body.caption;
    }
    res.post.updatedAt = Date.now();
    try {
        const updatedPost = await res.post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Middleware to get the post from ID
async function getPost(req, res, next) {
    let post;
    try {
        post = await Post.findById(req.params.id);
        if (post === null) {
            return res.status(404).json({ message: "Cannot find post" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.post = post;
    next();
}

module.exports = router;
