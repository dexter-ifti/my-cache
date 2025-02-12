const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My Cache API',
        description: 'This is a simple cache API using Redis and Prisma',
    },
    host: 'my-cache-r4kn.onrender.com'
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);