const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./pool");

const { prisma } = require('../db/prismaClient.js');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
},
async function(username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      //comparing login password to hashed stored password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
// include token in bearer schema on client side for protected routes
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretkey';
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);


const { validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ error: "Wrong email or password!" });
    }

    jwt.sign({ id: user.id, username: user.username }, "secretkey", { expiresIn: "2d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Something went wrong" });
      }
  
      return res.json({
        token,
      });
    });
  })(req, res, next);
};

module.exports = { authenticateUser };