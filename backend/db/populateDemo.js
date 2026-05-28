const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear old data in dependency-safe order
  await prisma.emailNotificationLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.note.deleteMany();
  await prisma.enrollmentDates.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.updateData.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // -------------------------
  // Users
  // -------------------------
  const admin = await prisma.user.create({
    data: {
      firstName: "Masson",
      lastName: "Corlette",
      email: "massoncorlette07@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
  });

  const manager = await prisma.user.create({
    data: {
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah@sheltertracker.com",
      password: hashedPassword,
      role: "MANAGER",
      avatarUrl: "https://i.pravatar.cc/150?img=32",
    },
  });

  const staff = await prisma.user.create({
    data: {
      firstName: "James",
      lastName: "Walker",
      email: "james@sheltertracker.com",
      password: hashedPassword,
      role: "STAFF",
      avatarUrl: "https://i.pravatar.cc/150?img=13",
    },
  });

  // -------------------------
  // Clients
  // -------------------------
  const john = await prisma.client.create({
    data: {
      clientId: 1001,
      firstName: "John",
      lastName: "Baker",
      email: "john.baker@example.com",
      phone: "812-555-1101",
      gender: "Male",
      status: "ENROLLED",
      bedLabel: "M1 Bottom",
      intakeDate: daysAgo(45),
      lastStayDate: daysAgo(1),
      hereLastNight: true,
      extensionStatus: false,
      priorityNeed: "Housing stability",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
  });

  const maria = await prisma.client.create({
    data: {
      clientId: 1002,
      firstName: "Maria",
      lastName: "Lopez",
      email: "maria.lopez@example.com",
      phone: "812-555-1102",
      gender: "Female",
      status: "ENROLLED",
      bedLabel: "F2 Top",
      intakeDate: daysAgo(21),
      lastStayDate: daysAgo(1),
      hereLastNight: true,
      extensionStatus: true,
      priorityNeed: "Employment and transportation",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
  });

  const kevin = await prisma.client.create({
    data: {
      clientId: 1003,
      firstName: "Kevin",
      lastName: "Smith",
      email: "kevin.smith@example.com",
      phone: "812-555-1103",
      gender: "Male",
      status: "WC",
      bedLabel: "WC-M4",
      intakeDate: daysAgo(7),
      lastStayDate: daysAgo(1),
      hereLastNight: true,
      extensionStatus: false,
      priorityNeed: "Medical follow-up",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
    },
  });

  const denise = await prisma.client.create({
    data: {
      clientId: 1004,
      firstName: "Denise",
      lastName: "Carter",
      email: "denise.carter@example.com",
      phone: "812-555-1104",
      gender: "Female",
      status: "INACTIVE",
      bedLabel: null,
      intakeDate: daysAgo(90),
      outtakeDate: daysAgo(10),
      lastStayDate: daysAgo(13),
      hereLastNight: false,
      extensionStatus: false,
      priorityNeed: "Substance use treatment",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
    },
  });

  const robert = await prisma.client.create({
    data: {
      clientId: 1005,
      firstName: "Robert",
      lastName: "Green",
      email: "robert.green@example.com",
      phone: "812-555-1105",
      gender: "Male",
      status: "HOUSED",
      bedLabel: null,
      intakeDate: daysAgo(160),
      outtakeDate: daysAgo(20),
      lastStayDate: daysAgo(25),
      hereLastNight: false,
      extensionStatus: false,
      priorityNeed: "Housing aftercare",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
    },
  });

  const angela = await prisma.client.create({
    data: {
      clientId: 1006,
      firstName: "Angela",
      lastName: "Reed",
      email: "angela.reed@example.com",
      phone: "812-555-1106",
      gender: "Female",
      status: "ENROLLED",
      bedLabel: "F1 Bottom",
      intakeDate: daysAgo(12),
      lastStayDate: daysAgo(2),
      hereLastNight: false,
      extensionStatus: false,
      priorityNeed: "Legal documents",
      avatarUrl: "https://i.pravatar.cc/150?img=16",
    },
  });

  const terrance = await prisma.client.create({
    data: {
      clientId: 1007,
      firstName: "Terrance",
      lastName: "Moore",
      email: "terrance.moore@example.com",
      phone: "812-555-1107",
      gender: "Male",
      status: "ENROLLED",
      bedLabel: "M3 Top",
      intakeDate: daysAgo(30),
      lastStayDate: daysAgo(1),
      hereLastNight: true,
      extensionStatus: true,
      priorityNeed: "Employment",
      avatarUrl: "https://i.pravatar.cc/150?img=18",
    },
  });

  const linda = await prisma.client.create({
    data: {
      clientId: 1008,
      firstName: "Linda",
      lastName: "Evans",
      email: "linda.evans@example.com",
      phone: "812-555-1108",
      gender: "Female",
      status: "WC",
      bedLabel: "WC-F1",
      intakeDate: daysAgo(3),
      lastStayDate: daysAgo(1),
      hereLastNight: true,
      extensionStatus: false,
      priorityNeed: "Emergency shelter and ID replacement",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
    },
  });


  await prisma.enrollmentDates.createMany({
    data: [
      {
        clientId: john.id,
        date: john.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: maria.id,
        date: maria.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: kevin.id,
        date: kevin.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: denise.id,
        date: denise.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: denise.id,
        date: denise.outtakeDate,
        type: "OUTTAKE",
      },
      {
        clientId: robert.id,
        date: robert.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: robert.id,
        date: robert.outtakeDate,
        type: "HOUSED",
      },
      {
        clientId: angela.id,
        date: angela.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: terrance.id,
        date: terrance.intakeDate,
        type: "INTAKE",
      },
      {
        clientId: linda.id,
        date: linda.intakeDate,
        type: "INTAKE",
      },
    ],
  });

  await prisma.referral.createMany({
    data: [
      {
        clientId: john.id,
        createdById: manager.id,
        organizationName: "United Way",
        resourceType: "HOUSING",
        purpose: "Needs help finding stable housing options.",
        status: "PENDING",
        roiSigned: true,
        roiSignedAt: daysAgo(10),
        followUpDate: daysFromNow(2),
        isPriority: true,
        summary: "Housing intake completed. Waiting for follow-up from housing coordinator.",
      },
      {
        clientId: john.id,
        createdById: staff.id,
        organizationName: "Centerstone",
        resourceType: "MEDICAL",
        purpose: "Mental health support and medication management.",
        status: "REFERRED",
        roiSigned: false,
        followUpDate: daysFromNow(5),
        isPriority: false,
        summary: "Client expressed interest but still needs ROI signed.",
      },
      {
        clientId: maria.id,
        createdById: manager.id,
        organizationName: "WorkOne",
        resourceType: "EMPLOYMENT",
        purpose: "Resume help and job placement.",
        status: "ENROLLED",
        roiSigned: true,
        roiSignedAt: daysAgo(5),
        followUpDate: daysFromNow(7),
        isPriority: false,
        summary: "Client attended first appointment and has a resume workshop scheduled.",
      },
      {
        clientId: kevin.id,
        createdById: staff.id,
        organizationName: "Columbus Regional Health",
        resourceType: "MEDICAL",
        purpose: "Follow-up for ongoing medical issue.",
        status: "PENDING",
        roiSigned: true,
        roiSignedAt: daysAgo(2),
        followUpDate: daysFromNow(1),
        isPriority: true,
        summary: "Medical follow-up is time-sensitive. Staff should confirm appointment.",
      },
      {
        clientId: denise.id,
        createdById: manager.id,
        organizationName: "Turning Point",
        resourceType: "SUBSTANCE_USE",
        purpose: "Treatment program referral.",
        status: "CLOSED",
        roiSigned: true,
        roiSignedAt: daysAgo(30),
        closedAt: daysAgo(8),
        isPriority: false,
        summary: "Referral closed after client stopped engaging with shelter services.",
      },
      {
        clientId: robert.id,
        createdById: admin.id,
        organizationName: "Housing Partnerships Inc.",
        resourceType: "HOUSING",
        purpose: "Permanent housing placement.",
        status: "COMPLETED",
        roiSigned: true,
        roiSignedAt: daysAgo(60),
        closedAt: daysAgo(20),
        isPriority: false,
        summary: "Client was successfully housed. Follow-up recommended after 30 days.",
      },
      {
        clientId: angela.id,
        createdById: staff.id,
        organizationName: "Legal Aid",
        resourceType: "LEGAL",
        purpose: "Needs help replacing documents and resolving ID issue.",
        status: "INQUIRED",
        roiSigned: false,
        followUpDate: daysFromNow(3),
        isPriority: true,
        summary: "Client cannot move forward with several services until documents are replaced.",
      },
      {
        clientId: terrance.id,
        createdById: manager.id,
        organizationName: "WorkOne",
        resourceType: "EMPLOYMENT",
        purpose: "Job search and interview preparation.",
        status: "REFERRED",
        roiSigned: true,
        roiSignedAt: daysAgo(4),
        followUpDate: daysFromNow(4),
        isPriority: false,
        summary: "Client has warehouse experience and is interested in second-shift work.",
      },
      {
        clientId: linda.id,
        createdById: staff.id,
        organizationName: "BMV / Document Assistance",
        resourceType: "LEGAL",
        purpose: "Replacement ID and birth certificate.",
        status: "PENDING",
        roiSigned: true,
        roiSignedAt: daysAgo(1),
        followUpDate: daysFromNow(1),
        isPriority: true,
        summary: "New winter contingency client. ID replacement is urgent.",
      },
    ],
  });

  // -------------------------
  // Notes
  // -------------------------
  await prisma.note.createMany({
    data: [
      {
        clientId: john.id,
        authorId: manager.id,
        title: "Housing follow-up",
        content: "John said he is still interested in transitional housing. Follow up with United Way this week.",
        setReminder: true,
        reminderAt: daysFromNow(2),
        visibility: "public",
      },
      {
        clientId: john.id,
        authorId: staff.id,
        title: "Mood check",
        content: "Client seemed tired but cooperative. No major concerns during evening shift.",
        setReminder: false,
        visibility: "private",
      },
      {
        clientId: maria.id,
        authorId: manager.id,
        title: "Employment progress",
        content: "Maria attended her WorkOne appointment and wants help printing updated resume.",
        setReminder: true,
        reminderAt: daysFromNow(4),
        visibility: "public",
      },
      {
        clientId: kevin.id,
        authorId: staff.id,
        title: "Medical appointment",
        content: "Kevin needs help confirming his appointment time. He does not have reliable phone access.",
        setReminder: true,
        reminderAt: daysFromNow(1),
        visibility: "public",
      },
      {
        clientId: denise.id,
        authorId: manager.id,
        title: "Inactive client note",
        content: "Denise has not returned for services. Marked inactive after repeated no-shows.",
        setReminder: false,
        completed: true,
        visibility: "private",
      },
      {
        clientId: robert.id,
        authorId: admin.id,
        title: "Housed follow-up",
        content: "Robert was housed successfully. Check in after 30 days if contact information is still valid.",
        setReminder: true,
        reminderAt: daysFromNow(10),
        visibility: "public",
      },
      {
        clientId: angela.id,
        authorId: staff.id,
        title: "Needs ID documents",
        content: "Angela says she lost her ID and birth certificate. This is blocking job and housing applications.",
        setReminder: true,
        reminderAt: daysFromNow(3),
        visibility: "public",
      },
      {
        clientId: terrance.id,
        authorId: manager.id,
        title: "Interview prep",
        content: "Terrance asked about interview clothes and transportation options for job interviews.",
        setReminder: false,
        visibility: "public",
      },
      {
        clientId: linda.id,
        authorId: staff.id,
        title: "New WC intake",
        content: "Linda came in through winter contingency. Needs document replacement and resource orientation.",
        setReminder: true,
        reminderAt: daysFromNow(1),
        visibility: "public",
      },

      // Dashboard/global notes
      {
        clientId: null,
        authorId: admin.id,
        title: "Staff reminder",
        content: "Remember to review priority referrals before morning handoff.",
        setReminder: true,
        reminderAt: daysFromNow(1),
        visibility: "public",
      },
      {
        clientId: null,
        authorId: manager.id,
        title: "CSV upload check",
        content: "Verify nightly stay sheet imported correctly before using stayed overnight filter.",
        setReminder: false,
        visibility: "public",
      },
      {
        clientId: null,
        authorId: staff.id,
        title: "Private dashboard note",
        content: "Need to clean up duplicate client names later this week.",
        setReminder: false,
        visibility: "private",
      },
    ],
  });

  // -------------------------
  // Notifications
  // -------------------------
  await prisma.notification.createMany({
    data: [
      {
        type: "CSV_UPLOAD",
        message: "Nightly stay sheet processed successfully.",
        data: {
          processed: 8,
          matchedClients: 6,
          unmatchedClients: 2,
        },
        read: false,
      },
      {
        type: "PRIORITY_REFERRAL",
        message: "3 priority referrals need attention.",
        data: {
          count: 3,
        },
        read: false,
      },
      {
        type: "FOLLOW_UP",
        message: "Several follow-ups are due soon.",
        data: {
          dueSoon: 4,
        },
        read: true,
      },
    ],
  });


  await prisma.updateData.create({
    data: {
      data: "Initial seed completed with mock clients, referrals, notes, and notifications.",
    },
  });

  console.log("Seed completed.");
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

main()
  .catch(function (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async function () {
    await prisma.$disconnect();
  });