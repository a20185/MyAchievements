
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  fs = require('fs');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
global.dbHandle = require('./database/dbHandle');
global.db = mongoose.connect("mongodb://localhost:27017/db");

var app = module.exports = express.createServer();

// Configuration
app.use(cookieParser());
app.use(session({ 
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
}));

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.use(function(req,res,next){ 
    res.locals.user = req.session.user;   // 从session 获取 user对象
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();  //中间件传递
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// Make datas with database
app.get('/initTask' , api.initTask);
app.get('/makegroup' , api.initUsers);
app.get('/inits' , api.initSys);
// JSON API
app.get('/onlineStatus' , api.online);

app.get('/login', api.login);
app.post('/api/login' , api.loginPost);
app.get('/getJudgeStudents' , api.judge);
app.get('/register',api.register);
app.post('/api/register',api.registerPost);
app.post('/logout' , api.logout);
app.get('/api/posts', api.posts);
app.get('/api/score/:id' , api.score);
app.post('/upload' , api.upload);
app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.post('/newAss' , api.newAss);
app.post('/postJudge/:id/:studentId/:submitId' , api.postJudge);
app.post('/api/send/:id/:commentId' , api.senders);
app.get('/api/assignments' , api.assignments);
app.get('/api/sendComment/:id' , api.sending);
app.get('/api/recvComment/:id' , api.receiving);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
