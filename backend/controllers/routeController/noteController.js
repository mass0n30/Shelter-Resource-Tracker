const { prisma } = require("../../db/prismaClient.js");

async function getClientNotes(req, res, next) {
  try {
    const clientId = Number(req.params.clientId);

    const notes = await prisma.note.findMany({
      where: {
        clientId,
        OR: [
          { visibility: "public" },
          {
            visibility: "private",
            authorId: req.user.id,
          },
        ],
      },
      include: {
        client: true,
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notes;
  } catch (err) {
    next(err);
  }
}
async function createNote(req, res, next) {
  try {
    await prisma.note.create({
      data: {
        authorId: req.user.id,
        clientId: parseInt(req.body.clientId),
        setReminder: req.body.setReminder,
        reminderAt: req.body.reminderAt ? new Date(req.body.reminderAt) : null,
        visibility: req.body.visibility === 'private' ? 'private' : 'public',
        content: req.body.content,
        title: req.body.title,
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
        content: req.body.content,
        title: req.body.title,
        setReminder: req.body.setReminder,
        reminderAt: req.body.reminderAt ? new Date(req.body.reminderAt) : null,
        visibility: req.body.visibility === 'private' ? 'private' : 'public'
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

async function completeNote(req, res, next) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.noteId) },
    });

    const updatedNote = await prisma.note.update({
      where: { id: parseInt(req.params.noteId) },
      data: {
        completed: !note.completed,
      },
    });
    return res.json(updatedNote);

  } catch (err) {
    next(err);
  }
}

async function updateNoteVisibility(req, res, next) {
  try {
    const visibilityStatus = req.body.visibility === 'private' ? 'private' : 'public';
    await prisma.note.update({
      where: { id: parseInt(req.params.noteId) },
      data: {
        visibility: visibilityStatus
      }
   });
  return res.status(200).json({ message: "Note Visibility Updated" });
  } catch (error) {
    console.log('failed to update note visibility');
    return res.status(400).json({ errors:error });
  }
};

module.exports = { 
  noteController: {
    getClientNotes, createNote, deleteNote, updateNote, completeNote, updateNoteVisibility
  }
};