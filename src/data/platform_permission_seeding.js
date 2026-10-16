import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
  const genUUID = uuidv4();
  return genUUID;
};

const permission = [{
 
    "id": 1,
    "uuid": "e5685433-51e4-4c14-a51d-59d1d2f1b584",
    "identity": "institute",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 9,
    "uuid": "89568f50-4e94-45d6-9569-a4e78855c890",
    "identity": "faq-category",
    "create_permission": {
      "permission": true,
      "code": "can_create_faq-category"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_faq-category"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_faq-category"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_faq-category"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 15,
    "uuid": "0b27e403-a72a-4072-88f4-39e0aaa428bb",
    "identity": "permissions",
    "create_permission": {
      "permission": true,
      "code": "can_create_permissions"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_permissions"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_permissions"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_permissions"
    },
    "urls": [],
    "platform_role": 1
   
  },
  {
   
    "id": 5,
    "uuid": "fd7b0adb-aac6-406f-ac13-4c388f52e76c",
    "identity": "subscription-features",
    "create_permission": {
      "permission": true,
      "code": "can_create_subscription_features"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_subscription_features"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_subscrption_features"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_subscription_features"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
    
    "id": 13,
    "uuid": "52e6d154-e834-4f71-88b7-d81a308418e2",
    "identity": "users",
    "create_permission": {
      "permission": true,
      "code": "can_create_users"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_users"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_users"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_users"
    },
    "urls": [],
    "platform_role": 1
   
  },
  {
    
    "id": 2,
    "uuid": "396f8261-ede7-4ce3-bb0e-85980ddc59ab",
    "identity": "faq",
    "create_permission": {
      "permission": true,
      "code": "can_create_faq"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_faq"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_faq"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_faq"
    },
    "urls": [],
    "platform_role": 1
   
  },
  {
   
    "id": 6,
    "uuid": "37f34f6b-28d3-4b56-b76e-e1641a5d1021",
    "identity": "institute-admin",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute-admin"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute-admin"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute-admin"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute-admin"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 12,
    "uuid": "4cec6b7b-14b6-4eb6-9516-746a2c7a1c88",
    "identity": "roles",
    "create_permission": {
      "permission": true,
      "code": "can_create_roles"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_roles"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_roles"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_roles"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 10,
    "uuid": "272797e8-255d-4392-afc9-f014f7e6fceb",
    "identity": "notification",
    "create_permission": {
      "permission": true,
      "code": "can_create_notification"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_notification"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_notification"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_notification"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 8,
    "uuid": "7ea8651b-585d-4208-a445-9639c65c71d4",
    "identity": "subscription-payments",
    "create_permission": {
      "permission": true,
      "code": "can_create_subscription-payments"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_subscription-payments"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_subscription-payments"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_subscription-payments"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
    
    "id": 3,
    "uuid": "1cfc9e59-61b8-4b08-bc68-2e377ef08362",
    "identity": "subscription-plans",
    "create_permission": {
      "permission": true,
      "code": "can_create_subscription-plans"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_subscription-plans"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_subscription-plans"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_subscription-plans"
    },
    "urls": [],
    "platform_role": 1
   
  },
  {
   
    "id": 7,
    "uuid": "db2fb364-bcca-496a-be81-4959d623e243",
    "identity": "institute-primary-branch",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute-primary-branch"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute-primary-branch"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute-primary-branch"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute-primary-branch"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 4,
    "uuid": "f670c3e4-3a13-41cf-a9a3-1a2722c5a3f1",
    "identity": "ticket",
    "create_permission": {
      "permission": true,
      "code": "can_create_ticket"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_ticket"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_ticket"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_ticket"
    },
    "urls": [],
    "platform_role": 1
    
  },
  {
   
    "id": 11,
    "uuid": "de8047dc-8f96-4083-b9c8-90dc2c0a815b",
    "identity": "chat",
    "create_permission": {
      "permission": true,
      "code": "can_create_chat"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_chat"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_chat"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_chat"
    },
    "urls": [],
    "platform_role": 1
   
  },
  {
   
    "id": 14,
    "uuid": "caf1cd0c-298b-4597-9cc2-a08945864459",
    "identity": "feature",
    "create_permission": {
      "permission": true,
      "code": "can_create_feature"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_feature"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_feature"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_feature"
    },
    "urls": [],
    "platform_role": 1
  
  },
  {
   
    "identity": "institute_all",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute_all"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute_all"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute_all"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute_all"
    },
    "urls": [],
    "platform_role": 1,
    "id": 16,
    "uuid": "9c8eba20-6493-494b-98aa-3bf1840d1770"
    
  },
  {
    
    "identity": "dashboard",
    "create_permission": {
      "permission": false,
      "code": null
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_dashboard"
    },
    "update_permission": {
      "permission": false,
      "code": null
    },
    "delete_permission": {
      "permission": false,
      "code": null
    },
    "urls": [],
    "is_active": true,
    "is_delete": true,
    "id": 18,
    "uuid": "45df3145-b347-4e89-9a6f-5e7b18867873"
   
  },
  {
   
    "id": 20,
    "uuid": "63d47a63-801a-4e46-bc20-a28ef787f5e9",
    "identity": "institute-branches",
    "create_permission": {
      "permission": false,
      "code": "cannot_create_institute_branches"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute_branches"
    },
    "update_permission": {
      "permission": false,
      "code": "cannot_update_institute_branches"
    },
    "delete_permission": {
      "permission": false,
      "code": "cannot_delete_institute_branches"
    },
    "urls": [],
    "platform_role": 1,
    "is_active": true,
    "is_delete": true
   
  },
  {
   
    "id": 48,
    "uuid": "f8a73f06-5aa3-4414-b2c4-46ccde0b7f04",
    "identity": "subscription-features",
    "create_permission": {
      "permission": true,
      "code": "can_create_subscription_features"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_subscription_features"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_subscrption_features"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_subscription_features"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
    
  },
  {
    
    "id": 42,
    "uuid": "e6990916-968b-4925-8722-654a734c1516",
    "identity": "institute",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
    
  },
  {
   
    "id": 39,
    "uuid": "2d8a8855-fd09-439b-b0b1-6b7024de6554",
    "identity": "subscription-plans",
    "create_permission": {
      "permission": true,
      "code": "can_create_subscription-plans"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_subscription-plans"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_subscription-plans"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_subscription-plans"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 53,
    "uuid": "de0d6ea6-f1bf-425e-b08b-a0963616bd7e",
    "identity": "institute-primary-branch",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute-primary-branch"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute-primary-branch"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute-primary-branch"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute-primary-branch"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 46,
    "uuid": "955a988b-5778-4d05-8a91-5bcdc6529936",
    "identity": "users",
    "create_permission": {
      "permission": true,
      "code": "can_create_users"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_users"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_users"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_users"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 41,
    "uuid": "1c7be7b0-28e7-4ce4-b483-555f0a504c9a",
    "identity": "faq",
    "create_permission": {
      "permission": true,
      "code": "can_create_faq"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_faq"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_faq"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_faq"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
    
  },
  {
   
    "id": 43,
    "uuid": "712cdd10-beeb-4b28-b242-06cd43acb8a2",
    "identity": "institute-admin",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute-admin"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute-admin"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute-admin"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute-admin"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 55,
    "uuid": "5f288257-b54f-4576-b776-3b2330c2aa05",
    "identity": "roles",
    "create_permission": {
      "permission": true,
      "code": "can_create_roles"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_roles"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_roles"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_roles"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
    
  },
  {
   
    "id": 54,
    "uuid": "1bad42ea-2ed9-4937-bad0-55a9297e21d0",
    "identity": "faq-category",
    "create_permission": {
      "permission": true,
      "code": "can_create_faq-category"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_faq-category"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_faq-category"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_faq-category"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 50,
    "uuid": "c4e34676-60e2-4bf7-b9e0-87f004a23c40",
    "identity": "subscription-payments",
    "create_permission": {
      "permission": true,
      "code": "can_create_subscription-payments"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_subscription-payments"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_subscription-payments"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_subscription-payments"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
    
  },
  {
   
    "id": 38,
    "uuid": "8d36cb82-742b-4be4-9676-5725ef1e540d",
    "identity": "ticket",
    "create_permission": {
      "permission": true,
      "code": "can_create_ticket"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_ticket"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_ticket"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_ticket"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
    
  },
  {
   
    "id": 40,
    "uuid": "e52b79de-fd46-43cf-b295-4441b2de5366",
    "identity": "notification",
    "create_permission": {
      "permission": true,
      "code": "can_create_notification"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_notification"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_notification"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_notification"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
   
    "id": 51,
    "uuid": "a1c59e6a-76b3-4b8b-8fc2-9e4a90059a68",
    "identity": "chat",
    "create_permission": {
      "permission": true,
      "code": "can_create_chat"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_chat"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_chat"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_chat"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 45,
    "uuid": "0bcac2ac-565e-4c58-bad8-4a9b6b54964a",
    "identity": "feature",
    "create_permission": {
      "permission": true,
      "code": "can_create_feature"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_feature"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_feature"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_feature"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
   
    "id": 49,
    "uuid": "814457bb-22bd-43e8-9029-5a4785b55922",
    "identity": "permissions",
    "create_permission": {
      "permission": true,
      "code": "can_create_permissions"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_permissions"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_permissions"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_permissions"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
   
  },
  {
    
    "id": 47,
    "uuid": "6defd033-c341-4b1a-857a-d63fd9211662",
    "identity": "institute_all",
    "create_permission": {
      "permission": true,
      "code": "can_create_institute_all"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute_all"
    },
    "update_permission": {
      "permission": true,
      "code": "can_update_institute_all"
    },
    "delete_permission": {
      "permission": true,
      "code": "can_delete_institute_all"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
  },
  {
    
    "id": 52,
    "uuid": "9b37ce94-9243-4330-9612-1b2ad070defb",
    "identity": "dashboard",
    "create_permission": {
      "permission": false,
      "code": null
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_dashboard"
    },
    "update_permission": {
      "permission": false,
      "code": null
    },
    "delete_permission": {
      "permission": false,
      "code": null
    },
    "urls": [],
    "platform_role": null,
    "is_active": true,
    "is_delete": true
  },
  {
   
    "id": 44,
    "uuid": "b2c35db6-35d3-46bc-86a8-8bdc608fdd44",
    "identity": "institute-branches",
    "create_permission": {
      "permission": false,
      "code": "cannot_create_institute_branches"
    },
    "read_permission": {
      "permission": true,
      "code": "can_read_institute_branches"
    },
    "update_permission": {
      "permission": false,
      "code": "cannot_update_institute_branches"
    },
    "delete_permission": {
      "permission": false,
      "code": "cannot_delete_institute_branches"
    },
    "urls": [],
    "platform_role": 22,
    "is_active": true,
    "is_delete": true
  }]


  
  const test = async function(roles) {
    const platform_permission_seeding = []; 
  
    for (const role of roles) {
      const uuid = await generateUUID(); 
      platform_permission_seeding.push({ ...role, uuid }); 
    }
  
    return platform_permission_seeding; 
  };
  
  const platform_permission_seeding = await test(permission); 
  
  
  
  export default platform_permission_seeding; 
  