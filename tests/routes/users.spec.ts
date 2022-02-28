import { describe } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app';
const should = chai.should();

chai.use(chaiHttp);

describe('Unit tests for User route', () => {
	let token: string;
	let userID: string;
	let followerID: string;
	before((done) => {
		const user = {
			name: 'Zarar Tahir',
			email: 'zarar.tahir@tintash.com',
			password: 'dev3151',
			DOB: '08/04/1997',
			gender: 'Male'
		};

		chai.request(app)
			.post('/users/signup')
			.send(user)
			.end(() => {
				const newUser = {
					email: 'zarar.tahir@tintash.com',
					password: 'dev3151',
				};
				chai.request(app)
					.post('/users/login')
					.send(newUser)
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

	describe('Unauthorized User route APIs', () => {    
		describe('Get all Users', () => {
			it('Get all Users success', () => {
				chai.request(app)
					.get('/users')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
					});
			});
		});
		
		describe('User Signup', () => {
			it('User Signup success', (done) => {
				const user = {
					name: 'Moiz Imran',
					email: 'moiz.imran@tintash.com',
					password: 'dev1234',
					DOB: '08/04/1997',
					gender: 'Male'
				};
				chai.request(app)
					.post('/users/signup')
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('moiz.imran@tintash.com');
						followerID = res.body._id;
						done();
					});
			});

			it('User already exist error', () => {
				const user = {
					name: 'Moiz Imran',
					email: 'moiz.imran@tintash.com',
					password: 'dev1234',
					DOB: '08/04/1997',
					gender: 'Male'
				};
				chai.request(app)
					.post('/users/signup')
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('User already exists');
					});
			});
		});

		describe('User Login', () => {
			it('User Login', (done) => {
				const user = {
					email: 'moiz.imran@tintash.com',
					password: 'dev1234'
				};
				chai.request(app)
					.post('/users/login')
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('moiz.imran@tintash.com');
						res.body.should.have.property('token');
						done();
					});
			});

			it('Invalid email credentials error', () => {
				const user = {
					email: 'abc@tintash.com',
					password: 'dev1234'
				};
				chai.request(app)
					.post('/users/login')
					.send(user)
					.end((err, res) => {
						res.should.have.status(401);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Invalid credentials');
					});
			});

			it('Invalid password credentials error', () => {
				const user = {
					email: 'moiz.imran@tintash.com',
					password: 'abc123'
				};
				chai.request(app)
					.post('/users/login')
					.send(user)
					.end((err, res) => {
						res.should.have.status(401);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Invalid credentials');
					});
			});
		});
	});

	describe('Authorized User route APIs', () => {
		describe('Get User', () => {
			it('Get User success', () => {
				chai.request(app)
					.get(`/users/${userID}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('zarar.tahir@tintash.com');
					});
			});

			it('Authentication failed invalid token error', () => {
				chai.request(app)
					.get(`/users/${userID}`)
					.set({'Authorization': 'Bearer abc123'})
					.end((err, res) => {
						res.should.have.status(401);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Authentication Failed');
					});
			});

			it('Authentication failed no token error', () => {
				chai.request(app)
					.get(`/users/${userID}`)
					.set({'Authorization': 'Bearer'})
					.end((err, res) => {
						res.should.have.status(401);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Authentication Failed');
					});
			});

			it('User not found error', () => {
				const user_id = userID.slice(0, -3) + 'abc';
				chai.request(app)
					.get(`/users/${user_id}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Cannot find user');
					});
			});

			it('Invalid userID error', () => {
				const user_id = 'abc123';
				chai.request(app)
					.get(`/users/${user_id}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(500);
						res.body.should.be.a('object');
						res.body.should.have.property('message');
					});
			});
		});
		
		describe('Update User', () => {
			it('Update User success', () => {
				const user = { 
					email: 'zarar.tahir@gmail.com',
					name: 'Zarar'
				};
				chai.request(app)
					.post(`/users/update/${userID}`)
					.set({'Authorization': `Bearer ${token}`})
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('zarar.tahir@gmail.com');
						res.body.should.have.property('name').eql('Zarar');
					});
			});
		});

		describe('Follow User', () => {
			it('Follow User success', (done) => {
				const user = { 
					userID,
					followerID,
				};
				chai.request(app)
					.post('/users/follow')
					.set({'Authorization': `Bearer ${token}`})
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('zarar.tahir@gmail.com');
						done();
					});
			});

			it('User not found error', () => {
				const user_id = userID.slice(0, -3) + 'abc';
				const user = { 
					userID: user_id,
					followerID,
				};
				chai.request(app)
					.post('/users/follow')
					.set({'Authorization': `Bearer ${token}`})
					.send(user)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Cannot find user');
					});
			});

			it('Already follower exist error', () => {
				const user = { 
					userID,
					followerID,
				};
				chai.request(app)
					.post('/users/follow')
					.set({'Authorization': `Bearer ${token}`})
					.send(user)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Already a follower');
					});
			});
		});

		describe('Unfollow User', () => {
			it('Unfollow User success', () => {
				const user = { 
					userID,
					followerID,
				};
				chai.request(app)
					.post('/users/unfollow')
					.set({'Authorization': `Bearer ${token}`})
					.send(user)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('email').eql('zarar.tahir@gmail.com');
					});
			});

			it('User not found error', () => {
				const user_id = userID.slice(0, -3) + 'abc';
				const user = { 
					userID: user_id,
					followerID,
				};
				chai.request(app)
					.post('/users/unfollow')
					.set({'Authorization': `Bearer ${token}`})
					.send(user)
					.end((err, res) => {
						res.should.have.status(404);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Cannot find user');
					});
			});
		});

		describe('Delete User', () => {
			it('Delete User success', () => {
				chai.request(app)
					.get(`/users/delete/${followerID}`)
					.set({'Authorization': `Bearer ${token}`})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('User deleted');
					});
			});
		});
	});
});