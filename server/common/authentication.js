const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]',
}, async (username, password, done) => {
  // TODO
}));
