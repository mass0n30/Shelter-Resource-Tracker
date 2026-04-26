const Router = require("express");
const { prisma } = require("../../db/prismaClient.js");

const clientInclude = {
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

  notes: {
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
};

async function getClients(req, res, next) {
  try {
    let clients = null;
    const now = new Date();
    const filter = req.query?.filter;

    // use Scheduled Cron instead of get Request ??
    // upating clients that are passed outtakeData to INACTIVE, so they are not included in the stayed overnight query return, and to maintain accurate client status in the system
    await prisma.client.updateMany({
      where: {
        outtakeDate: {
          lte: now, 
        },
      },
      data: {
        status: "INACTIVE",
      },
    });

    // for Stayed over night clients, updated by CSV pipeline and db query everyday
    if (filter === "STAYED_OVERNIGHT") {
      // past 32 hours to account for clients who stayed overnight and were updated by the CSV pipeline, which runs at 8am daily, so captures stays from 4pm the previous day to 4pm the current day
      const pastWindow = new Date(now.getTime() - 32 * 60 * 60 * 1000);

      const clients = await prisma.client.findMany({
        where: {
          intakeDate: {
            gte: pastWindow,
            lte: now,
          },
          include: clientInclude,
          status: "ENROLLED",
        },
      });
      return res.json({ clients });
    }

    // default enrolled client mount return
    if (filter == undefined) {
      clients = await prisma.client.findMany({
        where: {
          status: "ENROLLED",
        },
        include: clientInclude,
      });
    } else {
      // else get by filter 
      clients = await prisma.client.findMany({
        where: {
          status: filter ? filter : undefined,
        },
        include: clientInclude,
      });
    }
    if (req.query?.filter) {
      return res.json({ clients });
    }

    return clients;
  } catch (error) {
    console.log('failed to get clients');
    throw error;
  }
};

async function getClientById(req, res, next) {
  console.log('Getting client by ID:', req.params.clientId);

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.clientId) },
      include: clientInclude,
    });

    return res.json(client);

  } catch (error) {
    console.error("Error fetching client:", error);
    next(error);
  }
}

async function createClient(req, res, next) {   
  try {
    const newClient = await prisma.client.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        clientId: parseInt(req.body.clientId),
        intakeDate: req.body?.intakeDate || new Date(), // "2023-05-21" pass in that format from client side
        outtakeDate: req.body?.outtakeDate || null,
        priorityNeed: req.body.priorityNeed,
        gender: req.body.gender,
        bedLabel: req.body.bedLabel,
        status: req.body.status,
        // phone: req.body.phone,
        // address: req.body.address,
        // city: req.body.city,
        // dob: new Date(req.body.dob), // "1998-05-21" pass in that format from client side
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
    getClients, getClientById, createClient, updateClient, deleteClient, handleUploadFile
  }
};