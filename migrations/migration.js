const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const {transformEmployeeData} = require('./transformData');
require('dotenv').config();

// initialize firebase

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
})

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true }); 
const employees = [];
const departments = new Set();
const positions = new Set();

// To process CSV data
async function processCSV(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../data/HRDataset_v14.csv'))
        .pipe(csv())
        .on('data', (row) => {
            // clean and transform data
            const transformed = transformEmployeeData(row);
            employees.push(transformed);

            //track unique department and positions
            if (transformed.department) departments.add(transformed.department);
            if (transformed.position) positions.add(transformed.position);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            resolve();
        })
        .on('error', reject)
    });
}

// migrate data to Firestore
async function migrateData() {
    try {
        await processCSV();

        //create department documents
        const departmentPromises = Array.from(departments).map(async dept => {
            if (!dept) return null; // skip undefined or null
            const docRef = db.collection('department').doc();
            await docRef.set({
                name: dept,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
           return {name: dept, id: docRef.id};
             
        });

        //const departmentDocs = await Promise.all(departmentPromises);
        const departmentDocs = (await Promise.all(departmentPromises)).filter(Boolean);
        const departmentMap = departmentDocs.reduce((acc, curr) =>{
            acc[curr .name] = curr.id;
            return acc;
        }, {});

        // Create position documents
    const positionPromises = Array.from(positions).map(async pos => {
        if (!pos) return null; // skip undefined or null
        const docRef = db.collection('positions').doc();
        await docRef.set({
          title: pos,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return { title: pos, id: docRef.id };
      });
      
     // const positionDocs = await Promise.all(positionPromises);
      const positionDocs = (await Promise.all(positionPromises)).filter(Boolean);
      const positionMap = positionDocs.reduce((acc, curr) => {
        acc[curr.title] = curr.id;
        return acc;
      }, {});

        // Create employee documents with references
    const employeePromises = employees.map(async emp => {
        const docRef = db.collection('employees').doc();
        const employeeData = {
          ...emp,
          departmentRef: emp.department ? db.doc(`departments/${departmentMap[emp.department]}`) : null,
          positionRef: emp.position ? db.doc(`positions/${positionMap[emp.position]}`) : null,
          migratedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await docRef.set(employeeData);
        return docRef.id;
      });

      const employeeIds = await Promise.all(employeePromises);
    
    console.log(`Successfully migrated ${employeeIds.length} employees`);
    console.log(`Created ${departmentDocs.length} departments`);
    console.log(`Created ${positionDocs.length} positions`);
 
    }catch (error){
        console.error('migration failed:', error)
    }finally {
        process.exit();
      }
} 
migrateData();