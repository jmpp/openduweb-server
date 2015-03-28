var express      = require('express');
var FS           = require('q-io/fs');
var low          = require('lowdb');
var sanitizeHtml = require('sanitize-html');

var router = new express.Router();
var db     = low('db.json');

router.get('/getMessages', getMessages);
router.put('/putMessage', putMessage);

function getMessages(req, res) {
  var jsonData = db('messages')
                  .chain()
                  .sortByOrder('postedAt', false) // DESC
                  .take(10)
                  .value();
  res.status(200).json(jsonData);  
}

function putMessage(req, res) {
  if (typeof req.body.name !== 'string' || typeof req.body.message !== 'string')
    return res.status(500).end("`name` and `message` must be a String");

  var name    = (req.body.name || "").trim();
  var message = (req.body.message || "").trim();

  // Sanitizing HTML injection
  name    = sanitizeHtml(name);
  message = sanitizeHtml(message);

  if (!name || !message)
    return res.status(500).end("`name` and `message` must be provided and not empty");

  var messagesDB = db('messages');
  messagesDB.push({
    name     : name,
    message  : message,
    postedAt : Date.now()
  });

  var jsonData = messagesDB
    .chain()
    .sortByOrder('postedAt', false) // DESC
    .take(10)
    .value();

  res.status(200).json(jsonData);
}

module.exports = router;