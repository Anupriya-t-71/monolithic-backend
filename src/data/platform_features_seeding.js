import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
  const genUUID = uuidv4();
  return genUUID;
};

const features = [{
 
    "id": 6,
    "identity": "faq",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
   
    "id": 9,
    "identity": "faq-category",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    
    "id": 8,
    "identity": "roles",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    
    "id": 14,
    "identity": "feature",
    "description": null,
    "is_active": true,
    "is_delete": false
    
  },
  {
   
    "id": 15,
    "identity": "permissions",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  
  },
  {
   
    "id": 2,
    "identity": "institute",
    "description": null,
    "is_active": true,
    "is_delete": false
  
  },
  {
    
    "id": 11,
    "identity": "ticket",
    "description": null,
    "is_active": true,
    "is_delete": false
  
  },
  {
   
    "id": 10,
    "identity": "subscription-payments",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    
    "id": 3,
    "identity": "subscription-plans",
    "description": null,
    "is_active": true,
    "is_delete": false
  
  },
  {
   
    "id": 7,
    "identity": "institute-admin",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    
    "id": 13,
    "identity": "chat",
    "description": null,
    "is_active": true,
    "is_delete": false
  
  },
  {
    
    "id": 1,
    "identity": "subscription-features",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    "id": 4,
    "identity": "institute-primary-branch",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    
    "id": 5,
    "identity": "users",
    "description": null,
    "is_active": true,
    "is_delete": false
   
  },
  {
    
    "id": 12,
    "identity": "notification",
    "description": null,
    "is_active": true,
    "is_delete": false
  
  },
  {
    
    "identity": "institute_all",
    "description": null,
    "is_active": true,
    "is_delete": false,
    "id": 31,
    "__v": 0
  },
  {
    
    "description": null,
    "is_active": true,
    "is_delete": false,
    "id": 32,
    "identity": "institute-branches"
  }
  
  ]

  const test = async function(roles) {
    const platform_features_seeding = []; 
  
    for (const role of roles) {
      const uuid = await generateUUID(); 
      platform_features_seeding.push({ ...role, uuid }); 
    }
  
    return platform_features_seeding; 
  };
  
  const platform_features_seeding = await test(features); 
  
  
  
  export default platform_features_seeding; 
  