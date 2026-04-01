const { Router } = require("express");
const dashboardRouter = Router();
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getAllUserData, getAllNotes, getAllReferrals } = require('../controllers/viewController');
const { clientController } = require('../controllers/routeController/clientController');
require('../config/passport');

dashboardRouter.get('/', async (req, res, next ) => {

  Promise.all([
    getAllUserData(req, res, next), // includes users referrals and personal notes
    clientController.getClients(req, res, next),
    getAllReferrals(req, res, next), // includes all referrals in db, will filter on client side for dashboard display, limit in future?
    getAllNotes(req, res, next) // includes all notes in db, will filter on client side for dashboard display, limit in future?
  ])
  .then(([user, clients, referrals, notes]) => {
    res.json({ message: "Dashboard route is working", user, 
      globalData: { clients, referrals, notes } });
  })
  .catch(error => {
    console.log('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  });
  // req.user from passport callback authentication
});




module.exports = {dashboardRouter}