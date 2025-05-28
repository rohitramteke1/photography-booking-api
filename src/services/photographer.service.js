// src/services/photographer.service.js

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'Photographers'; // use your table name

exports.getAllPhotographers = async () => {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const result = await docClient.send(command);
  return result.Items || [];
};

exports.getPhotographerById = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  });
  const result = await docClient.send(command);
  return result.Item;
};

exports.createPhotographer = async (data) => {
  const item = { ...data, id: crypto.randomUUID() }; // Add id if not present
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  });
  await docClient.send(command);
  return item;
};

// Add update, delete, etc., similarly
