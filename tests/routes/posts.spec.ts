import { describe } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
const should = chai.should();

chai.use(chaiHttp);

describe('Unit tests for Post route', () => {
	let token: string;
	let userID: string;
	before((done) => {
		const user = {
			name: 'Hamd Zulfiqar',
			email: 'hamd.zulfiqar@tintash.com',
			password: 'dev5678',
			DOB: '08/04/1997',
			gender: 'Male'
		};

		chai.request(app)
			.post('/users/signup')
			.send(user)
			.end(() => {
				chai.request(app)
					.post('/users/login')
					.send(user)
					.end((err, res) => {
						userID = res.body._id;
						token = res.body.token;
						done();
					});
			});
	});

	after((done) => {
		chai.request(app)
			.get(`/users/delete/${userID}`)
			.set({'Authorization': `Bearer ${token}`})
			.end(() => {
				done();
			});
	});

	describe('Unauthorized Post route APIs', () => {
		describe('Get all Posts', () => {
			it('Get all Posts success', () => {
				chai.request(app)
					.get('/posts/')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
					});
			});
		});
	});

	describe('Authorized Post route APIs', () => {
		let postID: string;
		describe('Create Post', () => {
			it('Create Post success', (done) => {
				const post = {
					userID,
					caption: 'Dummy post'
				};
				chai.request(app)
					.post('/posts/create')
					.set({'Authorization': `Bearer ${token}`})
					.send(post)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('userID').eql(userID);
						res.body.should.have.property('caption').eql('Dummy post');
						postID = res.body._id;
						done();
					});
			});

			it('User not found error', () => {
				const user_id = userID.slice(0, -3) + 'abc';
				const post = {
					userID: user_id,
					caption: 'Dummy post'
				};
				chai.request(app)
					.post('/posts/create')
					.set({'Authorization': `Bearer ${token}`})
					.send(post)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Cannot find user');
					});
			});

			it('Invalid userID error', () => {
				const user_id = 'abc123';
				const post = {
					userID: user_id,
					caption: 'Dummy post'
				};
				chai.request(app)
					.post('/posts/create')
					.set({'Authorization': `Bearer ${token}`})
					.send(post)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('message');
					});
			});
		});
		
		describe('Get Post', () => {
			it('Get Post success', () => {
				chai.request(app)
					.get(`/posts/${postID}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('userID').eql(userID);
						res.body.should.have.property('caption').eql('Dummy post');
					});
			});

			it('Post not found error', () => {
				const post_id = postID.slice(0, -3) + 'abc';
				chai.request(app)
					.get(`/posts/${post_id}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Cannot find post');
					});
			});

			it('Invalid postID error', () => {
				const post_id = 'abc123';
				chai.request(app)
					.get(`/posts/${post_id}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(500);
						res.body.should.be.a('object');
						res.body.should.have.property('message');
					});
			});
		});

		describe('Get User Feed', () => {
			it('Get User Feed success', () => {
				chai.request(app)
					.get(`/posts/feed?id=${userID}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
					});
			});

			it('User not found error', () => {
				const user_id = userID.slice(0, -3) + 'abc';
				chai.request(app)
					.get(`/posts/feed?id=${user_id}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(401);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('User not found');
					});
			});

			it('Invalid userID error', () => {
				const user_id = 'abc123';
				chai.request(app)
					.get(`/posts/feed?id=${user_id}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(500);
						res.body.should.be.a('object');
						res.body.should.have.property('message');
					});
			});
		});

		describe('Update Post', () => {
			it('Update Post success', () => {
				const post = {
					caption: 'Temporary post'
				};
				chai.request(app)
					.post(`/posts/update/${postID}`)
					.set({'Authorization': `Bearer ${token}`})
					.send(post)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('userID').eql(userID);
						res.body.should.have.property('caption').eql('Temporary post');
					});
			});
		});

		describe('Delete Post', () => {
			it('Delete Post success', () => {
				chai.request(app)
					.get(`/posts/delete/${postID}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Post deleted');
					});
			});
		});
	});
});