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
import { GetObjectCommand } from "@aws-sdk/client-s3";

// import router from "./src/routes/index.js"

import database from "./src/config/database.js"
import { generateUUID, getApplicationURL, getEmailServiceProvider } from "./src/utils/helpers.js"
import { InstitutePermissions } from "./src/models/Administration/Roles_And_Permissions/index.js"
import NotificationModel from "./src/models/Institutes/Notification/notificationSubscription.js"
import { sendWelcomeTemplate } from "./src/utils/index.js"

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

dotenv.config()
const app =express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(morgan('combined'))
app.use(cors())
app.use(cors({origin:["http://localhost:3000","http://localhost:3002","https://learning-management-system-project.emern.netlify.app","https://eflow-user-web.netlify.app"]}))


app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine','hbs')

app.use(express.static( path.join(__dirname, 'public')))
console.log("dirName",__dirname,"dirname",path.join(__dirname, 'public'))
// app.use("/api",router)

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
        console.log(route)
        if (!acc[route]) {
            acc[route] = [];
        }
        acc[route].push(endpoint);
        return acc;
    }, {});
    const filtered = endpoints.reduce((acc,current) => {
      const data = current.methods.filter((i) => {
        const obj = {
          name: current.path,
          request : {
            method: i
          }
        }
        acc.push(obj)

       })
        return acc
    },[])
    console.log("Total EndPoints :",countEndpoints(groupedEndpoints).total)
    // await sendWelcomeTemplate("ravichan997@gmail.com",{ email: "chandran.project.emern@gmail.com", password: 'Wecandoit@2024', name: "chandran"})
    res.render('welcome', { name : "eflow", groupedEndpoints });
    // res.send(endpoints)
});




app.get("/api_docspage", (req, res) => {
  const endpoints = listEndpoints(app);
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const category = endpoint.path.split("/")[2]; 
    if (!acc[category]) acc[category] = [];
    acc[category].push(endpoint);
    return acc;
  }, {});

  res.render("api_docs", { title: "eflow API Docs", groupedEndpoints });
});


  
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