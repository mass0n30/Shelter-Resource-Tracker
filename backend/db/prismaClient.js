// initiates Prisma client
// conditional for testing or production database usage from scripts in package.json

const { PrismaClient } = require('@prisma/client');


const databaseUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL;

console.log("DB URL:", databaseUrl);


const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = {prisma};
