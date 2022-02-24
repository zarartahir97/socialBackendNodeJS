require('dotenv').config();
import express, {Request, Response, Application} from 'express';
import mongoose from 'mongoose';
import {Server, Socket} from 'socket.io';
import http from 'http';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
server.listen(3000, () => {
	console.log('server started....');
});

//Setting basic html for socket connection
app.set('view engine', 'ejs');
app.set('socketIO', io);

//Setting up feed write just to see live events log
app.get('/feed', (req: Request, res: Response) => {
	res.render('feed');
});
//Setting user routes
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

//Setting user routes
const postsRoutes = require('./routes/posts');
app.use('/posts', postsRoutes);

mongoose.connect(process.env.DB_URL!, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//connecting to db
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to db successfully'));

// setting up sockets
io.on('connection', (socket: Socket) => {
	console.log('A user is connected with socket id:', socket.id);
});
