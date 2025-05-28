const {
    PutCommand,
    GetCommand,
    QueryCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../db/db");

const TABLE_NAME = process.env.DYNAMODB_TABLE;

// Create new user
async function createUser({ firstName, lastName, email, password, role }) {
    const user = {
        id: uuidv4(),
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        role,
    };

    const params = {
        TableName: TABLE_NAME,
        Item: user,
    };

    await ddbDocClient.send(new PutCommand(params));
    return user;
}

// Find user by email (primary partition key)
async function findUserByEmail(email) {
    const params = {
        TableName: TABLE_NAME,
        Key: { email },
    };

    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
}

// Find user by id (GSI)
async function findUserById(id) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: "id-index",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id },
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items && result.Items[0];
}

// Only one update function needed now!
async function updateUserProfile(id, updates) {
    const user = await findUserById(id);
    if (!user) return null;

    let UpdateExpression = 'set';
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    let prefix = ' ';
    for (const key in updates) {
        UpdateExpression += `${prefix}#${key} = :${key}`;
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = updates[key];
        prefix = ', ';
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { email: user.email },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    };

    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
}

// Delete user by id (using GSI, get email first)
async function deleteUserById(id) {
    const user = await findUserById(id);
    if (!user) throw new Error("User not found");
    const params = {
        TableName: TABLE_NAME,
        Key: { email: user.email },
    };
    await ddbDocClient.send(new DeleteCommand(params));
    return true;
}

// Find all users (without password)
async function findAllUsers() {
    const params = { TableName: TABLE_NAME };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserProfile,
    deleteUserById,
    findAllUsers,
};
