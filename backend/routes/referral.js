const { Router } = require("express");
const controller = require("../controllers/routeController/referralController");

const referralRouter = Router();

referralRouter.post("/client/:clientId", controller.referralController.createReferral);

// update whole referral?
referralRouter.put("/:referralId", controller.referralController.updateReferral);

// not sure I even need these, keeping just in case
// update specific fields for referral?
//referralRouter.patch("/:referralId/status", controller.referralController.updateReferralStatus);
//referralRouter.patch("/:referralId/follow-up", controller.referralController.updateFollowUp);
//referralRouter.patch("/:referralId/priority", controller.referralController.setPriorityReferral);
//referralRouter.patch("/:referralId/close", controller.referralController.closeReferral);

module.exports = { referralRouter };