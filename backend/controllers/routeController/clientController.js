const Router = require("express");
const { prisma } = require("../../db/prismaClient.js");

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

  notes: {
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
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

    // Update clients past outtake date to INACTIVE
    const expiredClients = await prisma.client.findMany({
      where: {
        outtakeDate: {
          lte: now,
        },
        status: "ENROLLED",
      },
    });

    const validClients = await prisma.client.findMany({
      where: {
        outtakeDate: {
          gte: now,
        },
        status: "ENROLLED",
      },
    });

    await Promise.all([
      ...expiredClients
        .filter((client) => client.outtakeDate)
        .map((client) => {
          return prisma.enrollmentDates.upsert({
            where: {
              clientId_date_type: {
                clientId: client.id,
                date: client.outtakeDate,
                type: "exit",
              },
            },
            update: {
              type: "exit",
            },
            create: {
              clientId: client.id,
              date: client.outtakeDate,
              type: "exit",
            },
          });
        }),

      ...validClients
        .filter((client) => client.intakeDate)
        .map((client) => {
          return prisma.enrollmentDates.upsert({
            where: {
              clientId_date_type: {
                clientId: client.id,
                date: client.intakeDate,
                type: "enroll",
              },
            },
            update: {
              type: "enroll",
            },
            create: {
              clientId: client.id,
              date: client.intakeDate,
              type: "enroll",
            },
          });
        }),
    ]);

    await prisma.client.updateMany({
      where: {
        id: {
          in: expiredClients.map((client) => client.id),
        },
      },
      data: {
        status: "INACTIVE",
      },
    });

    await prisma.client.updateMany({
      where: {
        lastStayDate: {
          lte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        },
        hereLastNight: true,
      },
      data: {
        hereLastNight: false,
      },
    });

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
    } else {
      clients = await prisma.client.findMany({
        where: {
          status: filter && filter !== "ALL" ? filter : "ENROLLED",
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

async function getClientById(req, res, next) {

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.clientId) },
      include: clientInclude,
    });


    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.json(client);

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

async function updateClient(req, res, next) {
  try {
    const updatedClient = await prisma.client.update({
      where: { id: parseInt(req.params.clientId) },
      data: { 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        intakeDate: req.body?.intakeDate || new Date(), // "2023-05-21" pass in that format from client side
        priorityNeed: req.body.priorityNeed,
        gender: req.body.gender,
        bedLabel: req.body.bedLabel,
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
    getClients, getClientStats, getClientById, createClient, updateClient, deleteClient, handleUploadFile
  }
};