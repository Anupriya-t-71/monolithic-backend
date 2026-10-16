import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
  const genUUID = uuidv4();
  return genUUID;
};

const features = [{
  
    "id": 2,
    "uuid": "48f37954-1933-47d0-bd2f-66404468aa76",
    "identity": "Admins",
    "description": null
  },
  {
    
    "id": 6,
    "uuid": "d271c6ec-b564-4859-a85f-624297e07633",
    "identity": "Branch",
    "description": null
  
  },
  {
   
    "id": 8,
    "uuid": "19a92542-88e7-4dc5-8a83-72ba9fc3dae6",
    "identity": "Courses",
    "description": null
   
  },
  {
   
    "id": 3,
    "uuid": "0e36f6f2-b068-47d7-b1ae-31e32ccbf611",
    "identity": "Batches",
    "description": null
    
  },
  {
    
    "id": 1,
    "uuid": "e65630f5-a06a-4a12-abf1-203fb9039c95",
    "identity": "Students",
    "description": null
   
  },
  {
    
    "id": 7,
    "uuid": "6b575fcb-da66-43d7-a521-a99753505181",
    "identity": "Teachers",
    "description": null
   
  },
  {
   
    "id": 4,
    "uuid": "bd65bb38-d671-4509-b6c5-c96175fe5dc7",
    "identity": "community-support",
    "description": null
  
  },
  {
    
    "id": 5,
    "uuid": "090d19a4-ff22-47a4-b915-3c3b3dad8345",
    "identity": "customer-support",
    "description": null
   
  },
  {
    
    "id": 9,
    "uuid": "30e48bc9-ff76-44c4-bc8d-2f5c9734bf17",
    "identity": "Staffs",
    "description": null,
    "is_active": true,
    "is_deleted": false
  
  },
  {
    
    "id": 10,
    "uuid": "1dcf93bd-1224-412a-bf9d-1816900f9621",
    "identity": "Classes",
    "description": null,
    "is_active": true,
    "is_deleted": false
   
  
  }]


  
  const test = async function(roles) {
    const subscription_features_seeding = []; 
  
    for (const role of roles) {
      const uuid = await generateUUID(); 
      subscription_features_seeding.push({ ...role, uuid }); 
    }
  
    return subscription_features_seeding; 
  };
  
  const subscription_features_seeding = await test(features); 
  
  
  
  export default subscription_features_seeding; 
  