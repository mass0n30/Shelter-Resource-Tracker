

const fs = require('fs');
const csv = require('csv-parser');
const { checkClientCSV } = require("../../db/queries.js");

export default async function handleCSVUpload(req, res, next) {
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

