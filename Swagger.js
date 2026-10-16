import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'eflow Testing API',
    version: '1.0.0',
    description: 'API documentation for managing Developer',
  },
  servers: [
    {
      url: 'http://localhost:3002', // Adjust the URL to your server
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        in: 'header',
        name: 'Authorization',
        description: 'Bearer token to access these api endpoints',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, depending on your token format
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [
    './src/routes/Institutes/Batch/index.js',
    './src/routes/Institutes/Branch/index.js',
    './src/routes/Institutes/Certificate/index.js',
    './src/routes/Institutes/Course/Course_Route.js',
    './src/routes/Institutes/Course/Category_Route.js',
    './src/routes/Institutes/Course/Module_Route.js',
    './src/routes/Institutes/Course/Note_Route.js',
    './src/routes/Institutes/Course/Study_Material_Route.js',
    './src/routes/Institutes/Class/Online_Route.js',
    './src/routes/Institutes/Class/Offline_Route.js',
    './src/routes/Institutes/Attendance/Common.js',
    './src/routes/Institutes/Community/Chat_Router.js',
    './src/routes/Institutes/Community/Message_Router.js',
    './src/routes/Institutes/Notification/common.js',
    './src/routes/Institutes/Notification/index.js',
    './src/routes/Institutes/Notification/staff.js',
    './src/routes/Institutes/Notification/student.js',
    './src/routes/Institutes/Ticket/Student.js',
    './src/routes/upload/index.js',
    './src/routes/ActivityLogs/index.js',
    './src/routes/Institutes/Help_Center/index.js',
    './src/routes/Institutes/Administration/Authorization/index.js',
    './src/routes/Institutes/payment/Student_fee.js',
    './src/routes/Institutes/payment/Staff_Salary.js',
    './src/routes/Institutes/Ticket/Teacher.js',
    
  ], // Path to the API specs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default  swaggerSpec
