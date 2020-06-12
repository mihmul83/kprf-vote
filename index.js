const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public'))); 



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

app.get('/result', removeFrameguard, async(req, res) => {	
	return res.sendFile(path.join(__dirname,'public/result.html'));
});

app.get('*', async(req, res) => {	
	return res.sendFile(path.join(__dirname,'public/error.html'));
});

const server = http.createServer(app);

server.listen(5544, function(){
  console.log('Server launched');
});