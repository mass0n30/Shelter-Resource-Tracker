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

  Promise.all([
    getAllUserData(req, res, next), // includes users referrals and personal notes
    getUpdateData(req, res, next), // includes update data for dashboard news feed
    clientController.getClients(req, res, next),
    clientController.getClientStats(req, res, next), // includes client stats for dashboard display, consider combining with getClients query in future to reduce number of calls to db on dashboard mount, or consider caching some of this data if performance becomes an issue
    getAllReferrals(req, res, next), // includes all referrals in db, will filter on client side for dashboard display, limit in future?
    getAllNotes(req, res, next) // includes all notes in db, will filter on client side for dashboard display, limit in future?
  ])
  .then(([user, updateData, clients, clientStats, referrals, notes]) => {
    res.json({ user, clientStats, updateData,
      globalData: { clients, referrals, notes } });
  })
  .catch(error => {
    console.log('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  });
  // req.user from passport callback authentication
});

dashboardRouter.get('/dashStatFilters', clientController.getClientsByStatFilter);

dashboardRouter.get('/notifications', async (req, res, next) => {
  try {
    const unfoundClients = await prisma.notification.findMany({
      where: { read: false , type: "UNMATCHED_CLIENTS"},
      orderBy: { createdAt: 'desc' },
      take: 1 // only fetch most recent unread notification for dashboard alert, consider fetching more for notifications center page if implemented in future
    });

    const foundClients = await prisma.notification.findMany({
      where: { read: false , type: "MATCHED_CLIENTS"},
      orderBy: { createdAt: 'desc' },
      take: 1 // only fetch most recent unread notification for dashboard alert, consider fetching more for notifications center page if implemented in future
    });
    res.json({ unfoundClients, foundClients });
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

dashboardRouter.post("/notes/:noteId/visibility", async (req, res) => {
  const noteId = Number(req.params.noteId);
  const { visibility } = req.body;

  if (!noteId) {
    return res.status(400).json({ error: "Invalid note id" });
  }

  try {
    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        visibility,
      },
    });

    res.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("Error updating note visibility:", error);
    res.status(500).json({ error: "Failed to update note visibility" });
  }
});


module.exports = {dashboardRouter}