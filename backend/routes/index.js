const { Router } = require("express");

const indexRouter = Router();

const {authenticateUser} = require('../config/passport');
const {validateUser} = require('../controllers/validation');

indexRouter.post("/", validateUser(), authenticateUser);

module.exports = {indexRouter};

