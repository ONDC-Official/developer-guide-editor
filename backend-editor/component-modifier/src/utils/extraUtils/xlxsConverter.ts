import * as XLSX from "xlsx";
import * as fs from "fs";

// Define the JSON data
const jsonData = {};

// Function to convert JSON data to worksheet
const jsonToSheet = (data: any[]): XLSX.WorkSheet => {
  return XLSX.utils.json_to_sheet(data);
};

// Function to create an Excel file with multiple sheets
const createExcelFile = (data: any, filePath: string) => {
  const workbook = XLSX.utils.book_new();

  // Add sheets to the workbook
  for (const [sheetName, sheetData] of Object.entries(data)) {
    const worksheet = jsonToSheet(sheetData as any);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  // Write the workbook to a file
  XLSX.writeFile(workbook, filePath);
};

// // Path where the Excel file will be saved
// const filePath = "output.xlsx";

// // Create the Excel file
// createExcelFile(jsonData, filePath);

// console.log(`Excel file created at ${filePath}`);
