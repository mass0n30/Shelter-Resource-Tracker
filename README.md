
https://github.com/postalsys/imapflow IMAP library (for email synch)
https://resend.com/onboarding (for automated email notifications for Note and Referral followup dates)
https://nodemailer.com/extras/mailparser/ Parsing tool 
https://www.npmjs.com/package/node-cron Scheduling tool for node tasks
https://crontab.guru/ Schedule time syntax

Deployment:
Change URI to deployment URI upon deploying
https://console.cloud.google.com/auth/clients/create?authuser=1&project=resourcetracker-496508&supportedpurview=project

**Security**
- **Secure authentication:** Users must log in before accessing protected dashboard routes.
- **Password safety:** Passwords are securely hashed and are never stored in plain text. (Admin sends temporary password for reset)
- **Role-based access:** User permissions can be limited based on their role, such as admin, manager, or staff.
- **Workspace separation:** Each organization’s data is intended to remain separated from other organizations’ data.
- **Private notes:** Users can create private notes that are only visible to them.
- **Public case notes:** Shared notes and referrals are visible to authorized staff within the workspace.
- **Activity attribution:** Notes and referrals track who created them and when they were created.
- **Protected API routes:** Sensitive client, referral, and note data is accessed through authenticated backend routes.
- **Demo-safe data:** The public demo uses mock client data only, not real shelter/client records. Use for showing examples for recruiters or devs forks as well. 

5/23/25

MVP Features: (initially develop for Manager accounts)
  - Manager can CRUD client accounts, set time notifs, see client case management info. Staff can only view add notes.
  - Dashboard quick reference for current enrollments
  - Resources side bar has resource info (add table)?
  - Clients side bar has all clients in system (active/inactive filter) * for quick lookup upon re enrollments or resource history
  - attachments / file uploads (client sheets)

Extra Possible Features (after making core MVP product):
  - resource sidebar / organization directory
  - notification engine
  - email reminders
  - referral status history table
  - cloudify document upload storing
  - analytics/reporting
  - calendar view
  - task system
  - audit log


***Notification Reminder System Overview**
  Notifications = action required
  Notes = information only
  Notifications are scoped to user unless explicitly shared
  Avoid global notifications by default

TO-DO GENERAL 5/28 (What to do to Finish Project):
  - Fix loader skeleton bug (dash skeleton loads on records/profile page?)
  - Add/Check all client CRUD routes
  - Adjust Edit Client Form (image, add extension, date picker?)
  - Move the Profile color mapping from seeding to backend
  - Add Toggle up on Notes
  - Adjust Dashstats radius and spacing? (considering added graphic)
  - Add sparkle (some sort of graphic in left banner?)
  - Drop down line bug on Profile welcome
  - Increase dashboard border darkness?
  - Adjust Upload CSV form sentencing.
  - Mobile buttons color adjust on toggles, 
  - Add Gender in Info, fix Timeline height container
  - Add/Check all success/fetchUpdated data calls for mounts
  - Add pagination to client list (limit 50?)
  - Normalize Calendar Popovers (height issues on edit forms)
  - Polish forms (buttons, bg-color, add z-index-9999, ect)
  - Fix drop down arrows to close in filter dropdowns (recordsPage)
  - Google Auth sign-in not working on deployment fix?
  - Add Docs/Img avatar upload routes, look into cloudify cost?
  - Mobile: fix client profile Banner, Records buttons, and drop down chevron down arrows spacing
    * !! Fix Notifications Sheet doesn't toggle on Records route
  - POLISH
  - Update Loader Skeletons
  - Add Disclaimer, About pages, ect (look back at notes)

  - Other
    - Run Linter 
    - Add transition animations to mobile panels (shadUI causing issues currently)
    - Add count for notifications icon on mobile Nav (Follow up/Notes today or tomorrow, or posted notes?)


Deployment To-Do:
  - Update Google URI (link at top)
  - Make 1-2 minute video for demonstration
  - Add a Demo Mode for Recruiters (Demo Button w/ Guest Mode?)
  - Update ReadME
  - Make a Blog Post on the process (identify what I should focus on writing about technical vs business workflow, not being too techy for recruiters?)

Done:
 - define schema
 - define endpoints
 - make controllers
 - test routes in Postman
 - rough wireframe 3 pages
  * plan to use shadcn/ui + Tailwind for frontend, headless layout components to design dashboard on
 - Update test database
 - Define upload excel route and controller modules
 - Double check tested routes Postman
 - Mount dashboard data
 - configure email automation
 - Start designing inner containers *figuring data placements
 - Start install commands and setting up shadUI, zod, calender libraries and components
 - Make modals, toggles, forms
  - Apply Filter dependency
  - Update Clients non-active if past exit date
  - Add Resource and Note create Forms for client
    * normalize forms?
  - Create hook for Resource and Note post req
  - Get dash card stats  - Toggal displayed clients from  Dash Card selection
  - Edit and delete option and confirmation + backend controllers
  - Make edit and confirm delete forms
  - Notification Reminders sidebar design (go off figma, checking schema design for filter options, be deliberate here!)
        * Filter and order by prioritys and dates
  - Calendar logic (mapping Icons for either Client Initials/Note reminders / Referral Followups?) --> clicking calendar cell shows limited info.. Not sure what to exactly do here, as Calendar should function different from Reminders sidebar for the value it provides.
  -- Figure out Loader logic (using setLoading and setSuccess module from partials/Loading.jsx ??)

