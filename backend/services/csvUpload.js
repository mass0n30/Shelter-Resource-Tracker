

const fs = require('fs');
const csv = require('csv-parser');
const { checkClientCSV } = require("../db/queries.js");
const { prisma } = require("../db/prismaClient");

// customly made for Brighter Days shelter, hopefully can be made as dependency injection in future

async function handleCSVUpload(stream) {
  return new Promise((resolve, reject) => {
    const tasks = [];
    const updateDate = new Date();
    let matchedFormat = false;

    stream
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        const firstName = String(row["1"] || "").trim();
        const lastName = String(row["2"] || "").trim();

        if (!firstName || !lastName) return;

        if (firstName.toLowerCase().includes("guest/client")) {
          matchedFormat = true;
          return;
        }

        matchedFormat = true;

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
          if (!matchedFormat) {
            resolve(null);
            return;
          }

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
                data: unfound,
              },
            });
          }

          if (found.length > 0) {
            await prisma.notification.create({
              data: {
                type: "MATCHED_CLIENTS",
                message: `${found.length} clients matched successfully`,
                data: found.map((client) => ({
                  id: client.id,
                  firstName: client.firstName,
                  lastName: client.lastName,
                })),
              },
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

function splitFullName(name) {
  const parts = name.trim().split(/\s+/);

  if (parts.length < 2) return null;

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}


function handleTotalClientCSVUpload(stream) {
  return new Promise((resolve, reject) => {
    const tasks = [];
    const updateDate = new Date();
    let stayedSection = false;
    let matchedFormat = false;
    let stoppedReading = false;

    stream
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        if (stoppedReading) return;

        const colOne = String(row["0"] || "").trim();
        const colTwo = String(row["1"] || "").trim();

        const rowText = `${colOne} ${colTwo}`.toLowerCase();

        if (
          rowText.includes("clients that stayed last night") ||
          rowText.includes("stayed last night")
        ) {
          stayedSection = true;
          matchedFormat = true;
          return;
        }

        if (
          // checking in various ways in case of header change (a bit fragile)
          rowText.includes("clients that weren't here last night") ||
          rowText.includes("weren't here last night") ||
          rowText.includes("not here last night") ||
          rowText.includes("didn't stay last night")
        ) {
          stayedSection = false;
          stoppedReading = true;
          return;
        }

        if (!stayedSection) return;

        [colOne, colTwo].forEach((value) => {
          if (!value) return;
          if (!isNaN(value)) return;

          const name = splitFullName(value);
          if (!name) return;

          const task = checkClientCSV(name.firstName, name.lastName)
            .then((client) => ({
              found: !!client,
              client,
              firstName: name.firstName,
              lastName: name.lastName,
            }))
            .catch(() => ({
              found: false,
              client: null,
              firstName: name.firstName,
              lastName: name.lastName,
            }));

          tasks.push(task);
        });
      })
      .on("end", async () => {
        if (!matchedFormat) {
          resolve(null);
          return;
        }

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

        resolve({ found, unfound, updateDate });
      })
      .on("error", reject);
  });
}

module.exports = { handleCSVUpload, handleTotalClientCSVUpload };
