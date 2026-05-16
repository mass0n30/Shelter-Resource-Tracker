const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { prisma } = require("../db/prismaClient");

async function handleSignInWithGoogle(req, res) {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          firstName: payload.given_name || "",
          lastName: payload.family_name || "",
          avatar: payload.picture || null,
          googleId: payload.sub,
          authProvider: "GOOGLE",
        },
      });
    }

    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: payload.sub,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google login failed" });
  }
};

module.exports = { handleSignInWithGoogle };