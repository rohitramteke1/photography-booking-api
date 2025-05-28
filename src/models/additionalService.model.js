const { PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../db/db");
const TABLE_NAME = process.env.DYNAMODB_ADDITIONAL_SERVICES_TABLE || "AdditionalServices";

// Create new additional service
async function createAdditionalService(data) {
    const service = { id: uuidv4(), ...data };
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: service }));
    return service;
}

// Get all additional services
async function findAllAdditionalServices() {
    const result = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return result.Items || [];
}

// Get additional service by id (uses id-index GSI)
async function findAdditionalServiceById(id) {
    const result = await ddbDocClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "id-index", // You need GSI on "id"
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id },
    }));
    return result.Items && result.Items[0];
}

// Update additional service by id
async function updateAdditionalService(id, updates) {
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

    const service = await findAdditionalServiceById(id);
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

// Delete additional service by id
async function deleteAdditionalService(id) {
    const service = await findAdditionalServiceById(id);
    if (!service) throw new Error("Service not found");
    await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: service.id } }));
    return true;
}

module.exports = {
    createAdditionalService,
    findAllAdditionalServices,
    findAdditionalServiceById,
    updateAdditionalService,
    deleteAdditionalService,
};
