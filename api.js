const express = require("express");
const uuidv4 = require("uuid/v4");
const users = require('./data/users.json');
var rooms = require("./data/rooms.json");
var messages = require("./data/messages.json");

var router = express.Router();
module.exports = router;

router.get("/rooms", (req, res) => {
  res.json(rooms);
});

router.route("/rooms/:roomId/messages")
  .get((req, res) => {
    let roomId = req.params.roomId;
    let roomMessages = messages.filter((m) => m.roomId === roomId)
                               .map((m) => {
                                let u = users.find((u) => u.id === m.userId);
                                 return {text: `${u.name}: ${m.text}`};
                               });
    let room = rooms.find((r) => r.id === roomId);
    if (!room) {
      res.sendStatus(404);
      return;
    }
    res.json({
      room,
      messages: roomMessages
    });
  })
  .post((req, res) => {
    let roomId = req.params.roomId;
    let message = {
      roomId,
      text: req.body.text,  // JSON data parsed by bodyParser
      userId: req.user.id,
      id: uuidv4()
    };
    messages.push(message);
    res.sendStatus(200);
  })
  .delete((req, res) => {
    let roomId = req.params.roomId;
    // note: careful as this will not update the array that was exported from the messages.json module so if you use that array in other modules it won't update.
    messages = messages.filter((m) => m.roomId !== roomId);
    res.sendStatus(200);
  });
  