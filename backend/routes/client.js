const Router = require("express");
const clientRouter = Router();
const passport = require("passport");
const clientController = require('../controllers/clientController');

clientRouter.get('/', passport.authenticate('jwt', { session: false }), clientController.getClients);

clientRouter.post('/', passport.authenticate('jwt', { session: false }), clientController.createClient);

clientRouter.put('/:id', passport.authenticate('jwt', { session: false }), clientController.updateClient);

clientRouter.delete('/:id', passport.authenticate('jwt', { session: false }), clientController.deleteClient);

module.exports = { clientRouter };