// create controller 
const { prisma } = require("../../db/prismaClient.js");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");


async function handleCreateUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const user = await prisma.user.create({
      data: {
        email: req.body.username,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        password: hashedPassword,
        role: req.body?.role || "MANAGER" 
      }
   });

   console.log("USER DATA:", user);
   console.log('Body', req.body);

  return res.status(201).json({ message: "Account Created Successfully" });
  } catch (error) {
    console.log('failed to create user');
    return res.status(400).json({
      name: error.name,
      message: error.message,
    });
  }
};

module.exports = { handleCreateUser };