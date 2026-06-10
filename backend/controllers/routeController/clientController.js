const Router = require("express");
const { prisma } = require("../../db/prismaClient.js");
const { getNotes } = require("./noteController.js");

// getting all referrals made by all admin users 
const clientInclude = {
  referrals: {
  orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },

  EnrollmentDates: {
    orderBy: { date: 'asc' },
  },
};

const { getAllDashboardStats } = require("../../utils.js");

async function getClientStats(req, res, next) {
  const allClients = await prisma.client.findMany({
    include: {
      referrals: {
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  try {
    const stats = getAllDashboardStats(allClients);
    return stats;
  } catch (error) {
    next(error);
  }
}

async function getClients(req, res, next) {
  try {
    const now = new Date();
    const filter = req.query?.filter;

    let clients;

    if (filter === "STAYED_OVERNIGHT") {
      const pastWindow = new Date(now.getTime() - 32 * 60 * 60 * 1000);

      clients = await prisma.client.findMany({
        where: {
          lastStayDate: {
            gte: pastWindow,
            lte: now,
          },
          status: "ENROLLED",
        },
        include: clientInclude,
      });
    } else if (filter && filter !== "ALL") {
      clients = await prisma.client.findMany({
        where: {
          status: filter && filter !== "ALL" ? filter : "ENROLLED",
        },
        include: clientInclude,
      });
    } else if (filter === "ALL") {
      clients = await prisma.client.findMany({
        include: clientInclude,
      });
    } else {
      clients = await prisma.client.findMany({
        where: {
          status: "ENROLLED",
        },
        include: clientInclude,
      }); 
    }

    if (req.query?.filter) {
      return res.json({ clients });
    }

    return clients;
  } catch (error) {
    console.log("failed to get clients", error);
    throw error;
  }
}

// not counting completed or closed referrals
async function getClientsByStatFilter(req, res, next) {
  try {
    const filter = req.query?.filter;

    let clients;

    if (filter === "URGENT") {
      clients = await prisma.client.findMany({
        where: {
          referrals: {
            some: {
              isPriority: true,
              status: {
                notIn: ["COMPLETED", "CLOSED"],
              },
            },
          },
        },
        include: clientInclude,
      });
    } else if (filter === "FOLLOW_UP") {
      clients = await prisma.client.findMany({
        where: {
          referrals: {
            some: {
              followUpDate: {
                not: null,
                gte: new Date(),
              },
              status: {
                notIn: ["COMPLETED", "CLOSED"],
              },
            },
          },
        },
        include: clientInclude,
      });
    } else if (filter === "NEW") {
      clients = await prisma.client.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // last 30 days
          },
          status: "ENROLLED",
        },
        include: clientInclude,
      });
    } else if (filter === "HOUSED") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      clients = await prisma.client.findMany({
        where: {
          status: "HOUSED",
          updatedAt: {
            gte: oneYearAgo,
          },
        },
        include: clientInclude,
      });
    } else if (filter === "ENROLLED") {
      clients = await prisma.client.findMany({
        where: {
          status: "ENROLLED",
        },
        include: clientInclude,
      });
    }

    return res.json(clients);
  } catch (error) {
    console.log("failed to get clients by stat filter", error);
    throw error;
  }
}

const { noteController } = require("./noteController.js");

async function getClientById(req, res, next) {

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.clientId) },
      include: clientInclude,
    });

    const notes = await noteController.getClientNotes(req, res, next);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.json({ client, notes });

  } catch (error) {
    console.error("Error fetching client:", error);
    next(error);
  }
}

async function createClient(req, res, next) {
  const { firstName, lastName, clientId } = req.body; 
  try {
    const newClient = await prisma.client.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        clientId: parseInt(clientId) || undefined, // optional clientId, if not provided, it will auto-increment
        intakeDate: req.body?.intakeDate || new Date(), // "2023-05-21" pass in that format from client side
        outtakeDate: req.body?.outtakeDate || null,
        priorityNeed: req.body?.priorityNeed || null,
        gender: req.body?.gender || null,
        bedLabel: req.body?.bedLabel || null,
        status: req.body?.status || "ENROLLED",
        avatarUrl: makeInitialsAvatar(`${firstName} ${lastName}`),
        // BELOW AS OPTIONAL FIELDS ?
        // phone: req.body.phone,
        // address: req.body.address,
        // city: req.body.city,
        // dob: new Date(req.body.dob), // "1998-05-21" pass in that format from client side
      },
    });

    await prisma.enrollmentDates.create({
      data: {
        clientId: newClient.id,
        date: newClient.intakeDate,
        type: "enroll",
      },
    });
    return res.status(201).json(newClient);
  } catch (error) {
    console.log('failed to create client', error);
    return res.status(400).json({ errors:error });
  }
};

function makeInitialsAvatar(name) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;
}

async function updateClient(req, res, next) {
  try {
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(req.params.clientId) },
      data: { 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        intakeDate: req.body?.intakeDate, // "2023-05-21" pass in that format from client side
        outtakeDate: req.body?.outtakeDate || req.body?.intakeDate + 90 || null, // default to 90 days after intake if outtake not provided
        priorityNeed: req.body.priorityNeed,
        gender: req.body.gender,
        bedLabel: req.body.bedLabel,
        status: req.body?.status,
        // phone: req.body.phone,
        // address: req.body.address,
        // city: req.body.city,
        // dob: new Date(req.body.dob), // "1998-05-21" pass in that format from client side
      },
    });
    return res.status(200).json(updatedClient);
  } catch (error) {
    console.log('failed to update client');
    return res.status(400).json({ errors:error });
  }
};

async function deleteClient(req, res, next) {
  try {
    await prisma.client.delete({
      where: { id: parseInt(req.params.clientId) },
    });
    return res.status(200).json({ message: "Client Deleted Successfully" });
  } catch (error) {
    console.log('failed to delete client');
    return res.status(400).json({ errors:error });
  }
};

async function updateExtension(req, res, next) {
  try {
    const extStatus = req.body.extensionStatus === 'true' ? true : false;
    const updatedExitDate = req.body.extensionStatus === 'true' ? new Date(req.body.exitDate) : null;
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(req.params.clientId) },
      data: { 
        extensionStatus: extStatus,
        exitDate: updatedExitDate,
      },
    });
    return res.status(200).json(updatedClient);
  } catch (error) {
    console.log('failed to update client extension');
    return res.status(400).json({ errors:error });  
  }
}

async function handleUploadFile(req, res, next) {

  if (req.file == undefined) {
    const err = new Error("No attached file");
    err.status = 400;
    return next(err);
  }

  const filePath = req.file.path;

  console.log(req.file);
  
  try {
    const cloudFileObj = await getCloudinaryObj(filePath);
    console.log(cloudFileObj);

    // ( 1/1/25 Format Formula Conversion)

   return { url: cloudFileObj.url, message: "Avatar uploaded successfully" };

    
  } catch (error) {
    console.error(error);
    // goes to error middleware
    next(error);
  }
};


module.exports = {
  clientController: {
    getClients, getClientsByStatFilter, getClientStats, getClientById, createClient, updateClient, deleteClient, handleUploadFile
  }
};