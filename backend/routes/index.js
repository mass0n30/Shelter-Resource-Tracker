const { Router } = require("express");

const indexRouter = Router();

const {authenticateUser} = require('../config/passport');
const {validateUser} = require('../controllers/validation');
const { resetUserPassword, changeOwnPassword } = require("../controllers/dataController/updateController");
const passport = require("passport");

indexRouter.post("/", validateUser(), authenticateUser);

indexRouter.patch("/:userId/reset-password", 
passport.authenticate("jwt", { session: false }),
resetUserPassword
);

indexRouter.patch("/change-password",
passport.authenticate("jwt", { session: false }),
changeOwnPassword
);


module.exports = {indexRouter};

