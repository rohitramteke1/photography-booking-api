// seedData.js
const { BatchWriteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const ddbDocClient = require('../db/db');

const PHOTOGRAPHY_SERVICES_TABLE = process.env.PHOTOGRAPHY_SERVICES_TABLE || 'PhotographyServices';
const ADDITIONAL_SERVICES_TABLE = process.env.ADDITIONAL_SERVICES_TABLE || 'AdditionalServices';

console.log(PHOTOGRAPHY_SERVICES_TABLE);
// Sample photography services
const photographyServices = [
    {
        name: 'Wedding Photography - Standard Package',
        description: 'Complete coverage of your wedding day including ceremony and reception. Includes edited digital photos.',
        category: 'wedding',
        basePrice: 1500,
        duration: 6
    },
    {
        name: 'Wedding Photography - Premium Package',
        description: 'Extended coverage of your wedding day including preparation, ceremony, and reception. Includes edited digital photos and a photo album.',
        category: 'wedding',
        basePrice: 2500,
        duration: 10
    },
    {
        name: 'Baby Shower Photography',
        description: 'Capture all the special moments of your baby shower celebration.',
        category: 'baby shower',
        basePrice: 500,
        duration: 3
    },
    {
        name: 'Product Photography - Basic',
        description: 'Professional product photography for e-commerce or catalogs. Includes 10 products with 3 angles each.',
        category: 'product',
        basePrice: 400,
        duration: 4
    },
    {
        name: 'Event Coverage - Standard',
        description: 'Photography services for corporate events, parties, or gatherings.',
        category: 'event',
        basePrice: 800,
        duration: 4
    },
    {
        name: 'Portrait Session',
        description: 'Professional portrait photography session for individuals or families.',
        category: 'portrait',
        basePrice: 300,
        duration: 2
    }
];

// Sample additional services
const additionalServices = [
    {
        name: 'Drone Photography',
        description: 'Aerial photography to capture unique perspectives of your event.',
        price: 350
    },
    {
        name: 'Extra Hour Coverage',
        description: 'Additional hour of photography services.',
        price: 150
    },
    {
        name: 'Raw Files Delivery',
        description: 'Get all the unedited raw files from your session.',
        price: 200
    },
    {
        name: 'Printed Photo Album',
        description: 'Premium printed photo album with 30 pages of your best photos.',
        price: 300
    },
    {
        name: 'Second Photographer',
        description: 'Additional photographer to cover your event from different angles.',
        price: 400
    },
    {
        name: 'Express Delivery',
        description: 'Get your edited photos within 3 days.',
        price: 150
    }
];

// ----------- DynamoDB Import -----------

const importData = async () => {
    try {
        // Clear tables first
        await clearTable(PHOTOGRAPHY_SERVICES_TABLE);
        await clearTable(ADDITIONAL_SERVICES_TABLE);

        // Add IDs and insert data
        await batchWriteItems(
            PHOTOGRAPHY_SERVICES_TABLE,
            photographyServices.map(s => ({ ...s, id: uuidv4() }))
        );
        await batchWriteItems(
            ADDITIONAL_SERVICES_TABLE,
            additionalServices.map(s => ({ ...s, id: uuidv4() }))
        );

        console.log('Data imported successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await clearTable(PHOTOGRAPHY_SERVICES_TABLE);
        await clearTable(ADDITIONAL_SERVICES_TABLE);
        console.log('Data destroyed successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// ----------- Helpers -----------

async function batchWriteItems(tableName, items) {
    // DynamoDB batch write = 25 items per batch
    const batches = [];
    for (let i = 0; i < items.length; i += 25) {
        batches.push(items.slice(i, i + 25));
    }
    for (const batch of batches) {
        await ddbDocClient.send(new BatchWriteCommand({
            RequestItems: {
                [tableName]: batch.map(Item => ({ PutRequest: { Item } }))
            }
        }));
    }
}

async function clearTable(tableName) {
    // Scan and delete all items (in 25s)
    let items = [];
    let ExclusiveStartKey;
    do {
        const { Items, LastEvaluatedKey } = await ddbDocClient.send(new ScanCommand({
            TableName: tableName,
            ExclusiveStartKey
        }));
        if (Items) items.push(...Items);
        ExclusiveStartKey = LastEvaluatedKey;
    } while (ExclusiveStartKey);

    for (let i = 0; i < items.length; i += 25) {
        const batch = items.slice(i, i + 25);
        await ddbDocClient.send(new BatchWriteCommand({
            RequestItems: {
                [tableName]: batch.map(({ id }) => ({
                    DeleteRequest: { Key: { id } }
                }))
            }
        }));
    }
}

// ----------- CLI handler -----------
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please provide proper command: -i (import) or -d (delete)');
    process.exit();
}
