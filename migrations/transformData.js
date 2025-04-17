const { v4: uuidv4 } = require('uuid');

function transformEmployeeData(row) {
  // Clean up data and handle missing values
  const cleanRow = {};
  for (const key in row) {
    if (row[key] === '') {
      cleanRow[key] = null;
    } else if (row[key] === 'N/A-StillEmployed') {
      cleanRow[key] = 'Active';
    } else {
      cleanRow[key] = row[key];
    }
  }

  // Parse dates
  const dateFields = ['DateofHire', 'DateofTermination', 'DOB', 'LastPerformanceReview_Date'];
  dateFields.forEach(field => {
    if (cleanRow[field]) {
      cleanRow[field] = new Date(cleanRow[field]);
    }
  });

  // Standardize department names by trimming whitespace
  if (cleanRow.Department) {
    cleanRow.Department = cleanRow.Department.trim();
  }

  // Create a normalized employee object
  return {
    id: uuidv4(),
    employeeId: cleanRow.EmpID,
    name: cleanRow.Employee_Name,
    //email: `${cleanRow.Employee_Name.replace(/[^a-zA-Z]/g, '').toLowerCase()}@company.com`,
    email: cleanRow.Employee_Name? `${cleanRow.Employee_Name.replace(/[^a-zA-Z]/g, '').toLowerCase()}@company.com`: null,
    department: row.Department?.trim() || 'Unknown',
    position: row.Position?.trim() || 'Unknown',
    salary: cleanRow.Salary ? parseFloat(cleanRow.Salary) : null,
    status: cleanRow.EmpStatusID === '1' ? 'Active' : cleanRow.EmpStatusID === '5' ? 'Terminated' : 'Unknown',
    hireDate: cleanRow.DateofHire,
    terminationDate: cleanRow.DateofTermination,
    terminationReason: cleanRow.TermReason,
    manager: cleanRow.ManagerName,
    performanceScore: cleanRow.PerformanceScore,
    engagementScore: cleanRow.EngagementSurvey ? parseFloat(cleanRow.EngagementSurvey) : null,
    satisfactionScore: cleanRow.EmpSatisfaction ? parseInt(cleanRow.EmpSatisfaction) : null,
    gender: cleanRow.Sex === 'M' ? 'Male' : cleanRow.Sex === 'F' ? 'Female' : 'Other',
    maritalStatus: cleanRow.MaritalDesc,
    citizenship: cleanRow.CitizenDesc,
    isHispanicLatino: cleanRow.HispanicLatino === 'Yes',
    race: cleanRow.RaceDesc,
    state: cleanRow.State,
    zipCode: cleanRow.Zip,
    dateOfBirth: cleanRow.DOB,
    recruitmentSource: cleanRow.RecruitmentSource,
    specialProjectsCount: cleanRow.SpecialProjectsCount ? parseInt(cleanRow.SpecialProjectsCount) : 0,
    lastReviewDate: cleanRow.LastPerformanceReview_Date,
    daysLateLast30: cleanRow.DaysLateLast30 ? parseInt(cleanRow.DaysLateLast30) : 0,
    absences: cleanRow.Absences ? parseInt(cleanRow.Absences) : 0,
    isFromDiversityJobFair: cleanRow.FromDiversityJobFairID === '1',
    rawData: cleanRow // Keep original data for reference
  };
}

module.exports = { transformEmployeeData };