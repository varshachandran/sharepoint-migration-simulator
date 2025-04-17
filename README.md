# SharePoint Data Migration Simulator

![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

A Node.js application that simulates migrating SharePoint HR data to Firebase Firestore, complete with data relationships and transformation.

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Setup](#-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Viewing Data](#-viewing-data)
- [License](#-license)

## ✨ Features
- CSV to Firestore document migration
- Automatic relationship mapping (departments ↔ employees)
- Data cleaning and type conversion
- Migration audit trail with timestamps
- Duplicate handling with UUID generation

## 🛠 Prerequisites
- Node.js v16+
- Firebase project with Firestore enabled
- Service account credentials

## 🚀 Setup

1. **Clone the repository**
   
   git clone https://github.com/your-username/sharepoint-migration-simulator.git
   cd sharepoint-migration-simulator

2. **Install dependencies**
    npm install
3. **Configure environment**
    Create .env file:

env

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."


Place your CSV at data/HRDataset_v14.csv


##  💻 Usage

Run the Migration Script:

node migrations/migration.js

Expected Output:

✅ CSV file successfully processed
✅ Created 7 departments
✅ Created 28 positions
✅ Migrated 311 employees


##  📂 Project Structure

.
├── data/                   # CSV data files
│   └── HRDataset_v14.csv   # Sample HR data
├── migrations/             # Migration scripts
│   ├── migration.js        # Main migration logic
│   └── transformData.js    # Data transformation
├── .env                    # Firebase configuration
├── .gitignore              # Ignore sensitive files
└── README.md               # This file

##  🔍 Viewing Data

1. Go to Firebase Console

2. Select your project

3. Navigate to Firestore Database → Data tab

4. Explore collections:

- employees

- departments

- positions



##  📜 License
