const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

// Use these to prevent duplicate records (user/emails on signup in future)

async function checkEmail(value) {

  const user = await prisma.user.findUnique({
    where: {
      email: value,
    },
  });

  if (user) {
    return true;
  } else {
    return false;
  }
};

async function checkUser(id) {
  
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (user) {
    return user;
  } else {
    throw new Error("No found user.");
  }
};

async function checkUserByEmail(value) {

  const user = await prisma.user.findUnique({
    where: {
      email: value,
    },
  });

  if (user) {
    return user;
  } else {
    throw new Error("No found user.");
  }
};

async function checkClientCSV(first, last) {

  const client = await prisma.client.findFirst({
    where: {
      firstName: first,
      lastName: last,
    },
  });
  // console.log(client);

  if (client) {
    return client;
  }
  return null;
}

module.exports = {
  checkEmail,
  checkUser,
  checkUserByEmail,
  checkClientCSV
}