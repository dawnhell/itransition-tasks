var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');
var bodyParser  = require('body-parser');

var fs = require("fs");
var app = module.exports = express.Router();
const nodemailer = require('@nodemailer/pro');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// XXX: This should be a database of users :).
/*var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];*/

function createToken(user) {
  var jwtToken = jwt.sign({ data: user }, 'superSecret', { expiresIn: '1h' });
  return jwtToken;

  /*var decode = jwt.decode(jwtToken);
  console.log(decode.data);*/
}

app.post('/users', function(req, res) {
  console.log("IN USERS" + __dirname);

  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the email, username and password");
  }
  fs.readFile(__dirname + '/users.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var obj = JSON.parse(data);

        var isHere = false;
        for(var i = 0; i < obj.size; ++i) {
          if(obj[i].users.username === req.body.username) {
            isHere = true;
            break;
          }
        }
        if (isHere) {
          return res.status(400).send("A user with that username already exists");
        }
        isHere = false;
        for(var i = 0; i < obj.users.size; ++i) {
          if(obj.users[i].email === req.body.email) {
            isHere = true;
            break;
          }
        }
        if (isHere) {
          return res.status(400).send("A user with that email already exists");
        }
        var newUser = {
          "username": req.body.username,
          "password": req.body.password,
          "email": req.body.email
        };
        obj.users.push(newUser);
        var json = JSON.stringify(obj);
        fs.writeFile(__dirname + '/users.json',
          json,
          'utf8',
          function () { console.log("User was added."); }
        );
      }});

  var transporter = nodemailer.createTransport({
   /*pool: true,
     host: 'smtp.gmail.com',
     port: 587,
     secure: true, // use TLS
     auth: {
     user: 'vlad.klochkov.new@gmail.com',
     pass: 'kvo98_new'
     }*/

    service: 'gmail',
    auth: {
      user: 'kvladislavo2013@gmail.com',
      pass: 'nfkfkpiwwmusrrxx'
    }
  });

  var userEmail = req.body.email;
  var userToken = createToken(req.body.username);
  var tokenLink = "localhost:3001/users/verify?q=" + createToken(req.body.username);

  var mailOptions = {
    from: '<kvladislavo2013@gmail.com>',
    to: userEmail,
    subject: 'Verification',
    text: 'Confirm email, please.',
    html: "Click this:\n <a href=" + tokenLink + ">" + tokenLink + "</a>"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  res.status(201).send({
    /*id_token: createToken(profile)*/
  });
});

app.get('/users/verify/', function(req, res) {
  console.log(req.originalUrl);
});

app.post('/sessions/create', function(req, res) {
  console.log("HEHE");
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  var user = _.find(users, {username: req.body.username});
  if (!user) {
    return res.status(401).send("The username or password don't match");
  }

  if (!(user.password === req.body.password)) {
    return res.status(401).send("The username or password don't match");
  }

  res.status(201).send({
    id_token: createToken(user)
  });

});
