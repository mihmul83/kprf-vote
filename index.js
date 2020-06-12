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


app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.set('trust proxy', 1);
const sassMiddleware = require('node-sass-middleware');
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
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
	return res.sendFile(path.join(__dirname,'public/index.html'));
});

app.post('/vote', removeFrameguard, async(req, res) => {	
	return res.json({status:'ok'})
});

app.get('/result', removeFrameguard, async(req, res) => {	
	return res.sendFile(path.join(__dirname,'public/result.html'));
});

app.get('*', removeFrameguard, async(req, res) => {	
	return res.sendFile(path.join(__dirname,'public/error.html'));
});

const server = http.createServer(app);

server.listen(5544, function(){
	console.log('Server launched');
});