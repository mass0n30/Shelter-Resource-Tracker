// delete controller 
const { prisma } = require("../../db/prismaClient.js");
const { validationResult } = require("express-validator");

async function handleDeleteUser(req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.userId) }
   });
  return res.status(200).json({ message: "Account Deleted Successfully" });
  } catch (error) {
    console.log('failed to delete user');
    return res.status(400).json({ errors:error });
  }
};


module.exports = { handleDeleteUser }
