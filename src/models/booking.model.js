// src/models/booking.model.js
const { PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../db/db");
const TABLE_NAME = process.env.DYNAMODB_BOOKINGS_TABLE || "Bookings";

// Create new booking
async function createBooking(data) {
    const booking = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: booking }));
    return booking;
}

// Get all bookings
async function findAllBookings() {
    const result = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return result.Items || [];
}

// Get booking by id (uses id-index GSI)
async function findBookingById(id) {
    const result = await ddbDocClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "id-index", // Make sure you have a GSI on 'id'
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": id },
    }));
    return result.Items && result.Items[0];
}

// Update booking by id
async function updateBooking(id, updates) {
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

    // Find booking by id (to get PK)
    const booking = await findBookingById(id);
    if (!booking) throw new Error("Booking not found");
    const params = {
        TableName: TABLE_NAME,
        Key: { id: booking.id }, // Change PK as per your table design
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };

    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
}

// Delete booking by id
async function deleteBooking(id) {
    const booking = await findBookingById(id);
    if (!booking) throw new Error("Booking not found");
    await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: booking.id } }));
    return true;
}

module.exports = {
    createBooking,
    findAllBookings,
    findBookingById,
    updateBooking,
    deleteBooking,
};
