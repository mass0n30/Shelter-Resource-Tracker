const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const { prisma } = require('../db/prismaClient');
const {handleAutoCSVUpload} = require('../services/csvUpload');
const { Readable } = require('stream');
const cron = require("node-cron");


// converting bytes to be able to stream reading for csv parsing
function bufferToStream(buffer) {
  return Readable.from(buffer);
}

async function emailAutomate() {
 // 'Running email automation task at 6:00 AM every day'

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      // SET THESE IN ENV BEFORE DEPLOYMENT, USING TEST GMAIL ACCOUNT FOR NOW
    user: process.env.IMAP_EMAIL_USER,
    pass: process.env.IMAP_EMAIL_PASSWORD,
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
      since: new Date(Date.now() - 24 * 60 * 60 * 1000)
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

     // console.log('Subject:', message.envelope.subject);

      // turning email into readable format from email buffer property provided by imapflow, using mailparser simpleParser
      const parsed = await simpleParser(message.source);

      if (!parsed.attachments || parsed.attachments.length === 0) {
       // console.log('No attachments found');
        return;
      }

      const csvFile = parsed.attachments.find(att =>
        att.filename?.toLowerCase().includes('.csv') ||
        att.contentType?.includes('csv')
      );

      if (!csvFile || !csvFile.content) {
        //console.log('No CSV attachment or content found');
        return;
      };

      const csvBuffer = csvFile.content;
     // console.log(csvFile.content.toString().slice(0, 200));

      // converting buffer to stream for csv parsing
      const csvStream = bufferToStream(csvBuffer);

      // calling the csv upload function with the email attachment stream
      const results = await handleAutoCSVUpload(csvStream);

      // adding unmatched/matched client names to get req for a notification on dashboard to add new client
      if (results.unfound.length > 0) {
        await prisma.notification.create({
          data: {
            type: "UNMATCHED_CLIENTS",
            message: `${results.unfound.length} clients not found`,
            data: results.unfound, // if using JSON column
          }
        });
      }

      if (results.found.length > 0) {
        await prisma.notification.create({
          data: {
            type: "MATCHED_CLIENTS",
            message: `${results.found.length} clients matched successfully`,
            data: results.found.map(client => ({ id: client.id, firstName: client.firstName, lastName: client.lastName })), // if using JSON column
          }
        });
      }

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


const { Resend } =  require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

function startReminderEmailJob() {
  // runs every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("Running reminder email job...");

    const now = new Date();

    // first gathering all overdue referrals and notes 
    const dueReferrals = await prisma.referral.findMany({
      where: {
        followUpDate: {
          lte: now,
        },
        status: {
          notIn: ["COMPLETED", "CLOSED"],
        },
      },
      include: {
        client: true,
        createdBy: true,
      },
    });

    const dueNotes = await prisma.note.findMany({
      where: {
        setReminder: true,
        reminderAt: {
          lte: now,
        },
      },
      include: {
        client: true,
        author: true,
      },
    });

    // group emails by recipient to send one email per person with all their reminders
    const emailsByRecipient = {};

    // collect referral reminders
    for (const referral of dueReferrals) {
      if (!referral.createdBy?.email) continue;

      const alreadySent = await prisma.emailNotificationLog.findUnique({
        where: {
          type_targetId_recipient: {
            type: "REFERRAL_FOLLOW_UP",
            targetId: referral.id,
            recipient: referral.createdBy.email,
          },
        },
      });

      if (alreadySent) continue;

      const recipient = referral.createdBy.email;

      // initialize recipient entry if not exists
      if (!emailsByRecipient[recipient]) {
        emailsByRecipient[recipient] = {
          referrals: [],
          notes: [],
        };
      }

      // finally adding the reminder to the recipient's list
      emailsByRecipient[recipient].referrals.push(referral);
    }

    // collect note reminders
    for (const note of dueNotes) {
      if (!note.author?.email) continue;

      const alreadySent = await prisma.emailNotificationLog.findUnique({
        where: {
          type_targetId_recipient: {
            type: "NOTE_REMINDER",
            targetId: note.id,
            recipient: note.author.email,
          },
        },
      });

      if (alreadySent) continue;

      const recipient = note.author.email;

      if (!emailsByRecipient[recipient]) {
        emailsByRecipient[recipient] = {
          referrals: [],
          notes: [],
        };
      }

      emailsByRecipient[recipient].notes.push(note);
    }

    // send one email per recipient
      // structuring HTML for email body 
    for (const [recipient, items] of Object.entries(emailsByRecipient)) {      
      const referralHtml = items.referrals
        .map((referral) => {
          return `
            <li>
              <strong>${referral.client.firstName} ${referral.client.lastName}</strong><br />
              Organization: ${referral.organizationName}<br />
              Status: ${referral.status}<br />
              Follow-up Date: ${new Date(referral.followUpDate).toLocaleDateString()}
            </li>
          `;
        })
        .join("");

        const noteHtml = items.notes
          .map((note) => {
            const clientName = note.client
              ? `<strong>${note.client.firstName} ${note.client.lastName}</strong><br />`
              : "";

            const noteTitle = note.title
              ? `Note: ${note.title}<br />`
              : "";

            return `
              <li>
                ${clientName}
                ${noteTitle}
                Reminder Date: ${new Date(note.reminderAt).toLocaleDateString()}<br />
                ${note.content}
              </li>
            `;
          })
          .join("");

      // passing body to sendEmail function that uses Resend to send the email
      await sendEmail({
        to: recipient,
        subject: "Resource Tracker Daily Reminders",
        html: `
          <h2>Daily Reminders</h2>

          ${
            items.referrals.length > 0
              ? `
                <h3>Follow-ups Due</h3>
                <ul>
                  ${referralHtml}
                </ul>
              `
              : ""
          }

          ${
            items.notes.length > 0
              ? `
                <h3>Note Reminders</h3>
                <ul>
                  ${noteHtml}
                </ul>
              `
              : ""
          }
        `,
      });

      // log referral emails after successful send
      for (const referral of items.referrals) {
        await prisma.emailNotificationLog.create({
          data: {
            type: "REFERRAL_FOLLOW_UP",
            targetId: referral.id,
            recipient,
          },
        });
      }

      // log note emails after successful send
      for (const note of items.notes) {
        await prisma.emailNotificationLog.create({
          data: {
            type: "NOTE_REMINDER",
            targetId: note.id,
            recipient,
          },
        });
      }
    }

    console.log("Reminder email job finished.");
  });
};

// emailAutomate(); // for command line call


module.exports = { emailAutomate, startReminderEmailJob };