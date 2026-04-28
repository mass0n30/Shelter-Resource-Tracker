require('dotenv').config();
const express = require('express');
const expressSession = require("express-session");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('./generated/prisma/client');
const passport = require("passport");
require("./config/passport"); // booting strategy before any initializing
const pgPool = require("./config/pool");
const cors = require('cors');
const cron = require('node-cron');

const {indexRouter} = require('./routes/index');
const {profileRouter} = require('./routes/profile');
const {signupRouter} = require('./routes/signup');


const {dashboardRouter} = require('./routes/dashboard');
const {clientRouter} = require('./routes/client');
const {referralRouter} = require('./routes/referral');
const {noteRouter} = require('./routes/notes');

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/styles"));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // tells how long session user signed in
    },
    secret: 'cats',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        pool: pgPool,
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session());  //enables persistent login sessions

app.use('/sign-up', signupRouter);

app.use('/', indexRouter);

app.use('/profile',  profileRouter);

app.use('/dashboard', passport.authenticate('jwt', { session: false }), dashboardRouter);

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { handleCSVUpload }  = require('./services/csvUpload');
const { emailAutomate } = require('./services/emailAutomate');

// automatic email processing for client sheets

cron.schedule('0 6 * * *', async () => {
  console.log('Running email csv automation task at 6:00 AM every day');

  try {
    await emailAutomate();

    console.log('Email csv automation task completed successfully');
  } catch (error) {
    console.error('Error during email csv automation task:', error);
  }

}, {
  timezone: 'America/New_York'
});

// for manual csv uploads form dashboard
// further logic added for uploading prior days, ect. ?
app.post('/upload', upload.single('csv_file'), async (req, res, next) => {
  try {
    const result = await handleCSVUpload(req.file.path);
    res.json({ message: 'File uploaded successfully', clients: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

app.use('/dashboard/clients',passport.authenticate('jwt', { session: false }), clientRouter);
app.use('/dashboard/referrals', passport.authenticate('jwt', { session: false }), referralRouter);
app.use('/dashboard/notes', passport.authenticate('jwt', { session: false }), noteRouter);

app.post("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(400);
    } 
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// app level error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
  });
});



app.listen(5000, () => console.log('Server started on port 5000'));