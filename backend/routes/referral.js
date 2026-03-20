const { Router } = require("express");
const referralController = require("../controllers/referralController");

const referralRouter = Router();

referralRouter.post("/client/:clientId", referralController.createReferral);

// update whole referral?
referralRouter.put("/:referralId", referralController.updateReferral);

// update specific fields for referral?
referralRouter.patch("/:referralId/status", referralController.updateReferralStatus);
referralRouter.patch("/:referralId/follow-up", referralController.updateFollowUp);
referralRouter.patch("/:referralId/priority", referralController.setPriorityReferral);
referralRouter.patch("/:referralId/close", referralController.closeReferral);

module.exports = { referralRouter };