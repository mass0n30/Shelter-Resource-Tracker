// viewController
const { prisma } = require("../db/prismaClient.js");

async function getAllUserData(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        notes: {
          include: {
            client: true
          },
          orderBy: { createdAt: 'desc' },
        },
        referrals: {
          include: {
            client: true
          },
          orderBy: { createdAt: 'desc' },
        },
        // profile: true
      },
    })
    return user;
  } catch (error) {
    console.log('failed to get user data');
    throw error;
  }
};

async function getUpdateData(req, res, next) {
  try {
    const updateData = await prisma.updateData.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    return updateData;
  } catch (error) {
    console.log('failed to get update data');
    throw error;
  }
};

async function getAllReferrals(req, res, next) {
  try {
    const referrals = await prisma.referral.findMany();
    return referrals;
  } catch (error) {
    console.log('failed to get user referrals');
    throw error;
  };
}

async function getAllNotes(req, res, next) {
  try {
    const notes = await prisma.note.findMany({
      include: {
        client: true,
      }, 
      orderBy: { createdAt: 'desc' },
    });
    return notes;
  } catch (error) {
    console.log('failed to get user notes');
    throw error;
  }
}

async function handleGetClientReferrals(req, res, next) {
  try {
    const referrals = await prisma.referral.findMany({
      where: { client_id: parseInt(req.params.clientId) },
    });
    return referrals;
  } catch (error) {
    console.log('failed to get referrals');
    throw error;
  }
};

async function handleGetClientNotes(req, res, next) {
  try {
    const notes = await prisma.note.findMany({
      where: { client_id: parseInt(req.params.clientId) },
    });
    return notes;
  } catch (error) {
    throw error;
  }
};

module.exports = { handleGetClientReferrals, handleGetClientNotes, getAllNotes, getUpdateData, getAllReferrals, getAllUserData }