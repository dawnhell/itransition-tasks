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

app.get('/files', function(req, res) {
  var fileList = [];
  var i = 0;
  fs.readdir(__dirname + "/samples", function (err, files) {
    files.forEach(function (file) {
      fileList.push({ "id": i++, "file": file });
    });
    res.send(fileList);
  });
});

app.post('/file', function(req, res) {
  var fileName = req.body.filename;
  fs.readFile(__dirname + "/samples/" + fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    res.send(data);
  });
});

app.post('/save', function(req, res) {
  var fileName = req.body.filename;
  var code = req.body.code;
  fs.readFile(__dirname + "/samples/" + fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    } else {
      fs.writeFile(__dirname + "/samples/" + fileName,
        code,
        'utf8',
        function () { console.log("File was saved."); }
      );
    }
  });
  res.send();
});

app.post('/create', function(req, res) {
  var fileName = req.body.filename;
  if(fileName[fileName.length - 1] != 'b' && fileName[fileName.length - 2] != '.') {
    fileName += '.b';
  }
  fs.writeFile(__dirname + "/samples/" + fileName,
    '[Start writing code here]',
    function () { console.log("File was created."); }
  );
  res.send();
});

app.post('/rename', function(req, res) {
  var oldName = req.body.old;
  var newName = req.body.new;
  if(newName[newName.length - 1] != 'b' && newName[newName.length - 2] != '.') {
    newName += '.b';
  }
  fs.rename(__dirname + "/samples/" + oldName, __dirname + "/samples/" + newName,
    function () { console.log("File was renamed."); }
  );

  res.send();
});

app.post('/remove', function(req, res) {
  var fileName = req.body.filename;
  fs.unlink(__dirname + "/samples/" + fileName, function() {
    console.log("File was removed.");
  });
  res.send();
});

http.createServer(app).listen(4201, function (err) {
  console.log('listening in http://localhost:4201');
});

/*
 console.log("Server is running on port 4201");
 app.listen(4201);
*/
