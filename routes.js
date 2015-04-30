var express      = require('express');
var low          = require('lowdb');
var sanitizeHtml = require('sanitize-html');

var router = new express.Router();
var db     = low('db.json');

router.get ('/getMessages', getMessages);
router.put ('/putMessage' , putMessage);
router.post('/putMessage' , badMethod);
router.get ('/putMessage' , badMethod);

function badMethod(req, res) {
  // res.status(405).end("Method POST is not allowed. You should prefer using PUT to create new messages");
  res.views.index.error = { code : 405, message : 'Method '+ req.method.toUpperCase() +' is not allowed. You should prefer using PUT to create new messages' };
  res.status(405).render('index', res.views.index);
}

function getMessages(req, res) {
  var jsonData = db('messages')
                  .chain()
                  .sortByOrder('postedAt', false) // DESC
                  .take(20)
                  .value();
  res.status(200).json(jsonData);  
}

function putMessage(req, res) {
  if (typeof req.body.name !== 'string' || typeof req.body.message !== 'string') {
    // return res.status(500).end("`name` and `message` must be a String");
    res.views.index.error = { code : 500, message : '`name` and `message` must be a String' };
    return res.status(500).render('index', res.views.index);
  }

  var name    = (req.body.name || "").trim();
  var message = (req.body.message || "").trim();

  // Checking size
  if (name.length > 20)
    name = name.slice(0, 20);
  if (message.length > 255)
    message = message.slice(0, 255) + " ...";

  // Sanitizing HTML injection
  name    = sanitizeHtml(name);
  message = sanitizeHtml(message);

  if (!name || !message) {
    // return res.status(500).end("`name` and `message` must be provided and not empty");
    res.views.index.error = { code : 500, message : '`name` and `message` must be provided and not empty' };
    return res.status(500).render('index', res.views.index);
  }

  var messagesDB = db('messages');
  messagesDB.push({
    name     : name,
    message  : message,
    postedAt : Date.now()
  });

  var jsonData = messagesDB
    .chain()
    .sortByOrder('postedAt', false) // DESC
    .take(20)
    .value();

  res.status(200).json(jsonData);
}

module.exports = router;