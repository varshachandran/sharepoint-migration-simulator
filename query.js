const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

async function getEmployeesByDepartment(departmentName) {
  // First get the department ID
  const departments = await db.collection('departments')
    .where('name', '==', departmentName)
    .get();
  
  if (departments.empty) {
    console.log('No department found with name:', departmentName);
    return;
  }
  
  const departmentId = departments.docs[0].id;
  
  // Then get employees in that department
  const employees = await db.collection('employees')
    .where('departmentRef', '==', db.doc(`departments/${departmentId}`))
    .get();
  
  console.log(`Employees in ${departmentName}:`);
  employees.forEach(doc => {
    console.log(`- ${doc.data().name} (${doc.data().position})`);
  });
}

// Example usage
getEmployeesByDepartment('Production');