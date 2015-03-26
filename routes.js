var express      = require('express');
var fs           = require("fs");
var FS           = require('q-io/fs');
var sanitizeHtml = require('sanitize-html');

var router = new express.Router();

router.get('/getMessages', getMessages);
router.put('/putMessage', putMessage);

function getMessages(req, res) {
  fs.readFile('messages.json', { encoding: 'utf8' }, function(err, data) {
    // Reading file data
    if (err)
      return res.status(500).end("Internal error - Can't read messages from file :/ - Please contact support");

    // Parsing JSON
    try {
      var messages = JSON.parse(data);
    } catch (e) {
      return res.status(500).end("Internal error - Error while parsing JSON :/ - Please contact support");
    }

    // Sending result
    res.status(200).json(messages);
  });
}

function putMessage(req, res) {
  var name    = (req.body.name || "").trim();
  var message = (req.body.message || "").trim();

  // Sanitizing HTML injection
  name    = sanitizeHtml(name);
  message = sanitizeHtml(message);

  if (!name || !message)
    return res.status(500).end("`name` and `message` must be provided and not empty");

  var jsonData;
  FS.read('messages.json')
    .then(JSON.parse)
    .then(function(data) {
      data.push({
        name: name,
        message: message
      });      
      return data;
    })
    .then(function(data) {
      jsonData = data;
      return FS.write('messages.json', JSON.stringify(data));
    })
    .then(function(data) {
      res.status(200).json(data);
    })
    .then(null, function() {
      res.status(500).end("Internal error :/ Please contact support");
    });
}

module.exports = router;