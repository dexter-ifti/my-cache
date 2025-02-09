const { PrismaClient } = require('@prisma/client');
const { setCache } = require('./cache');

const prisma = new PrismaClient();

// Function to generate random string
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Function to generate dummy data
const generateDummyData = async (numEntries) => {
    for (let i = 0; i < numEntries; i++) {
        const key = `key_${generateRandomString(5)}`;
        const value = `value_${generateRandomString(10)}`;

        // Store in PostgreSQL
        await prisma.cache.create({
            data: { key, value },
        });

        // Store in Redis
        setCache(key, value);

        console.log(`Stored: ${key} -> ${value}`);
    }

    console.log('Dummy data generation complete.');
};

// Generate 10 dummy entries
generateDummyData(10)
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
