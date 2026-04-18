const Router = require("express");
const clientRouter = Router();
const passport = require("passport");
const controller = require('../controllers/routeController/clientController');

clientRouter.get('/', controller.clientController.getClients);

clientRouter.post('/', controller.clientController.createClient);

clientRouter.get('/:clientId', controller.clientController.getClientById);

clientRouter.put('/:clientId',controller.clientController.updateClient);

clientRouter.delete('/:clientId', controller.clientController.deleteClient);

module.exports = { clientRouter };