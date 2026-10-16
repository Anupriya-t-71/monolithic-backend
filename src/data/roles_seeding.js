import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
  const genUUID = uuidv4();
  return genUUID;
};
const updatedRoles = [
  {
    identity: 'Institute Admin',
    description: 'Administrator role with full access',
    id: '1',
  },
  {
    identity: 'Teaching Staff',
    description: 'Teacher role with specific permissions',
    id: '2',
  },
  {
    identity: 'Student',
    description: 'Student role for limited access',
    id: '3',
  },
];

const test = async function(roles) {
  const roles_seeding = []; 

  for (const role of roles) {
    const uuid = await generateUUID(); 
    roles_seeding.push({ ...role, uuid }); 
  }

  return roles_seeding; 
};

const roles_seeding = await test(updatedRoles); 



export default roles_seeding; 

