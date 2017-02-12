var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var http = require('http');
var fs = require('fs');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(compression());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.post('/signup', function(req, res) {
  fs.readFile(__dirname + '/users.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var obj = JSON.parse(data);

        var isUsername = false;
        for(var i = 0; i < obj.users.length; ++i) {
          if(obj.users[i].username === req.body.username) {
            isUsername = true;
            break;
          }
        }
        if(isUsername) {
          res.send('username');
        } else {
          var newUser = {
            "username": req.body.username,
            "password": req.body.password
          };
          obj.users.push(newUser);
          var json = JSON.stringify(obj);
          fs.writeFile(__dirname + '/users.json',
            json,
            'utf8',
            function () { console.log("User was added."); }
          );

          res.send();
        }
      }});
});

app.post('/login', function(req, res) {
  fs.readFile(__dirname + '/users.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var isMatched  = false;
        var obj = JSON.parse(data);
        for(var i = 0; i < obj.users.length; ++i) {
          if(obj.users[i].username === req.body.username &&
             obj.users[i].password === req.body.password) {
            isMatched = true;
          }
        }
        if(isMatched) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    }
  );
});

http.createServer(app).listen(4201, function (err) {
  console.log('listening in http://localhost:4201');
});

/*
 console.log("Server is running on port 4201");
 app.listen(4201);
*/
