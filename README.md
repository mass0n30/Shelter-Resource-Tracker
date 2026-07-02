# Shelter Resource Tracker

A case-management dashboard built for shelters and small nonprofit teams to track clients, referrals, notes, reminders, and nightly stay updates in one place.

View the [Live Demo](https://shelter-resource-tracker-demo.vercel.app/)
[Contact / Request Pilot]((mailto:massoncorlette07@gmail.com?subject=Shelter%20Resource%20Tracker%20Pilot%20Request))

---

## Built for Real Shelter Workflow Problems

Shelter teams often work across scattered notes, spreadsheets, emails, paper forms, and verbal updates. That can make it difficult to quickly answer important questions:

Who needs follow-up?
Which referrals are still pending?
Who stayed overnight?
Which clients are currently enrolled, inactive, or housed?
What should staff and managers prioritize today?

Shelter Resource Tracker was designed to bring those moving pieces into one shared dashboard.

---

## One Place for Clients, Referrals, Notes, and Follow-Ups

Shelter Resource Tracker gives staff and managers a clearer way to track client activity, referral progress, reminders, case notes, and status changes.

The goal is simple: help teams stay organized, reduce missed follow-ups, and make client information easier to understand at a glance and track client progress and timeline history.

---

## Core Features

* Client tracking for enrolled, inactive, housed, and other client statuses
* Referral tracking with status updates and follow-up dates
* Notes and reminders for staff communication
* Dashboard metrics for active clients, urgent cases, and upcoming follow-ups
* Nightly stay update workflow using CSV/email-based data
* Staff, manager, and admin role permissions
* Archive and history views for client activity
* Simple interface designed around daily shelter operations

---

## Who It’s For

Shelter Resource Tracker is designed for teams that need a practical way to organize client and referral information, including:

* Homeless shelters
* Transitional housing programs
* Recovery houses
* Small nonprofits
* Case-management teams
* Community resource organizations

---

## Demo Notice

This demo uses mock/sample data only. No real client information is included.

The demo is meant to show how the system works, what the dashboard looks like, and how staff might use it in a shelter or nonprofit environment.

---

## Why I Built It

I built Shelter Resource Tracker while working in shelter operations and seeing firsthand how difficult it can be to manage client updates, referrals, notes, reminders, and nightly stay information across disconnected systems.

This project was created around real workflow pain points, with the goal of making daily case-management tasks easier for staff and managers.

---

## Interested in Trying It?

I’m currently looking for feedback from shelters, nonprofits, and case-management teams.

If your organization is interested in trying the demo, giving feedback, or discussing a possible pilot version, feel free to reach out.

[Contact Me](https://www.linkedin.com/in/masson-corlette/)


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


***Notification Reminder System Overview**
  Notifications = action required
  Notes = information only
  Notifications are scoped to user unless explicitly shared
  Avoid global notifications by default

TO-DO GENERAL 5/28 (What to do to Finish Project):
  - Upon Search Button Click search backend for any user matching partial string?
  - Disclosure, About Me pages, and Footers?
  - Fix loader skeleton bug (dash skeleton loads on records/profile page?)
  - Add/Check all success/fetchUpdated data calls for mounts
  - Add Docs/Img avatar upload routes, look into cloudify cost?
  - POLISH
  - Add Disclaimer, About pages, ect (look back at notes)

  - Other
    - Run Linter 
    - Add transition animations to mobile panels (shadUI causing issues currently)
    - Add count for notifications icon on mobile Nav (Follow up/Notes today or tomorrow, or posted notes?)
    - Give better design for Email reminders 
    - Pagination ? 


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

