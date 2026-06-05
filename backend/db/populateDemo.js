const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const CLIENT_COUNTS = {
  ENROLLED: 30,
  WC: 15,
  INACTIVE: 40,
  HOUSED: 12,
};

const FIRST_NAMES = {
  Male: [
    "John", "Kevin", "Robert", "Terrance", "Marcus", "David", "James",
    "Anthony", "Brian", "William", "Steven", "Darnell", "Eric", "Joseph",
    "Michael", "Chris", "Nathan", "Samuel", "Victor", "Andre", "Caleb",
    "Isaiah", "Wesley", "Derek", "Aaron", "George", "Travis", "Leon",
    "Patrick", "Corey", "Brandon", "Luis",
  ],
  Female: [
    "Maria", "Denise", "Angela", "Linda", "Patricia", "Shannon", "Tanya",
    "Rebecca", "Melissa", "Karen", "Nicole", "Jasmine", "Erica", "Michelle",
    "Heather", "Crystal", "Monica", "Latoya", "Brittany", "Dawn", "Amanda",
    "Rachel", "Kendra", "Sabrina", "Olivia", "Theresa", "Carmen", "Ashley",
    "Felicia", "Megan", "Diana", "Tamika",
  ],
};

const LAST_NAMES = [
  "Baker", "Lopez", "Smith", "Carter", "Green", "Reed", "Moore", "Evans",
  "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson",
  "Anderson", "Thomas", "Taylor", "Martin", "Jackson", "Thompson", "White",
  "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
  "Wright", "Scott", "Torres", "Nguyen", "Hill", "Adams", "Bennett", "Brooks",
  "Foster", "Price", "Coleman", "Simmons", "Bryant", "Perry", "Powell", "Long",
  "Hughes", "Sanders", "Bell", "Cooper", "Richardson", "Bailey", "Morgan",
  "Peterson", "Howard", "Gray", "Ramirez", "Ward", "Cox", "Richard", "Watson",
  "Kelly", "Murphy",
];

const PRIORITY_NEEDS = [
  "Housing stability",
  "Employment and transportation",
  "Medical follow-up",
  "Mental health support",
  "Substance use treatment",
  "Legal documents",
  "Replacement ID",
  "Birth certificate assistance",
  "Benefits application",
  "Family reunification",
  "Transportation support",
  "Long-term case management",
  "Dental care",
  "Medication access",
  "Job readiness",
  "Income stabilization",
  "Housing aftercare",
  "Emergency shelter extension",
];

const ORGANIZATIONS_BY_TYPE = {
  HOUSING: [
    "United Way",
    "Housing Partnerships Inc.",
    "Thrive Alliance",
    "Lincoln Central Neighborhood Family Center",
  ],
  EMPLOYMENT: [
    "WorkOne",
    "Goodwill Employment Services",
    "Elwood Staffing",
    "Express Employment Professionals",
  ],
  MEDICAL: [
    "Columbus Regional Health",
    "Windrose Health Network",
    "Centerstone",
    "Volunteers in Medicine",
  ],
  LEGAL: [
    "Legal Aid",
    "BMV / Document Assistance",
    "Indiana Legal Services",
    "Document Recovery Program",
  ],
  SUBSTANCE_USE: [
    "Turning Point",
    "Centerstone Recovery",
    "Aspire Indiana Health",
    "Tara Treatment Center",
  ],
  FINANCIAL_ASSISTANCE: [
    "Trustee Office",
    "Salvation Army",
    "Township Assistance",
    "Community Action Program",
  ],
  OTHER: [
    "Community Outreach",
    "Local Church Partner",
    "Library Resource Desk",
    "Case Management Team",
  ],
};

const REFERRAL_PURPOSES = {
  HOUSING: "Needs help identifying stable housing options and next-step placement.",
  EMPLOYMENT: "Needs help with job search, resume support, and interview preparation.",
  MEDICAL: "Needs follow-up for medical care, medication access, or appointment coordination.",
  LEGAL: "Needs document replacement, ID support, or help resolving a legal barrier.",
  SUBSTANCE_USE: "Needs treatment referral, recovery support, or program intake coordination.",
  FINANCIAL_ASSISTANCE: "Needs benefits, trustee, or emergency financial assistance support.",
  OTHER: "Needs general resource navigation and case management follow-up.",
};

const REFERRAL_SUMMARIES = [
  "Initial referral created. Staff should verify contact information before next handoff.",
  "Client is interested but needs help completing next-step paperwork.",
  "ROI signed. Waiting for outside organization to confirm status.",
  "Client missed one appointment. Follow-up needed before closing referral.",
  "Case manager left voicemail and is waiting for response.",
  "Client has appointment scheduled and needs transportation plan confirmed.",
  "Referral is moving forward. Staff should document outcome after next meeting.",
  "Client needs reminder because phone access is unreliable.",
  "Referral completed and archived for historical reporting.",
  "Referral closed after client disengaged or no longer needed service.",
];

const NOTE_TEMPLATES = [
  {
    title: "Housing follow-up",
    content: "Client remains interested in housing resources. Staff should follow up on open housing referral and update timeline.",
  },
  {
    title: "Document barrier",
    content: "Client reports missing ID or birth certificate. This is blocking employment, benefits, or housing progress.",
  },
  {
    title: "Employment progress",
    content: "Client asked about job options and may need help with resume, interview clothes, or transportation.",
  },
  {
    title: "Medical coordination",
    content: "Client may need help confirming appointment time and arranging transportation to provider.",
  },
  {
    title: "Evening shift check-in",
    content: "Client was cooperative during shift. No immediate safety issues reported, but staff should continue routine check-ins.",
  },
  {
    title: "Benefits discussion",
    content: "Client asked about SNAP, Medicaid, or disability benefits. Case manager should review application status.",
  },
  {
    title: "Transportation issue",
    content: "Client has difficulty getting to appointments. Bus route, gas card, or agency ride option may be needed.",
  },
  {
    title: "Family contact",
    content: "Client mentioned possible family support. Follow up only if client wants to pursue contact or reunification.",
  },
  {
    title: "Shelter plan update",
    content: "Client needs updated plan for next steps, including referral priorities and expected follow-up dates.",
  },
  {
    title: "Private staff observation",
    content: "Staff should monitor engagement pattern and document whether client continues to participate in services.",
    visibility: "private",
  },
];

async function main() {
  console.log("Seeding database...");

  await clearDatabase();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await createUsers(hashedPassword);
  const clients = await createClients();

  await createEnrollmentTimeline(clients);
  await createReferrals(clients, users);
  await createNotes(clients, users);
  await createNotifications();

  await prisma.updateData.create({
    data: {
      data: `Seed completed with ${clients.length} clients, reduced active workload, archived referral history, 4 urgent cases, and 10 follow-ups.`,
    },
  });

  console.log(`Seed completed. Created ${clients.length} clients.`);
}

async function clearDatabase() {
  await prisma.emailNotificationLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.note.deleteMany();
  await prisma.enrollmentDates.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.updateData.deleteMany();
}

async function createUsers(hashedPassword) {
  const admin = await prisma.user.create({
    data: {
      firstName: "Masson",
      lastName: "Corlette",
      email: "massoncorlette07@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      avatarUrl: makeInitialsAvatar("Masson Corlette"),
    },
  });

  const manager = await prisma.user.create({
    data: {
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah@sheltertracker.com",
      password: hashedPassword,
      role: "MANAGER",
      avatarUrl: makeInitialsAvatar("Sarah Miller"),
    },
  });

  const staff = await prisma.user.create({
    data: {
      firstName: "James",
      lastName: "Walker",
      email: "james@sheltertracker.com",
      password: hashedPassword,
      role: "STAFF",
      avatarUrl: makeInitialsAvatar("James Walker"),
    },
  });

  return {
    admin,
    manager,
    staff,
    all: [admin, manager, staff],
  };
}

async function createClients() {
  const clientSpecs = [
    ...buildClientSpecs("ENROLLED", CLIENT_COUNTS.ENROLLED),
    ...buildClientSpecs("WC", CLIENT_COUNTS.WC),
    ...buildClientSpecs("INACTIVE", CLIENT_COUNTS.INACTIVE),
    ...buildClientSpecs("HOUSED", CLIENT_COUNTS.HOUSED),
  ];

  const clients = [];

  for (const spec of clientSpecs) {
    const client = await prisma.client.create({
      data: spec,
    });

    clients.push(client);
  }

  return clients;
}

function buildClientSpecs(status, count) {
  const specs = [];

  for (let i = 0; i < count; i += 1) {
    const globalIndex = getStatusOffset(status) + i + 1;
    const gender = globalIndex % 2 === 0 ? "Female" : "Male";
    const firstName = FIRST_NAMES[gender][i % FIRST_NAMES[gender].length];
    const lastName = LAST_NAMES[(globalIndex * 3) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const intakeDaysAgo = getIntakeDaysAgo(status, i);
    const outtakeDaysAgo = getOuttakeDaysAgo(status, i, intakeDaysAgo);

    const stayedRecently = status === "ENROLLED" || status === "WC";
    const hereLastNight = stayedRecently && i % 4 !== 0;

    specs.push({
      clientId: 1000 + globalIndex,
      firstName,
      lastName,
      email: `${firstName}.${lastName}.${globalIndex}@example.com`.toLowerCase(),
      phone: `812-555-${String(1100 + globalIndex).slice(-4)}`,
      gender,
      status,
      bedLabel: getBedLabel(status, gender, i),
      intakeDate: daysAgo(intakeDaysAgo),
      outtakeDate: outtakeDaysAgo ? daysAgo(outtakeDaysAgo) : null,
      lastStayDate: stayedRecently
        ? daysAgo(i % 5 === 0 ? 2 : 1)
        : daysAgo(outtakeDaysAgo || 20),
      hereLastNight,
      extensionStatus: (status === "ENROLLED" || status === "WC") && i % 8 === 0,
      priorityNeed: PRIORITY_NEEDS[(globalIndex + i) % PRIORITY_NEEDS.length],
      avatarUrl: makeInitialsAvatar(fullName),
    });
  }

  return specs;
}

function getStatusOffset(status) {
  if (status === "ENROLLED") return 0;
  if (status === "WC") return CLIENT_COUNTS.ENROLLED;
  if (status === "INACTIVE") return CLIENT_COUNTS.ENROLLED + CLIENT_COUNTS.WC;
  if (status === "HOUSED") {
    return CLIENT_COUNTS.ENROLLED + CLIENT_COUNTS.WC + CLIENT_COUNTS.INACTIVE;
  }

  return 0;
}

function getIntakeDaysAgo(status, index) {
  if (status === "ENROLLED") return 5 + index * 3;
  if (status === "WC") return 1 + index;
  if (status === "INACTIVE") return 45 + index * 4;
  if (status === "HOUSED") return 90 + index * 12;

  return 30;
}

function getOuttakeDaysAgo(status, index, intakeDaysAgo) {
  if (status === "INACTIVE") {
    return Math.max(5, intakeDaysAgo - 20 - (index % 12));
  }

  if (status === "HOUSED") {
    return Math.max(10, intakeDaysAgo - 45 - (index % 20));
  }

  return null;
}

function getBedLabel(status, gender, index) {
  if (status === "INACTIVE" || status === "HOUSED") return null;

  const prefix = gender === "Female" ? "F" : "M";
  const bedNumber = (index % 12) + 1;
  const bunk = index % 2 === 0 ? "Bottom" : "Top";

  if (status === "WC") return `WC-${prefix}${bedNumber}`;

  return `${prefix}${bedNumber} ${bunk}`;
}

async function createEnrollmentTimeline(clients) {
  const records = [];

  clients.forEach(function (client) {
    records.push({
      clientId: client.id,
      date: client.intakeDate,
      type: "INTAKE",
    });

    if (client.status === "INACTIVE" && client.outtakeDate) {
      records.push({
        clientId: client.id,
        date: client.outtakeDate,
        type: "OUTTAKE",
      });
    }

    if (client.status === "HOUSED" && client.outtakeDate) {
      records.push({
        clientId: client.id,
        date: client.outtakeDate,
        type: "HOUSED",
      });
    }
  });

  await prisma.enrollmentDates.createMany({
    data: records,
  });
}

async function createReferrals(clients, users) {
  const resourceTypes = Object.keys(ORGANIZATIONS_BY_TYPE);
  const referrals = [];

  let urgentCasesCreated = 0;
  let followUpsCreated = 0;

  clients.forEach(function (client, index) {
    const referralCount = getReferralCount(client.status, index);

    for (let i = 0; i < referralCount; i += 1) {
      const resourceType = resourceTypes[(index + i) % resourceTypes.length];
      const status = getReferralStatus(client.status, index, i);
      const closed = status === "CLOSED" || status === "COMPLETED";

      let isPriority = false;
      if (!closed && urgentCasesCreated < 4 && shouldCreatePriority(client, index, i)) {
        isPriority = true;
        urgentCasesCreated += 1;
      }

      let followUpDate = null;
      if (!closed && followUpsCreated < 10 && shouldCreateFollowUp(client, index, i)) {
        followUpDate = daysFromNow(getFollowUpOffset(followUpsCreated));
        followUpsCreated += 1;
      }

      const roiSigned = closed || (index + i) % 4 !== 0;

      referrals.push({
        clientId: client.id,
        createdById: pickUser(users.all, index + i).id,
        organizationName: pick(ORGANIZATIONS_BY_TYPE[resourceType], index + i),
        resourceType,
        purpose: REFERRAL_PURPOSES[resourceType],
        status,
        roiSigned,
        roiSignedAt: roiSigned ? daysAgo(1 + ((index + i) % 30)) : null,
        followUpDate,
        closedAt: closed ? daysAgo(2 + ((index + i) % 75)) : null,
        isPriority,
        summary: closed
          ? pick(
              [
                "Referral completed and archived for historical reporting.",
                "Referral closed after outcome was documented.",
                "Client completed the resource connection successfully.",
                "Referral closed because service was no longer needed.",
              ],
              index + i
            )
          : pick(REFERRAL_SUMMARIES, index + i),
      });
    }
  });

  await prisma.referral.createMany({
    data: referrals,
  });
}

function getReferralStatus(clientStatus, clientIndex, referralIndex) {
  if (clientStatus === "INACTIVE") {
    return referralIndex % 2 === 0 ? "CLOSED" : "COMPLETED";
  }

  if (clientStatus === "HOUSED") {
    return referralIndex % 3 === 0 ? "CLOSED" : "COMPLETED";
  }

  if (clientStatus === "WC") {
    const statuses = ["COMPLETED", "CLOSED", "REFERRED", "COMPLETED"];
    return statuses[(clientIndex + referralIndex) % statuses.length];
  }

  if (clientStatus === "ENROLLED") {
    const statuses = [
      "COMPLETED",
      "CLOSED",
      "PENDING",
      "COMPLETED",
      "REFERRED",
      "COMPLETED",
      "CLOSED",
    ];

    return statuses[(clientIndex + referralIndex) % statuses.length];
  }

  return "COMPLETED";
}

function shouldCreatePriority(client, clientIndex, referralIndex) {
  if (client.status !== "ENROLLED" && client.status !== "WC") return false;

  return referralIndex === 0 && clientIndex % 9 === 0;
}

function shouldCreateFollowUp(client, clientIndex, referralIndex) {
  if (client.status !== "ENROLLED" && client.status !== "WC") return false;

  return referralIndex === 0 && clientIndex % 4 === 0;
}

function getFollowUpOffset(count) {
  const offsets = [-3, -2, -1, 0, 1, 2, 3, 5, 7, 10];
  return offsets[count % offsets.length];
}

function getReferralCount(status, index) {
  if (status === "ENROLLED") return index % 5 === 0 ? 3 : 2;
  if (status === "WC") return index % 4 === 0 ? 3 : 2;
  if (status === "INACTIVE") return index % 3 === 0 ? 4 : 3;
  if (status === "HOUSED") return index % 2 === 0 ? 5 : 4;

  return 1;
}

async function createNotes(clients, users) {
  const notes = [];

  let noteRemindersCreated = 0;

  clients.forEach(function (client, index) {
    const noteCount = getNoteCount(client.status, index);

    for (let i = 0; i < noteCount; i += 1) {
      const template = NOTE_TEMPLATES[(index + i) % NOTE_TEMPLATES.length];

      const hasReminder =
        noteRemindersCreated < 3 &&
        (client.status === "ENROLLED" || client.status === "WC") &&
        i === 0 &&
        index % 11 === 0;

      if (hasReminder) {
        noteRemindersCreated += 1;
      }

      const isPrivate = template.visibility === "private" || (index + i) % 7 === 0;

      notes.push({
        clientId: client.id,
        authorId: pickUser(users.all, index + i).id,
        title: template.title,
        content: `${template.content} (${client.firstName} ${client.lastName})`,
        setReminder: hasReminder,
        reminderAt: hasReminder ? daysFromNow(2 + noteRemindersCreated) : null,
        completed: client.status === "INACTIVE" && i === noteCount - 1,
        visibility: isPrivate ? "private" : "public",
      });
    }
  });

  notes.push(
    {
      clientId: null,
      authorId: users.admin.id,
      title: "Staff reminder",
      content: "Review active referrals before morning handoff and confirm the highest-priority items only.",
      setReminder: true,
      reminderAt: daysFromNow(1),
      visibility: "public",
    },
    {
      clientId: null,
      authorId: users.manager.id,
      title: "CSV upload check",
      content: "Verify nightly stay sheet imported correctly before using stayed overnight filter.",
      setReminder: false,
      visibility: "public",
    },
    {
      clientId: null,
      authorId: users.staff.id,
      title: "Data cleanup",
      content: "Review possible duplicate clients and unmatched CSV rows later this week.",
      setReminder: false,
      visibility: "private",
    },
    {
      clientId: null,
      authorId: users.manager.id,
      title: "Archived referrals review",
      content: "Review completed and closed referrals for reporting accuracy before monthly export.",
      setReminder: false,
      visibility: "public",
    }
  );

  await prisma.note.createMany({
    data: notes,
  });
}

function getNoteCount(status, index) {
  if (status === "ENROLLED") return index % 3 === 0 ? 3 : 2;
  if (status === "WC") return 2;
  if (status === "INACTIVE") return index % 4 === 0 ? 2 : 1;
  if (status === "HOUSED") return 2;

  return 1;
}

async function createNotifications() {
  await prisma.notification.createMany({
    data: [
      {
        type: "CSV_UPLOAD",
        message: "Nightly stay sheet processed successfully.",
        data: {
          processed: 85,
          matchedClients: 73,
          unmatchedClients: 12,
        },
        read: false,
      },
      {
        type: "PRIORITY_REFERRAL",
        message: "4 urgent cases need attention before next handoff.",
        data: {
          count: 4,
        },
        read: false,
      },
      {
        type: "FOLLOW_UP",
        message: "10 follow-ups are overdue or due soon.",
        data: {
          overdue: 4,
          dueSoon: 6,
        },
        read: false,
      },
      {
        type: "CLIENT_STATUS",
        message: "Recent client status changes include housed and inactive updates.",
        data: {
          housedThisMonth: 7,
          inactiveThisMonth: 11,
        },
        read: true,
      },
    ],
  });
}

function makeInitialsAvatar(name) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;
}

function pick(items, index) {
  return items[index % items.length];
}

function pickUser(users, index) {
  return users[index % users.length];
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