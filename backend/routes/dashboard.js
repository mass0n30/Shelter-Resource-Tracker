const { Router } = require("express");
const dashboardRouter = Router();
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getAllUserData } = require('../controllers/viewController');
require('../config/passport');

dashboardRouter.get('/', async (req, res, next ) => {

  const user = await getAllUserData(req, res, next);

  // req.user from passport callback authentication

  res.json({ message: "Dashboard route is working", user });
});




module.exports = {dashboardRouter}