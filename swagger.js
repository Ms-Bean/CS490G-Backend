const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'MOXI',
        description:'Backend API documentation'
    },
    host: 'localhost:5000',
    schemas: ['http']
};

const outputFile = './swagger-output.json';
const endpointFiles = ['./app.js']

swaggerAutogen(outputFile,endpointFiles,doc).then(() =>{
    require('./app.js');
});