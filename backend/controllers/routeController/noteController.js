const { prisma } = require("../../db/prismaClient.js");

async function getClientNotes(req, res, next) {
  try {
    const notes = await prisma.note.findMany({
      where: { clientId: parseInt(req.params.clientId) },
    });
    return res.status(200).json(notes);
  } catch (error) {
    console.log('failed to get notes');
    return res.status(400).json({ errors:error });
  }
};

async function createNote(req, res, next) {
  try {
    await prisma.note.create({
      data: {
        authorId: req.user.id,
        clientId: parseInt(req.body.clientId),
        setReminder: req.body.setReminder,
        reminderAt: req.body.reminderAt ? new Date(req.body.reminderAt) : null,
        content: req.body.content,
        createdAt: new Date(),
      }
   });
  return res.status(201).json({ message: "Note Created Successfully" });
  } catch (error) {
    console.log('failed to create note');
    return res.status(400).json({ errors:error });
  }
};

async function updateNote(req, res, next) {
  try {
    await prisma.note.update({
      where: { id: parseInt(req.params.noteId) },
      data: {
        content: req.body.content
      }
   });
  return res.status(200).json({ message: "Note Updated Successfully" });
  } catch (error) {
    console.log('failed to update note');
    return res.status(400).json({ errors:error });
  }
};

async function deleteNote(req, res, next) {
  try {
    await prisma.note.delete({
      where: { id: parseInt(req.params.noteId) }
   });
    return res.status(200).json({ message: "Note Deleted Successfully" });
  } catch (error) {
    console.log('failed to delete note');
    return res.status(400).json({ errors:error });
  }
};

module.exports = { 
  noteController: {
    getClientNotes, createNote, deleteNote, updateNote
  }
};