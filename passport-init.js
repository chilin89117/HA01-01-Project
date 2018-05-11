const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const users = require('./data/users.json');

passport.use(new localStrategy((username, password, done) => {
  let user = users.find(u => u.name === username);
  if(!user || user.password !== password) {
    done(null, false);  // done(error, boolean)
    return;
  }
  done(null, user);  // 'user' will be stored in session
}));

// Store to req.session.passport.user = {id: '...'}
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Look up user every time in case user's property has changed
// User is now available as req.user
passport.deserializeUser((id, done) => {
  let user = users.find((u) => u.id === id);
  done(null, user);
});
