const { Router } = require("express");
const homeRouter = Router();
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getData } = require('../controllers/viewController');
require('../config/passport');

homeRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next ) => {

//  const data = await getAllUserData(req, res, next);

  // req.user from passport callback authentication
  res.json({
    user: {
      alias: req.user.alias,
      first: req.user.fname,
      last: req.user.lname,
      admin: req.user.is_admin
    },
   // data: orderedData
  });
});




module.exports = {homeRouter}