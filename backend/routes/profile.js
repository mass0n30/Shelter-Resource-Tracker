const {Router} = require('express');

const profileRouter = Router();

const {handleUpdateUser, handleUpdateAvatar} = require('../controllers/dataController/updateController');

profileRouter.put("/update/:userId", handleUpdateUser);

profileRouter.put("/avatar", async (req, res, next) => {
  const { url } = req.body;
  try {
    const updatedProfile = await handleUpdateAvatar(req, res, next, url);
    return res.status(200).json(updatedProfile);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = {profileRouter};