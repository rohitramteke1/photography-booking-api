// src/models/photographyService.model.js
const { PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../db/db");
const TABLE_NAME = process.env.DYNAMODB_PHOTOGRAPHY_SERVICES_TABLE || "PhotographyServices";

// Create new photography service
async function createPhotographyService(data) {
    const service = { id: uuidv4(), ...data };
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: service }));
    return service;
}

// Get all photography services
async function findAllPhotographyServices() {
    const result = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return result.Items || [];
}

// Get photography service by id (uses id-index GSI)
async function findPhotographyServiceById(id) {
    const result = await ddbDocClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "id-index",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id },
    }));
    return result.Items && result.Items[0];
}

// Update photography service by id
async function updatePhotographyService(id, updates) {
    let UpdateExpression = "set";
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    let prefix = " ";
    for (const key in updates) {
        UpdateExpression += `${prefix}#${key} = :${key}`;
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = updates[key];
        prefix = ", ";
    }

    const service = await findPhotographyServiceById(id);
    if (!service) throw new Error("Service not found");
    const params = {
        TableName: TABLE_NAME,
        Key: { id: service.id },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };

    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
}

// Delete photography service by id
async function deletePhotographyService(id) {
    const service = await findPhotographyServiceById(id);
    if (!service) throw new Error("Service not found");
    await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: service.id } }));
    return true;
}

module.exports = {
    createPhotographyService,
    findAllPhotographyServices,
    findPhotographyServiceById,
    updatePhotographyService,
    deletePhotographyService,
};
