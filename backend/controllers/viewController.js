// viewController
const { prisma } = require("../db/prismaClient.js");

async function getAllUserData(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        notes: true,
        referrals: true,
        // profile: true
      },
    })
    return user;
  } catch (error) {
    console.log('failed to get user data');
    return res.status(400).json({ errors:error });
  }
};

async function getAllReferrals(req, res, next) {
  try {
    const referrals = await prisma.referral.findMany();
    return referrals;
  } catch (error) {
    console.log('failed to get user referrals');
    return res.status(400).json({ errors:error });
  };
}

async function getAllNotes(req, res, next) {
  try {
    const notes = await prisma.note.findMany();
    return notes;
  } catch (error) {
    console.log('failed to get user notes');
    return res.status(400).json({ errors:error });
  }
}

async function handleGetClientReferrals(req, res, next) {
  try {
    const referrals = await prisma.referral.findMany({
      where: { client_id: parseInt(req.params.clientId) },
    });
    return res.status(200).json(referrals);
  } catch (error) {
    console.log('failed to get referrals');
    return res.status(400).json({ errors:error });
  }
};

async function handleGetClientNotes(req, res, next) {
  try {
    const notes = await prisma.note.findMany({
      where: { client_id: parseInt(req.params.clientId) },
    });
    return res.status(200).json(notes);
  } catch (error) {
    console.log('failed to get notes');
    return res.status(400).json({ errors:error });
  }
};

module.exports = { handleGetClientReferrals, handleGetClientNotes, getAllNotes, getAllReferrals, getAllUserData }