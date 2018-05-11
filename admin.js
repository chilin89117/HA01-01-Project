const uuidv4 = require('uuid/v4');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
module.exports = router;

rooms = require('./data/rooms.json');

// Middleware to allow users with 'admin' status
router.use((req, res, next) => {
  if(req.user.admin) {
    next();
    return;
  }
  res.redirect('/');
});

router.get('/rooms', (req, res) => {
  res.render('rooms', {title: 'HA01-01-Project Rooms', rooms});
});

router.route('/rooms/add')
      .get((req, res) => {
        res.render('add');
      })
      .post((req, res) => {
        let room = {
          name: req.body.name,
          id: uuidv4()
        };
        rooms.push(room);
        res.redirect(req.baseUrl + '/rooms');
      });

router.route('/rooms/:id/edit')
      .all((req, res, next) => {
        let roomId = req.params.id;
        let room = _.find(rooms, (r) => r.id === roomId);
        if(!room) {
          res.sendStatus(404);
          // next(new Error("Error"));
          return;
        }
        res.locals.room = room;
        next();
      })
      .get((req, res) => {
        res.render('edit');
      })
      .post((req, res) => {
        res.locals.room.name = req.body.name;
        _.map(rooms, (r) => r.id === res.locals.room.id ? r.name = req.body.name : '');
        res.redirect(req.baseUrl + '/rooms');
      });

router.get('/rooms/:id/delete', (req, res) => {
  let roomId = req.params.id;
  _.remove(rooms, (r) => r.id === roomId);
  res.redirect(req.baseUrl + '/rooms');
});
