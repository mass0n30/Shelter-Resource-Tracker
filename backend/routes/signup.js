const { Router } = require("express");
const { handleCreateUser } = require("../controllers/dataController/createController");
const { validateCreateUser } = require("../controllers/validation");
const { sign } = require("jsonwebtoken");

const signupRouter = Router();

signupRouter.post("/", (req, res) => {
    handleCreateUser(req, res);
});

//signupRouter.post("/", validateCreateUser(), handleCreateUser);



module.exports = {signupRouter};