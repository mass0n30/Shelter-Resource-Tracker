const { Router } = require("express");
const dashboardRouter = Router();
const { prisma } = require("../db/prismaClient.js");
var jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const passport = require('passport');
const { getAllUserData, getUpdateData, getAllNotes, getAllReferrals } = require('../controllers/viewController');
const { clientController } = require('../controllers/routeController/clientController');
require('../config/passport');

dashboardRouter.get('/', async (req, res, next ) => {

  console.log('Dashboard route hit, fetching data...');

  Promise.all([
    getAllUserData(req, res, next), // includes users referrals and personal notes
    getUpdateData(req, res, next), // includes update data for dashboard news feed
    clientController.getClients(req, res, next),
    getAllReferrals(req, res, next), // includes all referrals in db, will filter on client side for dashboard display, limit in future?
    getAllNotes(req, res, next) // includes all notes in db, will filter on client side for dashboard display, limit in future?
  ])
  .then(([user, updateData, clients, referrals, notes]) => {
    res.json({ message: "Dashboard route is working", user, updateData,
      globalData: { clients, referrals, notes } });
  })
  .catch(error => {
    console.log('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  });
  // req.user from passport callback authentication
});

dashboardRouter.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

dashboardRouter.post('/notifications/mark-read', async (req, res) => {

  await prisma.notification.updateMany({
    where: {
      read: false,
    },
    data: {
      read: true,
    },
  });

  res.json({ success: true });
});

dashboardRouter.post('/notes/mark-read', async (req, res) => {

  await prisma.note.updateMany({
    where: {
      read: false,
    },
    data: {
      read: true,
    },
  });

  res.json({ success: true });
});

dashboardRouter.post('/notes/:noteId/complete', async (req, res) => {
  const noteId = parseInt(req.params.noteId);

  try {
    await prisma.note.update({
      where: { id: noteId },
      data: { completed: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking note as complete:', error);
    res.status(500).json({ error: 'Failed to mark note as complete' });
  }
});

module.exports = {dashboardRouter}