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

async function handleUpdateAvatar(req, res, next, url) {
  try {
    const userId = Number(req.user.id);
    await prisma.profile.update({
      where: { userId: userId },
      data: { avatarUrl: url }
    });

    const updatedProfile = await getUserData(req, res, next);

    return updatedProfile;
  } catch (err) {
    return next(err);
  }
};

const fs = require('fs');
const csv = require('csv-parser');
const { checkClientCSV } = require("../../db/queries.js");

async function handleCSVUpload(req, res, next) {
  try {
    console.log('Received file:', req.file);

    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      // for each row, check if client exists in db, if so push to results array, if not skip
      .on('data', (row) => {
        const firstName = row['1']?.trim();
        const lastName = row['2']?.trim();

        // Skip junk rows
        if (!firstName || !lastName || firstName === '' || lastName === '') return;

        if (firstName === 'Guest/Client  Name(First)') return;

        // Not using await here — streams do not wait for async operations
        // Instead, store the Promise and resolve all later, pushing into array on line 81
        const client = checkClientCSV(firstName, lastName)

        .catch((error) => {
          console.error('Error inserting row:', error);
        });

        if (client) {
          results.push(client);
        }
      })
      .on('end', async () => {
        const promiseResult = await Promise.all(results);
        res.json({ message: 'File uploaded successfully', clients: promiseResult });
      });

  } catch (error) {
    console.log('failed to upload file', error);
    return res.status(400).json({ errors: error });
  }
}




module.exports = {handleUpdateUser, handleUpdateAvatar, handleCSVUpload};