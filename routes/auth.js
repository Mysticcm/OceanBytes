var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var userService = require("../services/user.service");
var express = require('express');
var router = express.Router();

passport.use(new LocalStrategy(
  { usernameField: 'email'},
  async function verify(email, password, cb) {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return cb(null, false, { message: "Incorrect email." });
    }

    // Convert stored base64 strings back to Buffers
    const saltBuffer = Buffer.from(user.salt, "base64");
    const storedPasswordBuffer = Buffer.from(user.password, "base64");

    crypto.pbkdf2(password, saltBuffer, 310000, 32, "sha256", (err, hashedPassword) => {
      if (err) return cb(err);

      // Compare hashed password with stored hash
      if (!crypto.timingSafeEqual(storedPasswordBuffer, hashedPassword)) {
        return cb(null, false, { message: "Incorrect email or password." });
      }

      return cb(null, user);
    });
  } catch (err) {
    cb(err);
  }
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { username: user.username, id: user._id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});


router.get('/login', function (req, res, next) {
  try {
    return res.render('login', { title: 'Login - Ocean Bytes', username: req.user?.username || null });
  } catch (err) {
    next(err);
  }
});

router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));

router.post('/logout', function (req, res, next) {
  try {
    req.logout(function (err) {
      if (err) return next(err);
      return res.redirect('/login');
    });
  } catch (err) {
    next(err);
  }
});

router.get('/signup', function (req, res, next) {
  try {
    return res.render('signup', { title: 'Sign up - OceanBytes', username: req.user?.username || null, role: req.user?.role || 'user' });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', function (req, res, next) {
  try {
    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) return next(err);

      // Convert to base64 strings before saving
      const saltString = salt.toString("base64");
      const hashString = hashedPassword.toString("base64");

      userService.createUser(req.body.username, req.body.email, saltString, hashString);

      return res.redirect('/login');
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
