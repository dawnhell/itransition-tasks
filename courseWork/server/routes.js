const express = require("express");
const fs      = require("fs");
const mysql   = require("mysql");
const router  = express.Router();

const uploadcare = require('uploadcare')('9ecfe61ca743b523bc27', 'e773f90ef151710b406e');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'itraCourse'
});

connection.connect();

function setCurrentUser(currentUser) {
  fs.readFile(__dirname + '/currentUser.json',
    'utf8',
    function (err, data){
      if (err){
        console.log(err);
      } else {
        var json = JSON.stringify(currentUser);
        fs.writeFile(__dirname + '/currentUser.json', json, 'utf8', function() {
          console.log("User was set as current.");
        });
      }
    }
  );
}

function getCurrentUser() {
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + '/currentUser.json',
      'utf8',
      function (err, data){
        if (err){
          console.log(err);
        } else {
          var obj = JSON.parse(data);
          resolve(obj);
        }
      }
    );
  })
}

function getUserList() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT id, name, role, user_id FROM USER;', function (err, rows) {
      if (err) {
        console.log(err);
      }
      resolve(rows);
    });
  });
}

router.post('/add', function(req, res) {
  console.log("in add");
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

    setCurrentUser(user);
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
    }
  );
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
    }
  );
});

router.get('/get/photo', function(req, res) {
  uploadcare.files.list({page: 1, limit: 100}, function(err, data) {
    if(err) {
      concole.log(err);
    } else {
      console.log("Photos were sent.");
      res.send(data);
    }
  });
});

function getCategories() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT id, name, description FROM CATEGORY;', function (err, rows) {
      if (err) {
        console.log(err);
      }
      resolve(rows);
    });
  });
}

router.get('/get/categories', function(req, res) {
  getCategories().then(function(result) {
    res.send(result);
    console.log("Categories has been sent.");
  })
});

function getTags() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT id, name FROM TAG;', function (err, rows) {
      if (err) {
        console.log(err);
      }
      resolve(rows);
    });
  });
}

router.get('/get/tags', function(req, res) {
  getTags().then(function(result) {
    res.send(result);
    console.log("Tags has been sent.");
  })
});

function addInstruction(name, category, description) {
  return new Promise(function(resolve, reject) {
    getCurrentUser().then(function (currentUser) {
      connection.query("INSERT INTO INSTRUCTION (name, description, likes_number, user_id, category_id) SELECT '" + name + "', '" + description + "', " + 0 + ", " + "USER.id, CATEGORY.id FROM USER, CATEGORY WHERE (USER.user_id='" + currentUser.user_id + "') AND (CATEGORY.name='" + category + "');",
        function(err, rows) {
          if(err) {
            console.log(err);
          }
          resolve(rows);
        }
      );
    });
  });
}

function addTags(tags) {
  return new Promise(function(resolve, reject) {
    for(var i = 0; i < tags.length; ++i) {
      connection.query("INSERT INTO TAG (name, instruction_id) SELECT '" + tags[i] + "', INSTRUCTION.id FROM INSTRUCTION ORDER BY INSTRUCTION.id DESC LIMIT 1;",
        function (err, rows) {
          if(err) {
            console.log(err);
          }
          resolve(rows);
        }
      );
    }
  });
}

function addSteps(steps) {
  return new Promise(function(resolve, reject) {
    for(var i = 0; i < steps.length; ++i) {
      connection.query("INSERT INTO STEP (name, description, picture_url, instruction_id) SELECT '" + steps[i].name + "', '" + steps[i].description + "', '" + steps[i].photoUrl + "', INSTRUCTION.id FROM INSTRUCTION ORDER BY INSTRUCTION.id DESC LIMIT 1;",
        function (err, rows) {
          if(err) {
            console.log(err);
          }
          resolve(rows);
        }
      );
    }
  });
}

router.post('/add/instruction', function(req, res) {
  var instruction = req.body;
  addInstruction(instruction.name, instruction.category, instruction.description).then(function(instructionResult) {
    addTags(instruction.tags).then(function(tagResult) {
      addSteps(instruction.steps).then(function(stepResult) {
        res.send("added instruction");
      });
    });
  });
});

module.exports = router;
