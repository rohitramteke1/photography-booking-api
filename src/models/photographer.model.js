const { PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../db/db");
const TABLE_NAME = process.env.DYNAMODB_TABLE || "PhotographyUsers";

// Create new photographer (no photographer role needed)
async function createPhotographer(data) {
    const photographer = {
        id: uuidv4(),
        ...data,
        image: data.image || 'default-profile.jpg',
        rating: data.rating || 5.0,
        reviews: data.reviews || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date().toISOString()
        // role field only if you explicitly set role: 'admin'
    };
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: photographer }));
    return photographer;
}

// Get all photographers (optionally filter out admins if present)
async function findAllPhotographers() {
    const result = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    // If you want to filter out admin accounts from public listings:
    return (result.Items || []).filter(item => !item.role || item.role !== 'admin');
    // If you want truly ALL records, just return result.Items || [];
}

// Get photographer by id (using GSI)
async function findPhotographerById(id) {
    const result = await ddbDocClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "id-index", // GSI on 'id'
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id }
    }));
    return result.Items && result.Items[0];
}

// Update photographer by id
async function updatePhotographer(id, updates) {
    const photographer = await findPhotographerById(id);
    if (!photographer) return null;
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
    const params = {
        TableName: TABLE_NAME,
        Key: { id: photographer.id },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    };
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
}

// Delete photographer by id
async function deletePhotographer(id) {
    const photographer = await findPhotographerById(id);
    if (!photographer) return null;
    await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: photographer.id } }));
    return true;
}

module.exports = {
    createPhotographer,
    findAllPhotographers,
    findPhotographerById,
    updatePhotographer,
    deletePhotographer
};
