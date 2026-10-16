import dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"
import listEndpoints from "express-list-endpoints";
import boom from "@hapi/boom"
import s3 from "./src/config/bucket.js"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from "./src/config/bucket.js";
import * as Helpers from "./src/utils/helpers.js";

import fs, { appendFileSync } from "fs";
// import router from "./src/routes/index.js"

import database from "./src/config/database.js"
import { decodeToken, generateUUID, getApplicationURL, getEmailServiceProvider } from "./src/utils/helpers.js"
import { InstitutePermissions } from "./src/models/Administration/Roles_And_Permissions/index.js"
import { getAllUsers, getProfile, loginUser, logoutUser, registerUser, verifyUser } from "./src/controllers/Developer/index.js"
import authMiddleware from "./src/middlewares/Developer/index.js"
import { MongoClient } from "mongodb"
import Upload from "./src/models/fileUpload/fileUpload.js"
import { fileUplaodController, MutiplefileUplaodController } from "./src/controllers/upload/index.js"
import { createInstituteFeature, createInstitutePermissions, createInstituteRole, createPlatformFeature, createPlatformPermissions, createPlatformRole, deleteInstituteFeatureById, deleteInstitutePermissionWithId, deleteInstituteRolesWithUUID, deletePermissionWithRoleId, deletePlatformFeatureById, deletePlatformRoleWithUUID, getAllInstituteFeatures, getAllPlatformFeatures, getAllPlatformRoles, getInstitutePermissionWithId, getInstituteRoles, getPlatformRolePermissionWithUUID, updateInstituteFeatureById, updateInstitutePermissionWithId, updateInstituteRolesWithUUID, updatePlatformFeatureById, updatePlatformPermissionsWithId, updatePlatformRoleWithUUID } from "./src/controllers/Administration/Roles_And_Permissions/index.js"
import { getUserActivityLogs } from "./src/controllers/ActivityLogs/index.js"
import  errorHandler from "./src/middlewares/LogError/Log_Error.js"
import './src/config/database.js'; // Ensure this is imported to connect to the database
import hbs from "hbs"
import { type } from "os"
import { title } from "process"



import ApiDetail from "./src/models/ApiDetails.js"
// import api from "./src/models/api.js"
 //import NotificationModel from "./src/models/Institutes/Notification/notificationSubscription.js"
 import { sendWelcomeTemplate } from "./src/utils/index.js"
 import { sendTemproaryPasswordEmail } from "./src/utils/helpers.js"
 // import multer from "multer"


import { GetMockMail } from "./src/controllers/MockMailViews.js"
import { logMiddleware,apiLogs } from "./src/middlewares/logger.js";

import sendingEmail from "./src/routes/Administration/Authorization/index.js"

import fileRoutes from "./src/routes/Administration/Authorization/index.js";

import offers from"./src/routes/Administration/offers/index.js";

hbs.registerHelper("eq", (a, b) => a === b);


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);
const staticFilesPath = path.join(__dirname, 'public/uploads');

import {rateLimit} from "express-rate-limit"

const limiter = rateLimit({
  windowMs:5 * 60 * 1000,
  limit:100,
  standardHeaders: 'draft-8',
  legacyHeaders: false, 
  message:{status:"failed",message:"try again after a few minutes"}
})

dotenv.config()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan('combined'))
app.use(cors())
app.use(cors({origin:["http://localhost:5173","http://localhost:5174","https://learning-management-system-project.emern.netlify.app","https://eflow-user-web.netlify.app"," https://eflow-user-pannel.netlify.app"," https://eflow-instructor-pannel.netlify.app","https://eflow-institutemanagement-admin-pannel.netlify.app","https://eflow-masteradmin.netlify.app"]}))

app.use(logMiddleware);
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine','hbs')
// app.use(limiter)


app.get('/email',GetMockMail)

app.use(express.static( path.join(__dirname, 'public')))
console.log("dirName",__dirname,"dirname",path.join(__dirname, 'public'))

app.use((req, res, next) => {
  res.locals.startTime = Date.now(); // Capture request time
  next();
});



app.post("/api/data", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required!" });
  }

  res.status(201).json({
      message: "Data received successfully!",
      data: { name, email },
  });
});


app.use("/toStaffAndStudent",sendingEmail);

app.use("/api/files", fileRoutes);

app.use("/api/offers",offers);

 const postManCollection=JSON.parse(
  fs.readFileSync(path.join(__dirname,"postman-collection.json"),"utf-8")
);

hbs.registerHelper('neq', function (v1, v2) {
  return v1 != v2;
});

hbs.registerHelper('json', function (context) {
  return JSON.stringify(context, null, 2);
});


hbs.registerHelper('unique', function (array, key) {
  const seen = new Set();
  return array.filter(item => {
      if (seen.has(item[key])) {
          return false;
      }
      seen.add(item[key]);
      return true;
  });
});
const extractEndpoints = (items,parentNames=[]) => {
  const endpoints = [];

  items.forEach((item) => {
    const currentPath=[...parentNames,item.name || 'Unnamed API'];
    
    if (item.request) {
      const {method, body, header, url } = item.request;
      endpoints.push({
        name: currentPath.join(' > '),
        method: method || 'No method specified',
        route: url?.raw?.replace('{{baseUrl}}', '/api') || 'No URL',
        description: item.description || 'No description available',
        groups:parentNames[0],
        category: parentNames[1] || 'Uncategorized',
        subcategory: parentNames[2] || 'Uncategorized',
        urlParams: url?.path || [],
        headers: header || [],
        params: url?.query || [], 
        body: body?.raw || 'No body specified',
        requestBody: body?.raw || 'No body specified',
        response: item.response?.[0]?.body || 'No response available',
        responseToken: item.response?.[0]?.header?.find((h) => h.key === 'Authorization')?.value || 'No token',
      });
    }
    

     if (item.item) {
     endpoints.push(...extractEndpoints(item.item, currentPath)); 
     }
  });

  return endpoints
};


app.get('/api_doc',async (req, res) => {
  try{


const endpoints = extractEndpoints(postManCollection.item);
const   combinedEndpoints = [...endpoints];

res.render('API_doc', { title: 'eflow API Docs', endpoints:combinedEndpoints });

  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Failed to fetch API documentation." });
  }

});

app.get('/api_edit',async (req, res) => {
  try{
    // const apiData=await ApiDetail.find();


const endpoints = extractEndpoints(postManCollection.item);
const   combinedEndpoints = [...endpoints];

res.render('API_doc', { title: 'eflow API Docs', endpoints:combinedEndpoints });

  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Failed to fetch API documentation." });
  }

});

app.get('/api_doc/overview', async (req, res) => {
  try{
    res.render('API_OVERVIEW', { title: 'eflow API Docs' });
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Failed to fetch API overview documentation." });
    
  }

});



//  app.get('/api_data',async (req,res) => {
//   try{ 
//     const data =await ApiDetail.find();
//     res.render('API_DATA', {data});
//    }catch(err){
//     res.status(500).json({ message: err.message});
//   }
// })

app.get("/api/users", (req, res) => {
  const response = { users: [{ id: 1, name: "John Doe" }] };

  // Log request and response
  apiLogs.unshift({
    method: req.method,
    endpoint: req.originalUrl,
    status: "success",
    message: "API call successful",
    responseBody: response,
    requestBody: null,
    timestamp: new Date().toISOString(),
  });

  res.json(response);
});



app.use((err, req, res, next) => {
  apiLogs.unshift({
    method: req.method,
    endpoint: req.originalUrl,
    status: "error",
    message: err.message || "API call failed",
    responseBody: null,
    requestBody: req.body,
    timestamp: new Date().toLocaleString(),
  });

  res.status(500).json({ error: "Something went wrong" });
});






const JSON_FILE = "postman-collection.json";



// ✅ Function to Read JSON File
const readJsonFile = () => {
    try {
        const data = fs.readFileSync(JSON_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("❌ Error reading JSON file:", error);
        return null;
    }
};

// ✅ Function to Write JSON File
const writeJsonFile = (data) => {
    try {
        fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error("❌ Error writing JSON file:", error);
    }
};

// ✅ Recursive Function to Find & Update an Endpoint
const updateEndpointInJson = (items, id, updatedData) => {
    for (let item of items) {
        if (item.id === id) {
            // Update found endpoint
            item.name = updatedData.name;
            item.request.method = updatedData.method;
            item.request.url.raw = updatedData.route;
            return true; // Stop further search
        }
        
        // If "item" contains sub-items, search recursively
        if (item.item && Array.isArray(item.item)) {
            const found = updateEndpointInJson(item.item, id, updatedData);
            if (found) return true;
        }
    }
    return false;
};

// ✅ PUT Route to Update an API Endpoint
app.put("/api_edit/update-endpoint/:id", (req, res) => {
    const { id } = req.params;
    const { name, method, route } = req.body;

    let jsonData = readJsonFile();
    if (!jsonData) return res.status(500).json({ error: "❌ Could not read JSON file" });

    // Find & update the endpoint
    const updated = updateEndpointInJson(jsonData.item, id, { name, method, route });

    if (!updated) {
        return res.status(404).json({ error: "❌ Endpoint not found" });
    }

    writeJsonFile(jsonData);
    res.json({ message: "✅ Endpoint updated successfully!" });
});




const filePath = "postman-collection.json";

// Read JSON file
const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
        console.error("Error reading JSON file:", err);
        return { item: [] };
    }
};

// Write JSON file
const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

// **UPDATE (Edit a specific request by name)**
app.put("/update/:requestName", (req, res) => {
    let data = readData();
    const { requestName } = req.params;
    const updatedData = req.body;

    let updated = false;

    console.log(`🔍 Searching for: ${requestName}`);

    // Traverse nested JSON to find and update the correct request
    console.log("DEBUG: data.item", data.item);

    data.item?.forEach((institute) => {
        
    
        institute.item?.forEach((admin) => {
           
            admin.item?.forEach((student) => {
               
    
                student.item?.forEach((request) => {
                    console.log(`Checking: ${request.name}`); // Debugging

                    if (request.name === requestName) {
                        console.log(`✅ Found: ${requestName}, updating now...`);
                        Object.assign(request.request, updatedData);
                        updated = true;
                    }
                });
            });
        });
    });

    if (!updated) {
        console.log(`❌ Request ${requestName} not found!`);
        return res.status(404).json({ message: `Request ${requestName} not found` });
    }

    writeData(data);
    res.json({ message: `Request ${requestName} updated successfully`, updatedData });

    
const filePath = path.join(__dirname, 'postman-collection.json');

// Convert object back to JSON and write to file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Data successfully updated in data.json');
});






const determineContentType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'application/pdf';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        default:
            return 'application/octet-stream'; 
    }
};

app.get("/staticfiles/eflow/:key", async (req, res) => {
    const { key } = req.params;
    const Key = "staticfiles/eflow/" + key;

  
    const params = {
      Bucket: process.env.bucket_name,
      Key: Key,
    };
  
    try {
      const command = new GetObjectCommand(params);
      const response = await s3.send(command);
  
      const contentType = determineContentType(key);
      res.set("Content-Type", contentType);
  
      response.Body.pipe(res);
    } catch (err) {
      console.error("Error fetching file from S3:", err);
      res.status(500).send("Error fetching file from S3");
    }
  });
  
  app.get("/main/:key", async (req, res) => {
    const { key } = req.params;
    const Key = "main/" + key;
  
    const params = {
      Bucket: process.env.bucket_name,
      Key: Key,
    };
  
    try {
      const command = new GetObjectCommand(params);
      const response = await s3.send(command);
  
      const contentType = determineContentType(key);
      res.set("Content-Type", contentType);
  
      response.Body.pipe(res);
    } catch (err) {
      console.error("Error fetching file from S3:", err);
      res.status(500).send("Error fetching file from S3");
    }
});

function countEndpoints(endpoints) {
  const counts = {};
  let total = 0;
  
  for (const category in endpoints) {
    if (endpoints.hasOwnProperty(category)) {
      counts[category] = endpoints[category].length;
      total += endpoints[category].length;
    }
  }
  counts.total = total;
  return counts;
}


app.get("/", async (req, res) => {
    const endpoints = listEndpoints(app);
    const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
        const route = endpoint.path.split("/")[2]; 
        if (!acc[route]) {
            acc[route] = [];
        }
        acc[route].push(endpoint);
        return acc;
    }, {});
    console.log("Total EndPoints :",countEndpoints(groupedEndpoints).total)
    // await sendWelcomeTemplate("ravichan997@gmail.com",{ email: "chandran.project.emern@gmail.com", password: 'Wecandoit@2024', name: "chandran"})
    res.render('welcome', { name : "eflow", groupedEndpoints,currentYear: new Date().getFullYear() });
});



app.get("/api/Logs", (req, res) => {
  res.render("API_data", { logs: apiLogs });
});




app.get("/api_docspage", (req, res) => {
  const endpoints = listEndpoints(app);
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const category = endpoint.path.split("/")[1]; 
    if (!acc[category]) acc[category] = [];
    acc[category].push(endpoint);
    return acc;
  }, {});

  res.render("api_docs", { title: "eflow API Docs", groupedEndpoints });
});


// hbs.registerHelper('json', function(context) {
//   return JSON.stringify(context);
// });

// app.get("/api_doc", (req, res) => {
//   const endpoints = listEndpoints(app);
//   const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
//     const category = endpoint.path.split("/")[2];
//     if (!acc[category]) acc[category] = [];

//     // Assuming endpoint has metadata for request parameters and responses
//     const requestParameters = endpoint.requestParameters || [
//       { name: "No parameters", type: "N/A", required: "N/A", description: "N/A" },];
//     const response = endpoint.response || {
//       status: "N/A",
//       description: "N/A",
//       body: "N/A"
//   };
//  const requestheaders = endpoint.requestheaders || [];

//     acc[category].push({
//       apiName: endpoint.path.split("/")[3] || "Unnamed API",
//       method: endpoint.methods.join(", "),
//       endpoint: endpoint.path,
//       description: endpoint.description || "No description available.",
//       requestParameters: requestParameters.map(param => ({
//         name: param.name,
//         type: param.type,
//         required: param.required,
//         description: param.description
//       })),
//       response: response, 
//       requestheaders: requestheaders.map(params => ({
//         name: params.name,
//         type: params.type,
//         required: params.required,
//         description: params.description
//       }))
//     });

//     return acc;
//   }, {});

//   res.render("API_doc", { title: "eflow API Docs", groupedEndpoints });
// });

app.get("/admin",async(req,res) => {
    const token = req.headers["authorization"]
    const { cookie } = req.headers
    let cookies = {};
    
    // Parse the cookie header if it exists
    if (cookie) {
        // Split the cookie string by '; ' to get individual key-value pairs
        cookie.split(';').forEach(cookie => {
            let [name, value] = cookie.split('=');  
            cookies[name.trim()] = value;
        });
    }
    console.log(token,req.headers,cookie,typeof(cookie),cookies)
    res.cookie("success","never fails")
    if(cookies.token){
        res.render('admin/index')
    }else{
        res.render('admin/login')
    }
    
})

app.post("/login",async(req,res) => {
    console.log(req.body,"body")
    res.redirect('/admin')
})


export default app;





