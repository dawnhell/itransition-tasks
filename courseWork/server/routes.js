const express = require("express");
const fs      = require("fs");
const mysql   = require("mysql");
const router  = express.Router();

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'itraCourse'
});
connection.connect();

router.get('/get', function(req, res) {

  res.send("not");
});

function getUserList() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT id, name, role, user_id FROM USER;', function (err, rows) {
      if (err) {
        console.log(err);
      }
      resolve(rows);
    })
  });
}

router.post('/add', function(req, res) {
  var user = {
    name: req.body.name,
    role: 'user',
    user_id: req.body.user_id
  };

  getUserList().then(function(res) {
    var index = res.findIndex(function(obj) {
      return obj.user_id == user.user_id;
    });

    if(index === -1) {
      connection.query('INSERT INTO USER SET ? ', user, function(err, res) {
        if(err) {
          console.log(err);
        }
        console.log("User has been added.");
      });
    }
  });

  res.send("added");
});

router.get('/get/settings', function(req, res) {
  fs.readFile(__dirname + '/preloadSettings.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var obj = JSON.parse(data);
        res.send(obj);
      }
    });
});

router.post('/set/settings', function(req, res) {
  var settings = {
    lang: req.body.lang,
    isLightTheme: req.body.isLightTheme
  };

  fs.readFile(__dirname + '/preloadSettings.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var json = JSON.stringify(settings);
        fs.writeFile(__dirname + '/preloadSettings.json', json, 'utf8', function() {
          console.log("Settings were saved.");
        });

        res.send();
      }
    });
});

module.exports = router;
