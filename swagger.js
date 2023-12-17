const swaggerAutogen = require('swagger-autogen')
require('dotenv').config();

const backendUrl = new URL(process.env.BACKEND_URL);
const host = backendUrl.hostname + (backendUrl.port ? `:${backendUrl.port}` : '');

const doc = {
    info: {
        title: 'moxi',
        description:'Backend API documentation'
    },
    host: host,
    schemas: [backendUrl.protocol.split(':')[0]]
};

const outputFile = './swagger-output.json';
const endpointFiles = ['./app.js']

swaggerAutogen(outputFile,endpointFiles,doc).then(() =>{
    require('./app.js');
});