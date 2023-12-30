import express from "express"
import passport from "passport"
import LocalStrategy from "passport-local"
import crypto from "crypto"
import db from "../db.js"

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
      if (err) { return cb(err) }
      if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }) }
  
      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err) }
        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' })
        }
        return cb(null, row)
      })
    })
  }))

const router = express.Router()

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

router.get("/login", (req, res) => {
    res.render("login")
})

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

export default router