const { Router } = require("express");
const dashboardRouter = Router();
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getData } = require('../controllers/viewController');
require('../config/passport');

dashboardRouter.get('/', async (req, res, next ) => {

//  const data = await getAllUserData(req, res, next);

  // req.user from passport callback authentication
  
  res.json({ message: "Dashboard route is working" });
});




module.exports = {dashboardRouter}