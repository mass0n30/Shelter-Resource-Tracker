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
        password: hashedPassword,
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

async function resetUserPassword(req, res) {
  try {
    const userId = Number(req.params.userId);
    const { temporaryPassword } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Valid user ID is required." });
    }

    if (!temporaryPassword || temporaryPassword.length < 8) {
      return res.status(400).json({
        message: "Temporary password must be at least 8 characters.",
      });
    }

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
      },
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        role: true,
        mustChangePassword: true,
      },
    });

    return res.json({
      message: "Password reset successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

async function changeOwnPassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    return res.json({
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = {handleUpdateUser, handleUpdateAvatar, resetUserPassword, changeOwnPassword};