const cron = require('node-cron');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

async function emailAutomate() {
 // cron.schedule('0 6 * * *', async () => {
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

        console.log('Parsed email body:', parsed.attachments);
        if (!parsed.attachments || parsed.attachments.length === 0) {
          console.log('No attachments found');
          return;
        }

        const csvFile = parsed.attachments.find(att =>
          att.contentType === 'text/csv'
        );
      
      const csvContent = csvFile.content.toString();
      console.log('CSV Content:', csvContent);
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
 // });
}

emailAutomate(); // for command line call


module.exports = { emailAutomate };