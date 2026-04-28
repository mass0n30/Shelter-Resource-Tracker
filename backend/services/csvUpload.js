

const fs = require('fs');
const csv = require('csv-parser');
const { checkClientCSV } = require("../db/queries.js");

// converts attached file in file path to handle 
async function handleCSVUpload(filePath) {
  return new Promise((resolve, reject) => {
    console.log('Received file:', filePath);

    const results = [];
    const unfoundClients = [];

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
        } else {
          unfoundClients.push({ firstName, lastName });
        }
      })
      // on end event callback returns results from function call 
      .on('end', async () => {
        const promiseResult = await Promise.all(results);
        const unfoundPromiseResult = await Promise.all(unfoundClients);
        // gets all qued promises on end event to resolve all objects at once, from all checkClientCSV queries during stream processing
        resolve(promiseResult);
        resolve(unfoundPromiseResult);
      })

      .on('error', (error) => {
        console.error('Error processing CSV file:', error);
        reject(error);
      });
  });
}

function handleAutoCSVUpload(stream) {
  return new Promise((resolve, reject) => {
    const tasks = [];

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

        resolve({ found, unfound });
      })
      .on('error', reject);
  });
}

module.exports = { handleCSVUpload, handleAutoCSVUpload };
