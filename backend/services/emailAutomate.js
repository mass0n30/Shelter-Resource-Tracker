const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const {handleAutoCSVUpload} = require('../services/csvUpload');
const { Readable } = require('stream');

// converting bytes to be able to stream reading for csv parsing
function bufferToStream(buffer) {
  return Readable.from(buffer);
}

async function emailAutomate() {
  console.log('Running email automation task at 6:00 AM every day');

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: 'masson07vlog@gmail.com',
      pass: 'motrgclidvdfsrjy'
    }
  });

  // outer try catch for client connection and logout
  // inner try catch for mailbox lock and message processing
  try {
    await client.connect();
    console.log('Connected to email server');

    let lock = await client.getMailboxLock('INBOX');

    // using imapflow search method to find all unseen emails from specific sender
    const messages = await client.search({
      from: 'massoncorlette07@gmail.com',
      seen: false,
    });

    if (messages.length === 0) {
      console.log('No matching emails');
      return;
    }

    const latestUid = messages[messages.length - 1];

    try {
      // uses the uid to get full email data, including email body with buffer property
      let message = await client.fetchOne(latestUid, {
        envelope: true,
        source: true
      });

      if (!message) {
        console.log('No messages found');
        return;
      }

      console.log('Subject:', message.envelope.subject);

      // turning email into readable format from email buffer property provided by imapflow, using mailparser simpleParser
      const parsed = await simpleParser(message.source);

      if (!parsed.attachments || parsed.attachments.length === 0) {
        console.log('No attachments found');
        return;
      }

      const csvFile = parsed.attachments.find(att =>
        att.filename?.toLowerCase().includes('.csv') ||
        att.contentType?.includes('csv')
      );

      if (!csvFile || !csvFile.content) {
        console.log('No CSV attachment or content found');
        return;
      };

      const csvBuffer = csvFile.content;
      console.log(csvFile.content.toString().slice(0, 200));

      // converting buffer to stream for csv parsing
      const csvStream = bufferToStream(csvBuffer);

      // calling the csv upload function with the email attachment stream
      await handleAutoCSVUpload(csvStream);
    } finally {
      lock.release();
    }

  } catch (err) {
    console.error('Email automation error:', err);
  } finally {
    try {
      await client.logout();
    } catch (e) {}
  }
}

emailAutomate(); // for command line call


module.exports = { emailAutomate };