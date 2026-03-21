// viewController
const { prisma } = require("../db/prismaClient.js");

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

module.exports = { handleGetClientReferrals, handleGetClientNotes }