const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport-init');

app.use(require('./logging.js'));

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));

// For form data in adding chat rooms
app.use(bodyParser.urlencoded({extended:true}));
// For JSON data in posting new messages
app.use(bodyParser.json());

app.set('view engine', 'pug');
// require('express-debug')(app, {});

// Passport and sessions
app.use(require('express-session')({
  secret: 'secret', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Module for login auth
var authRouter = require('./auth');
app.use(authRouter);

// Middleware to redirect user to '/login' if not authenticated
// Placed here because 'authRouter' does not need to be protected
app.use((req, res, next) => {
  if(req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
    return;
  }
  res.redirect('/login');
});

app.get('/', (req, res) => {
  setTimeout(() => {
    res.render('home', {title: 'HA01-01-Project Home'});
  }, 1000);
});

// Module to manage chat rooms
var adminRouter = require('./admin');
app.use('/admin', adminRouter);
// Module to view/delete/add messages
var apiRouter = require('./api');
app.use('/api', apiRouter);

// Error handling (needs to be last middleware)
app.use((error, req, res, next) => {
  console.error(error);
  res.send('Custom error handler');
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});