
https://github.com/postalsys/imapflow IMAP library (for email synch)
https://nodemailer.com/extras/mailparser/ Parsing tool 
https://www.npmjs.com/package/node-cron Scheduling tool for node tasks
https://crontab.guru/ Schedule time syntax


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


Note 4/28:
    Follow up dates seem to expire correctly, along with new client filter in dash stats. Cron CSV parsing update feature returns unmatched enrolled clients and clients who stayed last night from client excel sheet from email attachment. Of course these configs should be confirmed to work again before deployments. 

***Notification Reminder System Overview**
  Notifications = action required
  Notes = information only
  Notifications are scoped to user unless explicitly shared
  Avoid global notifications by default

ToDo:
  Frontend
  - Edit and delete option and confirmation + backend controllers
  - Make edit and confirm delete forms
  - Normalize Forms (congruent design acrossed all modal forms)
  - Notification Reminders sidebar design (go off figma, checking schema design for filter options, be deliberate here!)
    * Filter and order by prioritys and dates
    * overdue → followUpDate < today / due today → followUpDate === today / upcoming soon → within next 3 days (asc by followUp and reminder dates w/ priority at top)
    * Make notifications container slide up/pop up on mobile view?
    * Notifications container shows alerts (Upcoming, Marked, Important Distinction?)
    * Notes section (filter Public, Personal, Priority?)
    * Edit and convert to Reminder option to notes (Notify Team option (makes global))
  - Add last updated from cron update showing in UI
  - Add loading skeletons
  - Add timeline modules and logic (shadUI?)

  Backend
   - Consider other scheduled jobs (cron) for time-based updates (dashboard notifs)
   

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



# PERN-Starter-Template
Starter template, using PERN stack, keeping backend and frontend in seperate directories. 

BACKEND directory:

Commands:
Commands in BACKEND directory!
npm install (installs all dependencies found in package.json)

npm install supertest --save-dev (for testing) (scripts in package.json)


PRISMA:
npm install prisma --save-dev
npm install @prisma/client
npx prisma init  (makes prisma folder)
npm install @quixo3/prisma-session-store  https://github.com/kleydon/prisma-session-store#readme   (set up Session Model in Prisma) 


npx prisma generate (after making schema)
npx prisma migrate dev (after making changes to schema)
 ----------------------------------------------------------------------
FRONTEND directory:

Design: Keep CSS inline or modular

npm install - sets up all node modules (installs all dependencies)

npm run dev - starts vite server

If using React to setup up default frontend directory run: 
npm create vite@latest . -- --template react


This template uses Prisma ORM supporting PostgreSQL. 
Prisma Setup Guide: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-postgresql 
or use quick commands: 
 ---> npx prisma init  (then after adding DATABASE_URL to .env)  ---> npx prisma migrate dev --name init  ---> npx prisma generate

Don't forget to setup .env where variables such as DATABASE_URL(where data is being served) will go
.gitignore has .env and /generated/schema to ignore from public 

Using PostMan Web Agent (for full API functionality): https://learning.postman.com/docs/getting-started/installation/installation-and-updates/#install-postman-on-linux   (after installing with snap command, just run 'postman' as a command to launch)

npm install -g nodemon --live view? 

Linter & Prettier Commands
npm install --save-dev eslint
npx eslint --init   (Optional for configuration)  

Linting commands
- Run: npx eslint .
- Fix: npx eslint . --fix

Prettier commands
- npm install --save-dev prettier
- touch .prettierrc  (Optional config file for tab space, ect. )


This template encourages using small layout primitives to manage spacing and responsiveness instead of hard-coded margins or excessive media queries.

Using Primitive Component Examples:

```jsx

<Shell>
  <Stack>
    <h1>Page Title</h1>

    <Cluster>
      <Button />
      <Button />
      <Button />
    </Cluster>

    <Content />
  </Stack>
</Shell>

another example
<Shell>
  <Stack>
    <Header />
    <Cluster>
      <FilterTag />
      <FilterTag />
      <FilterTag />
    </Cluster>
    <Content />
  </Stack>
</Shell>

detailed example (*Section and Main content being semantic tags*)

<Shell>
  <Stack>
    <PageHeader>
      <h1>Dashboard</h1>
      <p>Overview of your recent activity</p>
    </PageHeader>

    <MainContent>
      <Stack>
        <Section>
          <h2>Quick Stats</h2>
          <Grid>
            <StatCard />
            <StatCard />
            <StatCard />
          </Grid>
        </Section>

        <Section>
          <h2>Recent Items</h2>
          <Stack>
            <ItemRow />
            <ItemRow />
            <ItemRow />
          </Stack>
        </Section>
      </Stack>
    </MainContent>

    <Footer />
  </Stack>
</Shell>
