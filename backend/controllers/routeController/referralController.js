const { prisma } = require("../../db/prismaClient.js");

async function createReferral(req, res, next) {
  try {
    const newReferral = await prisma.referral.create({
      data: {
        clientId: parseInt(req.params.clientId),
        createdById: req.user.id,
        organizationName: req.body.organizationName,
        resourceType: req.body.resourceType,
        purpose: req.body.purpose,
        status: req.body.status,
        followUpDate: req.body.followUpDate
          ? new Date(req.body.followUpDate)
          : null,
        roiSigned: req.body.roiSigned ?? false,
        isPriority: req.body.isPriority ?? false,
        summary: req.body.summary,
      },
    });

    return res.status(201).json({
      message: "Referral Created Successfully",
      referral: newReferral,
    });
  } catch (error) {
    console.log("failed to create referral", error);
    return res.status(400).json({ errors: error });
  }
}

async function updateReferral(req, res, next) {
  try {
    const updatedReferral = await prisma.referral.update({
      where: {
        id: parseInt(req.params.referralId),
      },
      data: {
        organizationName: req.body.organizationName,
        resourceType: req.body.resourceType,
        purpose: req.body.purpose,
        status: req.body.status,
        followUpDate: req.body.followUpDate
          ? new Date(req.body.followUpDate)
          : null,
        roiSigned: req.body.roiSigned ?? false,
        isPriority: req.body.isPriority ?? false,
        summary: req.body.summary,
      },
    });

    return res.status(200).json({
      message: "Referral Updated Successfully",
      referral: updatedReferral,
    });
  } catch (error) {
    console.log("failed to update referral", error);
    return res.status(400).json({ errors: error });
  }
}

async function updateReferralStatus(req, res, next) {
  try {
    const updatedReferral = await prisma.referral.update({
      where: { id: parseInt(req.params.referralId) },
      data: {
        status: req.body.status,
      },
    });
    return res.status(200).json(updatedReferral, { message: "Referral Status Updated Successfully" });
  } catch (error) {
    console.log('failed to update referral status');
    return res.status(400).json({ errors:error });
  }
};

async function closeReferral(req, res, next) {
  try {
    const updatedReferral = await prisma.referral.update({
      where: { id: parseInt(req.params.referralId) },
      data: {
        status: "CLOSED",
      },
    });
    return res.status(200).json(updatedReferral, { message: "Referral Closed Successfully" });
  } catch (error) {
    console.log('failed to close referral');
    return res.status(400).json({ errors:error });
  }
};

async function deleteReferral(req, res, next) {
  try {
    await prisma.referral.delete({
      where: { id: parseInt(req.params.referralId) },
    });
    console.log('deleted referral with id:', req.params.referralId);
    return res.status(200).json({ message: "Referral Deleted Successfully" });
  } catch (error) {
    console.log('failed to delete referral');
    return res.status(400).json({ errors:error });
  }
};

async function completeReferral(req, res, next) {
  try {
    const updatedReferral = await prisma.referral.update({
      where: { id: parseInt(req.params.referralId) },
      data: {
        status: "COMPLETED",
      },
    });
    return res.status(200).json(updatedReferral, { message: "Referral Completed Successfully" });
  } catch (error) {
    console.log('failed to complete referral');
    return res.status(400).json({ errors:error });
  }
};

module.exports = { 
  referralController: {
    createReferral, updateReferral, updateReferralStatus, deleteReferral, closeReferral, completeReferral
  }
}