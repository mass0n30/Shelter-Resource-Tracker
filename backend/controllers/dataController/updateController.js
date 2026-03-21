// update controller 
const { prisma } = require("../../db/prismaClient.js");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

async function handleUpdateUser(req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    await prisma.user.update({
      where: { id: parseInt(req.params.userId) },
      data: {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // reset password email authentication ?
      }
   });
  return res.status(200).json({ message: "Account Updated Successfully" });
  } catch (error) {
    console.log('failed to update user');
    return res.status(400).json({ errors:error });
  }
};



module.exports = {handleUpdateUser};