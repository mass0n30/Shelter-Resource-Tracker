

const fs = require('fs');
const csv = require('csv-parser');
const { checkClientCSV } = require("../db/queries.js");

// converts attached file in file path to handle 
async function handleCSVUpload(filePath) {
  try {
    console.log('Received file:', filePath);

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
        return promiseResult;
      });

  } catch (error) {
    console.log('failed to upload file', error);
    return error;
  }
}

// handles the stream already converted from buffer
function handleAutoCSVUpload(stream) {
  return new Promise((resolve, reject) => {
    const results = [];

    stream
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        console.log(row);
        results.push(row);
      })
      // on end event callback returns results from function call 
      .on('end', () => {
        console.log('CSV parsing complete');
        resolve(results);
      })
      .on('error', (err) => {
        console.error('CSV error:', err);
        reject(err);
      });
  });
}

module.exports = { handleCSVUpload, handleAutoCSVUpload };
