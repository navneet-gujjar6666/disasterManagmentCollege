// File Upload Test Utility
// This file contains examples of how to use the file upload functionality

const fs = require('fs');
const path = require('path');

// Example of how to create a test file for upload testing
const createTestFile = (filename, content) => {
    const testDir = path.join(__dirname, '../test-files');
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    
    const filePath = path.join(testDir, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
};

// Example API calls for testing file uploads

/*
// 1. Create a contribution with file uploads
POST /api/contribution
Headers: 
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body (form-data):
  - disasterId: <disaster_id>
  - title: "Emergency Food Supply"
  - description: "Providing food supplies to affected areas"
  - contributionType: "material"
  - amount: 1000
  - files: [file1, file2, file3] (up to 5 files)
  - location: '{"type":"Point","coordinates":[longitude,latitude]}'
  - contactInfo: '{"phone":"1234567890","email":"test@example.com"}'
  - isAnonymous: false

// 2. Update contribution with additional files
PUT /api/contribution/:id
Headers:
  - Authorization: Bearer <token>
  - Content-Type: multipart/form-data

Body (form-data):
  - title: "Updated Emergency Food Supply"
  - description: "Updated description"
  - files: [new_file1, new_file2] (additional files)

// 3. Download a file
GET /api/contribution/:contributionId/files/:fileId/download

// 4. Delete a specific file
DELETE /api/contribution/:contributionId/files/:fileId
Headers:
  - Authorization: Bearer <token>

// 5. Get all contributions with filtering
GET /api/contribution?disasterId=<id>&status=pending&page=1&limit=10

// 6. Get specific contribution
GET /api/contribution/:id
*/

// Example of creating test files
const createSampleTestFiles = () => {
    console.log('Creating sample test files...');
    
    // Create a text file
    createTestFile('sample.txt', 'This is a sample text file for testing uploads.');
    
    // Create a JSON file
    createTestFile('data.json', JSON.stringify({
        name: 'Test Data',
        description: 'Sample JSON data for testing',
        timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log('Test files created in test-files directory');
};

// Export for use in other files
module.exports = {
    createTestFile,
    createSampleTestFiles
};

// Run this if file is executed directly
if (require.main === module) {
    createSampleTestFiles();
} 