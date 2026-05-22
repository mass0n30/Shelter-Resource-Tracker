

const fs = require('fs');
const csv = require('csv-parser');
const { checkClientCSV } = require("../db/queries.js");
const { prisma } = require("../db/prismaClient");

async function handleCSVUpload(stream) {
  return new Promise((resolve, reject) => {

    const tasks = [];
    const updateDate = new Date();

    stream
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const firstName = row["1"]?.trim();
        const lastName = row["2"]?.trim();

        if (!firstName || !lastName) return;
        if (firstName === "Guest/Client  Name(First)") return;

        const task = checkClientCSV(firstName, lastName)
          .then((client) => ({
            found: !!client,
            client,
            firstName,
            lastName,
          }))
          .catch((error) => {
            console.error("Error checking client:", error);

            return {
              found: false,
              client: null,
              firstName,
              lastName,
            };
          });

        tasks.push(task);
      })
      .on("end", async () => {
        try {
          const results = await Promise.all(tasks);

          const found = results
            .filter((r) => r.found)
            .map((r) => r.client);

          const unfound = results
            .filter((r) => !r.found)
            .map((r) => ({
              firstName: r.firstName,
              lastName: r.lastName,
            }));


          if (unfound.length > 0) {
            await prisma.notification.create({
              data: {
                type: "UNMATCHED_CLIENTS",
                message: `${unfound.length} clients not found`,
                data: unfound, // if using JSON column
              }
            });
          }

          if (found.length > 0) {
            await prisma.notification.create({
              data: {
                type: "MATCHED_CLIENTS",
                message: `${found.length} clients matched successfully`,
                data: found.map(client => ({ id: client.id, firstName: client.firstName, lastName: client.lastName })), // if using JSON column
              }
            });
          }
          resolve({ found, unfound, updateDate });

        } catch (error) {
          reject(error);
        }
      })
      .on("error", reject);
  });
}

function handleAutoCSVUpload(stream) {
  return new Promise((resolve, reject) => {
    const tasks = [];
    const updateDate = new Date();

    stream
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        const firstName = row['1']?.trim();
        const lastName = row['2']?.trim();

        if (!firstName || !lastName) return;
        if (firstName === 'Guest/Client  Name(First)') return;

        const task = checkClientCSV(firstName, lastName)
          .then((client) => ({
            found: !!client,
            client,
            firstName,
            lastName,
          }))
          .catch(() => ({
            found: false,
            client: null,
            firstName,
            lastName,
          }));

        tasks.push(task);
      })
      .on('end', async () => {
        const results = await Promise.all(tasks);

        const found = results
          .filter(r => r.found)
          .map(r => r.client);

        const unfound = results
          .filter(r => !r.found)
          .map(r => ({
            firstName: r.firstName,
            lastName: r.lastName
          }));
        
          

        resolve({ found, unfound, updateDate });
      })
      .on('error', reject);
  });
}

module.exports = { handleCSVUpload, handleAutoCSVUpload };
