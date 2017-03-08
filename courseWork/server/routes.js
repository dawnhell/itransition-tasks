const express = require("express");
const fs      = require("fs");
const mysql   = require("mysql");
const router  = express.Router();

const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const uploadcare = require('uploadcare')('9ecfe61ca743b523bc27', 'e773f90ef151710b406e');

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

/*
* Google Drive api
* START
*/
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs.json';

const runGoogleDrive = function() {
  fs.readFile(TOKEN_DIR + 'client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    var token = authorize(JSON.parse(content), listFiles);
    return token;
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      getNewToken(oauth2Client, callback);
      oauth2Client.credentials = JSON.parse(token);
      // callback(oauth2Client);
      return oauth2Client;
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  var service = google.drive('v2');
  service.files.list({
    auth: auth,
    maxResults: 20,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.items;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
      var res = {
        files: []
      };

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if(file.title.indexOf("photo") !== -1) {
          res.files.push(file);
          console.log('%s (%s)', file.title, file.id);
        }
      }

      return res;
      console.log(res);
    }
  });
}

/*END*/


router.get('/get/photo', function(req, res) {
  // var token = runGoogleDrive();
  // var files = listFiles(token);
  // console.log(files);
  // res.send(files);

  uploadcare.files.list({page: 1, limit: 100}, function(err, data) {
    if(err) {
      concole.log(err);
    } else {
      console.log("Photos were sent.");
      res.send(data);
    }
  });
});

module.exports = router;
