const Router = require("express");
const { prisma } = require("../../db/prismaClient.js");

async function getClients(req, res, next) {
  try {
    // UPDATE!
    // filter passed in body from search or enrolled/WC, ect.
    const filter = req.body?.filter;
    let clients = null;

    if (filter == undefined) {
      clients = await prisma.client.findMany();
    } else {
      clients = await prisma.client.findMany({
        where: {
          status: filter.status ? filter.status : undefined,
        },
      });
    }

    return clients;
  } catch (error) {
    console.log('failed to get clients');
    return res.status(400).json({ errors:error });
  }
};

async function createClient(req, res, next) {   
  try {
    const newClient = await prisma.client.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        clientId: parseInt(req.body.clientId),
        intakeDate: req.body?.intakeDate || new Date(), // "2023-05-21" pass in that format from client side
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
    getClients, createClient, updateClient, deleteClient, handleUploadFile
  }
};