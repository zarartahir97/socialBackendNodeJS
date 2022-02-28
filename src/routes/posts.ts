import express, { Request, NextFunction, Router } from 'express';
import { APIResponse } from '../interface';
const router: Router = express.Router();
import Post from '../models/post';
import User from '../models/user';
import authentication from './middleware/authentication';

//Get all posts
router.get('/', async (req: Request, res: APIResponse) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
});

//Get all posts for a user
router.get('/user', authentication, async (req: Request, res: APIResponse) => {
	try {
		const posts = await Post.find({ userID: req.query.id });
		res.json(posts);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
});

//Get feed for a user
router.get('/feed', authentication, async (req: Request, res: APIResponse) => {
	const { page = 1 } = req.query;
	const limit = 3;
	try {
		const user = await User.findById(req.query.id);
		if (user === null)
			return res.status(401).json({ message: 'User not found' });
		let posts = await Post.find({
			userID: { $in: user.followingList },
		})
			.skip((page as number - 1) * limit)
			.limit(limit);
		if (req.query.filter)
			posts = posts.filter((post) =>
				post.caption.includes(req.query.filter as string)
			);
		res.json(posts);
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
});

//Create post
router.post('/create', authentication, async (req: Request, res: APIResponse) => {
	const post = new Post({
		userID: req.body.userID,
		caption: req.body.caption,
	});
	try {
		const userPerson = await User.findById(req.body.userID);
		if (userPerson === null)
			return res.status(404).json({ message: 'Cannot find user' });
		const newPost = await post.save();
		const io = req.app.get('socketIO');
		io.emit('postAdded', newPost.toObject());
		res.json(newPost);
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

//Get post
router.get('/:id', authentication, getPost, (req: Request, res: APIResponse) => {
	res.json(res.post);
});

//Delete post
router.get('/delete/:id', authentication, getPost, async (req: Request, res: APIResponse) => {
	try {
		await res.post!.remove();
		res.json({ message: 'Post deleted' });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
});

//Update Post
router.post('/update/:id', authentication, getPost, async (req: Request, res: APIResponse) => {
	if (req.body.caption != null) {
        res.post!.caption = req.body.caption;
	}
    res.post!.updatedAt = Date.now();
    try {
    	const updatedPost = await res.post!.save();
    	res.json(updatedPost);
    } catch(error: any) {
    	res.status(400).json({ message: error.message });
    }
});

//Middleware to get the post from ID
async function getPost(req: Request, res: APIResponse, next: NextFunction) {
	let post;
	try {
		post = await Post.findById(req.params.id);
		if (post === null) {
			return res.status(404).json({ message: 'Cannot find post' });
		}
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
	res.post = post;
	next();
}

export default router;
