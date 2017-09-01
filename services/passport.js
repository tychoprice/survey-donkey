const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.use(
  new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({googleId: profile.id}).then((existingUser) => {
        if (existingUser) {
          //already have record in db
          done(null, existingUser);
        } else {
          //make new record
          new User({googleId: profile.id})
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
