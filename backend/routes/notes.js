const { Router } = require("express");
const noteController = require("../controllers/noteController");

const noteRouter = Router();

noteRouter.get("/client/:clientId", noteController.getClientNotes);

noteRouter.post("/client/:clientId", noteController.createNote);

noteRouter.put("/:noteId", noteController.updateNote);
noteRouter.delete("/:noteId", noteController.deleteNote);

module.exports = { noteRouter };