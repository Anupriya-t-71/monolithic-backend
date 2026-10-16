import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
    const genUUID = uuidv4();
    return genUUID;
};

const roles = [{

    "identity": "super-admin",
    "uuid": "9607515a-95c1-45ec-9828-ab6fad025908",
    "id": 1
},
{

    "is_active": true,
    "is_delete": true,
    "id": 3

},
{

    "identity": "Developer",
    "is_active": true,
    "is_delete": false,
    "id": 12

},
{

    "identity": "Tester",
    "is_active": true,
    "is_delete": false,
    "id": 13
},
{

    "identity": "Engineer",
    "is_active": true,
    "is_delete": false,
    "id": 14
},
{

    "identity": "Test",
    "is_active": true,
    "is_delete": true,
    "id": 15

},
{

    "identity": "Final",
    "is_active": true,
    "is_delete": true,
    "id": 16

},
{

    "identity": "Institute Admin",
    "is_active": true,
    "is_delete": false,
    "id": 17
},
{

    "identity": "FinalTest",
    "is_active": true,
    "is_delete": false,
    "id": 18
},
{

    "identity": "TestTest",
    "is_active": true,
    "is_delete": false,
    "id": 19
},
{

    "identity": "Tested",
    "is_active": true,
    "is_delete": true,
    "id": 20
},
{

    "identity": "Testttt",
    "is_active": true,
    "is_delete": true,
    "id": 21

},
{

    "identity": "developer",
    "is_active": true,
    "is_delete": false,
    "id": 22

}]


const test = async function (roles) {
    const platform_roles_seeding = [];

    for (const role of roles) {
        const uuid = await generateUUID();
        platform_roles_seeding.push({ ...role, uuid });
    }

    return platform_roles_seeding;
};

const platform_roles_seeding = await test(roles);



export default platform_roles_seeding;
