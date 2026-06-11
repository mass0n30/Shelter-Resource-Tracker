const Router = require("express");
const clientRouter = Router();
const passport = require("passport");
const controller = require('../controllers/routeController/clientController');

clientRouter.get('/', controller.clientController.getClients);

clientRouter.post('/', controller.clientController.createClient);

clientRouter.get('/:clientId', controller.clientController.getClientById);

clientRouter.patch('/:clientId',controller.clientController.updateClient);

clientRouter.patch('/:clientId/additional', controller.clientController.updateClientAdditional);

clientRouter.delete('/:clientId', controller.clientController.deleteClient);

module.exports = { clientRouter };