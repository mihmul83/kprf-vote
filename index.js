const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const app = express();
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

function removeFrameguard(req, res, next) {
	res.removeHeader('X-Frame-Options');
	next();
}

function setNoCache(req, res, next){
	res.set('Cache-Control','no-cache, no-store, must-revalidate');
	next();
}

app.get('/', removeFrameguard, async(req, res) => {
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
		console.log(req.cookies);
		console.log(req.body);
		if(req.cookies&&req.cookies['kprfSiteVoted']){
			return res.json({status:'error', error: 'voted'})
		}

		let options = {
			maxAge: 1000 * 60 * 60 * 24 * 365 * 20,
			httpOnly: true,
			signed: true
		}		
		res.cookie('kprfSiteVoted', 'true')
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

const server = http.createServer(app);

server.listen(5544, function(){
	console.log('Server launched');
});