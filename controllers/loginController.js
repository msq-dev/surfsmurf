const User = require('../models/user');
const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authenticateUser = async (email, password, done) => {
  User.findOne({ user_email: email }, async function(err, user) {
    if (err) { return done(err); }

    if (!user) {
      return done(null, false, { message: 'No user with that email.' });
    }

    user.validPassword(password).then(valid => {
      if (valid === true) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });

  });
};

passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
passport.serializeUser((user, done) => { done(null, user.id); });
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => { done(err, user); });
});

exports.loginPage = (req, res, next) => {
  res.render('login');
}

exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})

exports.registerPage = (req, res, next) => {
  res.render('register');
}

exports.register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let user = new User(
      {
        user_name: req.body.name,
        user_email: req.body.email,
        user_password: hashedPassword
      }
    );
    User.findOne({ 'user_email': req.body.email })
      .exec(function(err, found_email) {
        if (err) { return next(err); }
        if (found_email) {
          res.render('register', { error_message: 'User with email ' + found_email.user_email + ' already exists.' });
        } else {
          user.save(function(err) {
            if (err) { return next(err); }
            res.redirect('/login');
          });
        }
      });
  } catch (e) {
    res.redirect('/register');
  }
}

exports.logout = (req, res) => {
  req.logOut();
  res.redirect('/login');
}
