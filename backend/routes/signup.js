const { Router } = require("express");
const { handleCreateUser } = require("../controllers/dataController/createController");
const { validateCreateUser } = require("../controllers/validation");

const signupRouter = Router();

signupRouter.post("/", validateCreateUser(), handleCreateUser);



module.exports = {signupRouter}