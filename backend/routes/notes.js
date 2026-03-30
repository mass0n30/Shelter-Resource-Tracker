const { Router } = require("express");
const controller = require("../controllers/routeController/noteController");

const noteRouter = Router();

noteRouter.post("/", controller.noteController.createNote);

noteRouter.get("/client/:clientId", controller.noteController.getClientNotes);


noteRouter.put("/:noteId", controller.noteController.updateNote);
noteRouter.delete("/:noteId", controller.noteController.deleteNote);

module.exports = { noteRouter };