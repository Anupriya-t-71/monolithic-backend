import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;


export const cleanObjectId = (obj) => {
    console.log(obj,"check cleaning")
    const cleanedObj = JSON.parse(JSON.stringify(obj));
    Object.keys(cleanedObj)?.forEach(key => {
        if (cleanedObj[key] instanceof ObjectId) {
            cleanedObj[key] = cleanedObj[key]?.toHexString();
        } else if (typeof cleanedObj[key] === 'object') {
            cleanedObj[key] = cleanObjectId(cleanedObj[key]);
        }
    });
    return cleanedObj;
};

export const getChanges = (existingObj, updatedObj, prefix = '') => {
    const changes = [];
    if(updatedObj === undefined){
        return ;
    }

    for (const key in updatedObj) {
        const fullPath = prefix ? `${prefix}.${key}` : key;

        if (key === 'updatedAt') continue;

        if (typeof updatedObj?.[key] === 'object' && updatedObj?.[key] !== null && !(updatedObj?.[key] instanceof ObjectId)) {
            changes.push(...getChanges(existingObj?.[key], updatedObj?.[key], fullPath));
        } else if (existingObj?.[key] instanceof ObjectId && updatedObj?.[key] instanceof ObjectId) {
            if (existingObj[key]?.toString() !== updatedObj[key]?.toString()) {
                changes.push({ field: fullPath, oldValue: existingObj?.[key]?.toString(), newValue: updatedObj?.[key]?.toString() });
            }
        } else if (existingObj?.[key] !== updatedObj?.[key]) {
            changes.push({ field: fullPath, oldValue: existingObj?.[key], newValue: updatedObj?.[key] });
        }
    }

    return changes;
};


export const formatChanges = (changes) => {
    let formattedString = '';
    changes.forEach((change, index) => {
        formattedString += `${change.field} changed from ${change.oldValue} to ${change.newValue}`;
        if (index < changes.length - 1) {
            formattedString += ', ';
        }
    });
    return formattedString;
};

