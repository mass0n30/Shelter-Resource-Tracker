const { prisma } = require("../../db/prismaClient.js");

async function createReferral(req, res, next) {
  try {
    const newReferral = await prisma.referral.create({
      data: {
        clientId: parseInt(req.params.clientId),
        createdById: 1, // req.user.id, 
        organizationName: req.body.organizationName,
        resourceType: req.body.resourceType,
        purpose: req.body.purpose,
        status: req.body.status,
        followUpDate: new Date(req.body.followUpDate),
        isPriority: req.body.priority,
        summary: req.body.summary,
        
      },
    });
  } catch (error) {
    console.log('failed to create referral', error);
    return res.status(400).json({ errors:error });
  }
};

async function updateReferral(req, res, next) {
  try {
    const updatedReferral = await prisma.referral.update({
      where: { id: parseInt(req.params.referralId) },
      data: { 
        clientId: parseInt(req.params.clientId),
        createdById: req.user.id,
        // if resource model, org name and resource type a selection made client side from drop down or resources in db ?
        organizationName: req.body.organizationName,
        resourceType: req.body.resourceType,

        purpose: req.body.purpose,
        status: req.body.status,
        followUpDate: new Date(req.body.followUpDate),
        priority: req.body.priority,
        summary: req.body.summary,
      },
    });
    return res.status(200).json(updatedReferral);
  } catch (error) {
    console.log('failed to update referral');
    return res.status(400).json({ errors:error });
  }
};

async function deleteReferral(req, res, next) {
  try {
    await prisma.referral.delete({
      where: { id: parseInt(req.params.referralId) },
    });
    return res.status(200).json({ message: "Referral Deleted Successfully" });
  } catch (error) {
    console.log('failed to delete referral');
    return res.status(400).json({ errors:error });
  }
};

module.exports = { 
  referralController: {
    createReferral, updateReferral, deleteReferral
  }
}