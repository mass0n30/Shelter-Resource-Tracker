const { Router } = require("express");
const controller = require("../controllers/routeController/noteController");

const noteRouter = Router();

noteRouter.post("/", controller.noteController.createNote);

noteRouter.get("/client/:clientId", controller.noteController.getClientNotes);


noteRouter.patch("/:noteId", controller.noteController.updateNote);
noteRouter.post("/:noteId/complete", controller.noteController.completeNote);
noteRouter.post("/:noteId/visibility", controller.noteController.updateNoteVisibility);
noteRouter.post("/:noteId/delete", controller.noteController.deleteNote);


module.exports = { noteRouter };