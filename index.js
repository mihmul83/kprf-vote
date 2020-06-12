const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

mongoose.connect('mongodb://localhost/kprfvote',{
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public'))); 

const sassMiddleware = require('node-sass-middleware');
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false, 
	sourceMap: false,
	debug: false,
	outputStyle: 'compressed',
}));

const voteSchema = new mongoose.Schema({
	email: String,
	region: String,
	q1: String,
	q2: String,
	q3: String,
	q4: String,
	q5: String,
	q6: String,
	q7: String,
	q8: String,
	q9: String,
	q10: String,
	q11: String,
	q12: String,
	q13: String,
	q14: String,
	q15: String,
	approved: Boolean
});
const Vote = mongoose.model('Vote', voteSchema);

function removeFrameguard(req, res, next) {
	res.removeHeader('X-Frame-Options');
	next();
}

function setNoCache(req, res, next){
	res.set('Cache-Control','no-cache, no-store, must-revalidate');
	next();
}

app.get('/', [setNoCache, removeFrameguard], async(req, res) => {
	try{
		if(req.cookies&&req.cookies['kprfSiteVoted']){
			return res.sendFile(path.join(__dirname,'views/voted.html'));
		}		
		return res.sendFile(path.join(__dirname,'views/index.html'));
	} catch(e) {
		return res.sendFile(path.join(__dirname,'views/error.html'));
	}	
});

app.post('/vote', removeFrameguard, async(req, res) => {
	try{
		if(req.cookies&&req.cookies['kprfSiteVoted']){
			return res.json({status:'error', error: 'votedbrowser'})
		}
		const {address, antispam} = req.body;
		if(address||antispam!=='test') {
			return res.json({status:'error', error: 'spam'})
		}
		let { email, region, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15} = req.body;		
		if(!email||!region||!q1||!q2||!q3||!q4||!q5||!q6||!q7||!q8||!q9||!q10||!q11||!q12||!q13||!q14||!q15){
			return res.json({status:'error', error: 'miss'})
		}
		email = email.toLowerCase();
		const doubles = await Vote.find({email});
		if(doubles.length>0){
			return res.json({status:'error', error: 'votedmail'})
		}
		let newVote = new Vote({ email, region, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15});
		let promise = await newVote.save();
		let options = {
			maxAge: 1000 * 60 * 60 * 24 * 365 * 20,
			httpOnly: true
		}		
		res.cookie('kprfSiteVoted', 'true', options)
		return res.json({status:'ok'})
	} catch(e) {
		return res.json({status:'error', error: e})
	}
});

app.get('/result', removeFrameguard, async(req, res) => {	
	return res.sendFile(path.join(__dirname,'views/result.html'));
});

app.get('*', removeFrameguard, async(req, res) => {	
	return res.sendFile(path.join(__dirname,'views/error.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

setTimeout(async function run(){
  const votes = await Vote.find();
  io.emit('update', votes);
  setTimeout(run, 1000);
}, 1000);


server.listen(5544, function(){
	console.log('Server launched');
});