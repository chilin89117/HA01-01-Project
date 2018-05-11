const express = require('express');
const passport = require('passport');
const _ = require('lodash');
const users = require('./data/users.json');
var router = express.Router();
module.exports = router;

// In development environment only, log in as 1st user w/o credentials by default
// unless a user is specified in query string: 'localhost:3000/login?user=tiff'
router.get('/login', (req, res) => {
  if(req.app.get('env') === 'development') {
    let loginUser = users[0];
    if(req.query.user) {
      loginUser = _.find(users, (u) => u.name === req.query.user);
    }
    req.logIn(loginUser, (err) => {   // Passport function
      if(err) return next(err);
      return res.redirect('/');
    });
    return;
  }
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
  req.logout();  // Passport function -> user = null
  res.redirect('/login');
});