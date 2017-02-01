var express     = require('express');
var jwt         = require('jsonwebtoken');
var bodyParser  = require('body-parser');
var fs          = require("fs");
var app         = module.exports = express.Router();
var nodemailer  = require('@nodemailer/pro');
var userName    = null;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function createToken(user) {
    var jwtToken = jwt.sign({ data: user }, 'superSecret', { expiresIn: '1h' });
    return jwtToken;
}

app.post('/users', function(req, res) {
  fs.readFile(__dirname + '/users.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var obj = JSON.parse(data);

        var isEmail = false;
        for(var i = 0; i < obj.users.length; ++i) {
            if(obj.users[i].email === req.body.email) {
                isEmail = true;
                break;
            }
        }

        var isUsername = false;
        for(var i = 0; i < obj.users.length; ++i) {
          if(obj.users[i].username === req.body.username) {
              isUsername = true;
            break;
          }
        }

        if(isEmail) {
            res.send('email');
        } else{
            if(isUsername) {
                res.send('username');
            } else {
                var newUser = {
                    "username": req.body.username,
                    "password": req.body.password,
                    "email": req.body.email,
                    "verified": "false"
                };
                obj.users.push(newUser);
                var json = JSON.stringify(obj);
                fs.writeFile(__dirname + '/users.json',
                    json,
                    'utf8',
                    function () { console.log("User was added."); }
                );

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'kvladislavo2013@gmail.com',
                        pass: 'nfkfkpiwwmusrrxx'
                    }
                });
                userName = req.body.username;
                var userEmail = req.body.email;
                var userToken = createToken(req.body.username);
                var tokenLink = "http://localhost:3001/users/verify?q=" + createToken(req.body.username);

                var mailOptions = {
                    from: '<kvladislavo2013@gmail.com>',
                    to: userEmail,
                    subject: 'Verification',
                    text: 'Confirm email, please.',
                    html: 'Click here: <a href="' + tokenLink + '">' + tokenLink + '</a>'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                   if (error) {
                   return console.log(error);
                   }
                   console.log('Message %s sent: %s', info.messageId, info.response);
                });
                res.send();
            }
        }
      }});
});

app.get('/users/verify', function(req, res) {
  var decode = jwt.decode(req.query.q);
  if(userName == decode.data) {
    fs.readFile(__dirname + '/users.json',
      'utf8',
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          var obj = JSON.parse(data);
          for (var i = 0; i < obj.users.length; ++i) {
            if (obj.users[i].username === userName) {
              obj.users[i].verified = "true";
              break;
            }
          }
          var json = JSON.stringify(obj);
          fs.writeFile(__dirname + '/users.json',
            json,
            'utf8',
            function () { console.log("User was verified."); }
          );
        }
      }
    );
    res.sendFile(__dirname + '/redirect.html');
  } else {
      console.log("Do not even hope!");
  }
});

app.post('/sessions/create', function(req, res) {
  fs.readFile(__dirname + '/users.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var matched  = false;
        var verified = 'false';
        var obj = JSON.parse(data);
        for(var i = 0; i < obj.users.length; ++i) {
          if(obj.users[i].username === req.body.username && obj.users[i].password === req.body.password) {
            matched = true;
            verified = obj.users[i].verified.toString();
          }
        }
        if(matched) {
          if(verified == 'false') {
            res.send('unverified');
          } else {
            if(verified == 'true') {
              res.send(true);
            }
          }
        } else {
          res.send(false);
        }
      }
    }
  );
});

app.get('/logout', function(req, res) {
  userName = null;
  res.send();
});