const express = require('express');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const { getCache, setCahce, deleteCache, getAll, deleteAll } = require('./cache');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Max cache size 
const MAX_CACHE_SIZE = 10;

const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.send('Hello Testing!');
})

//  POST /cache
app.post('/cache', async (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).json({
            error: 'Key and value are required'
        })
    }
    const currentSize = await prisma.cache.count();
    if (currentSize >= MAX_CACHE_SIZE) {
        return res.status(400).json({
            error: 'Cache is full'
        })
    }
    try {
        await prisma.cache.create({
            data: {
                key,
                value
            },
        });
        // redis cache
        setCahce(key, value);
        res.status(201).json({
            message: "key-value pair added to cache"
        })
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({
                error: 'Key already exists'
            })
        } else {
            res.status(500).json({
                error: 'Internal server error'
            })
        }
    }
});

// GET /cache/:key
app.get('/cache/:key', async (req, res) => {
    const { key } = req.params;

    // redis cache
    getCache(key, async (error, result) => {
        if (error) {
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
        if (result) {
            return res.status(200).json({
                key,
                value: result
            });
        }
    })

    const cache = await prisma.cache.findUnique({
        where: {
            key
        },
    });
    if (!cache) {
        return res.status(404).josn({
            error: 'Key not found'
        });
    }
    return res.status(200).json({
        key,
        value: cache.value
    });
})

// get whole cache
// GET /cache
app.get('/cache', async (req, res) => {
    // redis cache
    getAll(async (error, result) => {
        if (error) {
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
        if (result) {
            return res.status(200).json(result);
        }
    });
    const cache = await prisma.cache.findMany({});
    if (cache.length === 0) {
        return res.status(404).json({
            error: 'Cache is empty'
        });
    }
    return res.status(200).json(cache);
})

// DELETE /cache/:key
app.delete('/cache/:key', async (req, res) => {
    const { key } = req.params;
    const cache = await prisma.cache.findUnique({
        where: {
            key
        },
    });
    if (!cache) {
        return res.status(404).json({
            error: 'Key not found'
        })
    } else {

        await prisma.cache.delete({
            where: {
                key
            },
        });
        // redis cache
        deleteCache(key);
        return res.status(204).json({
            message: 'Key deleted'
        });
    }
});

// DELETE /cache
app.delete('/cache', async (req, res) => {
    await prisma.cache.deleteMany({});
    // redis cache
    deleteAll()
    return res.status(204).json({
        message: 'Cache cleared'
    });
});

app.listen(port, () => {
    console.log(`Cache API is running at http://localhost:${port}`);
})