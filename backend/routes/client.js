const Router = require("express");
const clientRouter = Router();
const passport = require("passport");
const controller = require('../controllers/routeController/clientController');

clientRouter.get('/', passport.authenticate('jwt', { session: false }), controller.clientController.getClients);

clientRouter.post('/', controller.clientController.createClient);

clientRouter.put('/:clientId', passport.authenticate('jwt', { session: false }), controller.clientController.updateClient);

clientRouter.delete('/:clientId', passport.authenticate('jwt', { session: false }), controller.clientController.deleteClient);

module.exports = { clientRouter };